import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models';
import { DashboardService } from '../dashboard.service';
import { OrchEvent, OrchEventDTO } from 'src/app/calendar/calendar-types';
import { CalendarService } from 'src/app/calendar/calendar.service';

@Component({
  selector: 'app-dashboard-events',
  templateUrl: './dashboard-events.component.html',
  styleUrls: ['./dashboard-events.component.scss']
})
export class DashboardEventsComponent implements OnInit, OnDestroy {

  @Input() user!: User;

  nearestEvents: OrchEvent[] = [];
  selectedEvent?: OrchEvent;
  changeStatusPending = false;
  currentIndex = 0;


  _nearestEvents?: Subscription;
  _changeStatus?: Subscription;
  
  constructor(private dashboardService: DashboardService, private calendarService: CalendarService) { }

  ngOnInit(): void {
    this._nearestEvents = this.dashboardService.readNearesetEvent().subscribe(res => {
      if (res && res.length > 0) {
        this.nearestEvents = res;
        this.selectedEvent = res[0]
      } else {
        this.nearestEvents = []
      }
    })
  }

  ngOnDestroy(): void {
    this._nearestEvents?.unsubscribe()
  }

  renderMyStatus(): string {
    let isPresent = false;
    const user = this.user;
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
    const user = this.user;
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

  showNextEvent(): void {
    this.currentIndex += 1;
    this.selectedEvent = this.nearestEvents[this.currentIndex];
  }

  disabledShowNext(): boolean {
    return this.currentIndex === this.nearestEvents.length - 1
  }

  showPreviousEvent(): void {
    this.currentIndex -= 1;
    this.selectedEvent = this.nearestEvents[this.currentIndex];
  }

  disabledShowPrevious(): boolean {
    return this.currentIndex === 0
  }

}
