import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { Subscription } from 'rxjs';
import { EventMember, OrchEvent, OrchEventDTO } from '../calendar-types';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast-service/toast.service';
import { MembersService } from 'src/app/members/members.service';
import { Roles } from 'src/app/shared/models';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit, OnDestroy {

  private _selectedEvent?: Subscription;
  private _changeStatus?: Subscription;
  private _activeMembers?: Subscription;
  private _event?: Subscription;

  selectedEvent: OrchEvent | null = null;
  membersOpen = false;
  externalMembersOpen = false;
  changeStatusPending = false;
  eventMembersUnset: EventMember[] = [];
  activeMembers: EventMember[] = [];
  currentMemberState: boolean | undefined;

  constructor(
    private calendarService: CalendarService,
    private navigationService: NavigationService,
    private _router: Router,
    private toastService: ToastService,
    private membersService: MembersService
  ) { }

  ngOnInit(): void {
    this._activeMembers = this.membersService.getActiveMembers().subscribe(members => {
      this.activeMembers = members.map(item => ({
          _id: item._id,
          firstName: item.firstName,
          lastName: item.lastName,
          present: undefined,
        })
      );
      this._selectedEvent = this.calendarService.$selectedEvent.subscribe(event => {
        this.selectedEvent = event;
        if (this.selectedEvent) {
          this.activeMembers.forEach(member => {
            const isPresent = this.selectedEvent!.members.findIndex(item => item._id === member._id) >= 0;
            const isAbsent = this.selectedEvent!.membersAbsent.findIndex(item => item._id === member._id) >= 0;
            if (!isPresent && !isAbsent) {
              this.eventMembersUnset.push(member)
            }
          })
          const user = this.navigationService.getUser();
          let isPresent = undefined;
          if (user && this.selectedEvent.members.find(item => item._id === user._id)) {
            isPresent = true
          }
          if (user && this.selectedEvent.membersAbsent.find(item => item._id === user._id)) {
            isPresent = false
          }
          this.currentMemberState = isPresent
        }
        else {
          const id = window.location.pathname.split('/')[4]
          this.calendarService.getEventById(id).subscribe(res => {
            if (res && res._id) {
              this.calendarService.$selectedEvent.next(res);
            }
          })
        }
        setTimeout(() => {
          const areas = document.querySelectorAll('textarea')
          if (!areas) return
          else {
            areas.forEach(area => {
              area.style.height = (area.scrollHeight + 2)+ 'px';
            })
          }
        }, 100)
      });
    }
  )
    
  }

  ngOnDestroy(): void {
    this._selectedEvent?.unsubscribe();
    this._changeStatus?.unsubscribe();
    this._activeMembers?.unsubscribe();
    this._event?.unsubscribe();
  }

  closeModal(): void {
    this.calendarService.closeDetailsModal();
    this._router.navigate([`main/calendar`])
  }

  showPresent(): EventMember[] {
    return this.selectedEvent!.members
  }

  showAbsent(): EventMember[] {
    return this.selectedEvent!.membersAbsent
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

  renderMyStatus(isPresent: boolean | undefined): string {
    const user = this.navigationService.getUser();

    if (user && isPresent === true) {
      return user.firstName.charAt(user.firstName.length-1) === 'a' ? 'obecna' : 'obecny'
    } else if (user && isPresent === false) {
      return user.firstName.charAt(user.firstName.length-1) === 'a' ? 'nieobecna' : 'nieobecny'
    } else {
      return 'nie wiem'
    }
  }

  changeMyStatus(): void {

    const user = this.navigationService.getUser();
    if (!this.selectedEvent) return
    if (!user) return

    this.changeStatusPending = true
    const updatedStatus: string = this.currentMemberState as any;

    const mappedEvent: OrchEventDTO = {
      ...this.selectedEvent,
      members: this.selectedEvent.members.map(item => item._id),
      membersAbsent: this.selectedEvent.membersAbsent.map(item => item._id),
    }
    
    if (updatedStatus === 'true') {
      mappedEvent.members.push(user._id)
      const index = mappedEvent.membersAbsent.findIndex(item => item === user._id)
      if (index >= 0) mappedEvent.membersAbsent.splice(index, 1)
    } 
    
    if (updatedStatus === 'false') {
      mappedEvent.membersAbsent.push(user._id)
      const index = mappedEvent.members.findIndex(item => item === user._id)
      if (index >= 0) mappedEvent.members.splice(index, 1)
    } 
    
    if (updatedStatus === 'undefined') {
      const index = mappedEvent.members.findIndex(item => item === user._id)
      mappedEvent.members.splice(index, 1)
      const index2 = mappedEvent.membersAbsent.findIndex(item => item === user._id)
      mappedEvent.membersAbsent.splice(index2, 1)
    }



    this._changeStatus = this.calendarService.updateEvent(mappedEvent).subscribe({
      next: (res) => {
        if (updatedStatus === 'true' && this.selectedEvent) {
          const index = this.selectedEvent.membersAbsent.findIndex(item => item._id === user._id)
          this.selectedEvent.membersAbsent.splice(index, 1)
          this.selectedEvent.members.push({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName
          })
        } 
        if (updatedStatus === 'false' && this.selectedEvent) {
          const index = this.selectedEvent.members.findIndex(item => item._id === user._id)
          this.selectedEvent.members.splice(index, 1)
          this.selectedEvent.membersAbsent.push({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName
          })
        }
        if (updatedStatus === 'undefined' && this.selectedEvent) {
          const index = this.selectedEvent!.membersAbsent.findIndex(item => item._id === user._id)
          this.selectedEvent!.membersAbsent.splice(index, 1)
          const index2 = this.selectedEvent!.members.findIndex(item => item._id === user._id)
          this.selectedEvent!.members.splice(index2, 1)
        }
        this.calendarService.$events.next(res)
        this.changeStatusPending = false
      },
      error: () => {
        this.changeStatusPending = false
      }
    })
  
  }

  copyUrl(): void {
    const urlParts = window.location.href.split('/');
    const url = urlParts[0] + '//' + urlParts[2] + '/' + `calendar-event/${this.selectedEvent?._id}`
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastService.show('Skopiowano', { classname: 'bg-success text-light', delay: 1500 })
  }

  disabledView(): boolean {
    return this.navigationService.getUser()?.role === Roles.spectator
  }
}
