import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { OrchEvent } from '../calendar-types';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
  providers: [DatePipe]
})
export class EventsListComponent implements OnInit, OnDestroy {

  constructor(
    private calendarService: CalendarService,
    private _router: Router
  ) { }

  @Input() list: OrchEvent[] = [];
  removeEventModalOpen = false;
  eventToRemove?: OrchEvent;

  private _remove?: Subscription;

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._remove?.unsubscribe()
  }

  openModalDetails(event: OrchEvent): void {
    this.calendarService.selectEvent(event);
    this._router.navigate([`main/calendar/details/${event._id}`])
  }

  startEdit(event: OrchEvent): void {
    this.calendarService.$editEventModalIsOpen.next(event)
  }

  openRemoveModal(event: OrchEvent): void {
    this.eventToRemove = event;
    this.removeEventModalOpen = true;
  }

  removeEvent(): void {
    if (this.eventToRemove) {
      this.calendarService.$loading.next(true);
      this.calendarService.deleteEvent(this.eventToRemove._id).subscribe(res => {
        this.calendarService.$events.next(res);
        this.calendarService.$loading.next(false);
      })
    }
  }

  abortRemove(): void {
    this.eventToRemove = undefined;
    this.removeEventModalOpen = false;
  }

  userCanChange(): boolean {
    return this.calendarService.canUserChangeEvent()
  }

  isFromPast(date: string): boolean {
    return new Date(date) < new Date()
  }

}
