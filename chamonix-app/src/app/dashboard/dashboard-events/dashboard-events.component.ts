import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavOptions, Roles, User } from 'src/app/shared/models';
import { DashboardService } from '../dashboard.service';
import { OrchEvent, OrchEventDTO } from 'src/app/calendar/calendar-types';
import { CalendarService } from 'src/app/calendar/calendar.service';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';

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
  currentMemberState: boolean | undefined;


  _nearestEvents?: Subscription;
  _changeStatus?: Subscription;
  
  constructor(
    private dashboardService: DashboardService,
    private calendarService: CalendarService,
    private _router: Router,
    private navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    this._nearestEvents = this.dashboardService.readNearesetEvent().subscribe(res => {
      if (res && res.length > 0) {
        this.nearestEvents = res;
        this.selectedEvent = res[0]
        this.checkCurrentStatus()
      } else {
        this.nearestEvents = []
      }
    })
  }

  ngOnDestroy(): void {
    this._nearestEvents?.unsubscribe()
  }

  checkCurrentStatus(): void {
  
    if (this.user && this.selectedEvent!.members.find(item => item._id === this.user._id)) {
      this.currentMemberState = true
    } else if (this.user && this.selectedEvent!.membersAbsent.find(item => item._id === this.user._id)) {
      this.currentMemberState = false
    } else {
      this.currentMemberState = undefined
    }

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
    } else if (updatedStatus === 'false') {
      mappedEvent.membersAbsent.push(user._id)
      const index = mappedEvent.members.findIndex(item => item === user._id)
      if (index >= 0) mappedEvent.members.splice(index, 1)
    } else if (updatedStatus === 'undefined') {
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

  showNextEvent(): void {
    this.currentIndex += 1;
    this.selectedEvent = this.nearestEvents[this.currentIndex];
    this.checkCurrentStatus()
  }

  disabledShowNext(): boolean {
    return this.currentIndex === this.nearestEvents.length - 1
  }

  showPreviousEvent(): void {
    this.currentIndex -= 1;
    this.selectedEvent = this.nearestEvents[this.currentIndex];
    this.checkCurrentStatus();
  }

  disabledShowPrevious(): boolean {
    return this.currentIndex === 0
  }

  showDetails(): void {
    this._router.navigate([`/main/${NavOptions.calendar}/details/${this.selectedEvent?._id}`])
  }

  disabledView(): boolean {
    return this.navigationService.getUser()?.role === Roles.spectator
  }

}
