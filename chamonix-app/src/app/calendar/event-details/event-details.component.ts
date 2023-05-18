import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { Subscription } from 'rxjs';
import { OrchEvent } from '../calendar-types';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit, OnDestroy {

  _selectedEvent?: Subscription;

  selectedEvent: OrchEvent | null = null;

  constructor(private calendarService: CalendarService) { }

  ngOnInit(): void {
    this._selectedEvent = this.calendarService.$selectedEvent.subscribe(event => this.selectedEvent = event);
  }

  ngOnDestroy(): void {
    this._selectedEvent?.unsubscribe();
  }

  closeModal(): void {
    this.calendarService.closeDetailsModal();
  }

  edit(): void {
    if (this.selectedEvent) {
      this.calendarService.$editEventModalIsOpen.next(this.selectedEvent)
    }
  }

  userCanChange(): boolean {
    return this.calendarService.canUserChangeEvent()
  }

}
