import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { Subscription } from 'rxjs';
import { OrchEvent, OrchEventDTO } from '../calendar-types';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit, OnDestroy {

  _selectedEvent?: Subscription;
  _changeStatus?: Subscription;

  selectedEvent: OrchEvent | null = null;
  membersOpen = false;
  externalMembersOpen = false;
  changeStatusPending = false;

  constructor(private calendarService: CalendarService, private navigationService: NavigationService) { }

  ngOnInit(): void {
    this._selectedEvent = this.calendarService.$selectedEvent.subscribe(event => this.selectedEvent = event);
  }

  ngOnDestroy(): void {
    this._selectedEvent?.unsubscribe();
    this._changeStatus?.unsubscribe();
  }

  closeModal(): void {
    this.calendarService.closeDetailsModal();
  }

  edit(): void {
    if (this.selectedEvent) {
      this.calendarService.$editEventModalIsOpen.next(this.selectedEvent)
      this.closeModal()
    }
  }

  userCanChange(): boolean {
    return this.calendarService.canUserChangeEvent()
  }

  toggleMembersOpen(): void {
    if (this.selectedEvent?.members.length === 0) return
    this.membersOpen = !this.membersOpen
  }

  toggleExternalMembersOpen(): void {
    if (this.selectedEvent?.externalMembers.length === 0) return
    this.externalMembersOpen = !this.externalMembersOpen
  }

  isFromFuture(date: string): boolean {
    return new Date(date) > new Date()
  }

  renderMyStatus(): string {
    const user = this.navigationService.getUser();
    let isPresent = false;
    if (user && this.selectedEvent && this.selectedEvent.members.find(item => item._id === user._id)) {
      isPresent = true
    }
    if (user && isPresent) {
      return user.firstName.charAt(user.firstName.length-1) === 'a' ? 'obecna' : 'obecny'
    } else if (user && !isPresent) {
      return user.firstName.charAt(user.firstName.length-1) === 'a' ? 'nieobecna' : 'nieobecny'
    } else {
      return '---'
    }
  }

  changeMyStatus(): void {
    const user = this.navigationService.getUser();
    if (!this.selectedEvent) return
    if (!user) return
    this.changeStatusPending = true
    const currentStatus = this.selectedEvent && this.selectedEvent.members.find(item => item._id === user._id)

    const mappedEvent: OrchEventDTO = {
      ...this.selectedEvent,
      members: this.selectedEvent.members.map(item => item._id)
    }
    

    if (currentStatus) {
      const index = mappedEvent.members.findIndex(item => item === user._id)
      mappedEvent.members.splice(index, 1)
    } else {
      mappedEvent.members.push(user._id)
    }

    this._changeStatus = this.calendarService.updateEvent(mappedEvent).subscribe({
      next: (res) => {
        if (currentStatus && this.selectedEvent) {
          const index = this.selectedEvent.members.findIndex(item => item._id === user._id)
          this.selectedEvent.members.splice(index, 1)
        } else {
          this.selectedEvent?.members.push({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName
          })
        }
        this.calendarService.$events.next(res)
        this.changeStatusPending = false
      },
      error: () => {
        this.changeStatusPending = false
      }
    })

    
  }
}
