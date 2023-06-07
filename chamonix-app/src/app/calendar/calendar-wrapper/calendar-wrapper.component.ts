import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { Roles } from 'src/app/shared/models';
import { ToastService } from 'src/app/shared/toast-service/toast.service';
import { CalendarService } from '../calendar.service';
import { OrchEvent } from '../calendar-types';

@Component({
  selector: 'app-calendar-wrapper',
  templateUrl: './calendar-wrapper.component.html',
  styleUrls: ['./calendar-wrapper.component.scss']
})
export class CalendarWrapperComponent implements OnInit, OnDestroy {

  constructor(
    private calendarService: CalendarService,
    private navigationService: NavigationService,
    private toastService: ToastService) { }

  canEdit = false;
  deviceType = 'laptop';
  loading = false;
  events: OrchEvent[] = [];
  showingYear: number = new Date().getFullYear();
  detailsModalIsOpen = false;

  private _deviceType?: Subscription;
  private _events?: Subscription;
  private _showingYear?: Subscription;
  private _detailsModalIsOpen?: Subscription;
  private _loading?: Subscription;

  ngOnInit(): void {
    this.canEdit = this.navigationService.getUser()?.role === Roles.bandDirector;
    this._deviceType = this.navigationService.deviceType.subscribe(type => this.deviceType = type);
    this._events = this.calendarService.$events.subscribe(events => this.events = events);
    this._showingYear = this.calendarService.$showingYear.subscribe(year => this.showingYear = year);
    this._detailsModalIsOpen = this.calendarService.$detailsModalIsOpen.subscribe(state => this.detailsModalIsOpen = state);
    this._loading = this.calendarService.$loading.subscribe(state => this.loading = state);
    this.calendarService.getEvents();
    if (window.location.pathname.split('/').length === 3) {
      this.calendarService.$detailsModalIsOpen.next(false);
    }
    if (window.location.pathname.split('/').length > 3) {
      this.calendarService.$detailsModalIsOpen.next(true);
    }
  }

  ngOnDestroy(): void {
    this._deviceType?.unsubscribe();
    this._events?.unsubscribe();
    this._showingYear?.unsubscribe();
    this._detailsModalIsOpen?.unsubscribe();
    this._loading?.unsubscribe();
  }

  goNextYear(){
    this.calendarService.goNextYear()
  }

  goPreviousYear(){
    this.calendarService.goPreviousYear()
  }

  userCanChange(): boolean {
    return this.calendarService.canUserChangeEvent()
  }
}