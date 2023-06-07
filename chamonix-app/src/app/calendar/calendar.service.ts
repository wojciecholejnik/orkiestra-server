import { Injectable, OnDestroy } from '@angular/core';
import { OrchEvent, OrchEventDTO } from './calendar-types';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavigationService } from '../main-wrapper/navigation-service.service';
import { Roles } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CalendarService implements OnDestroy {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }),
  };
  private apiHost: string;

  currentYear: number = new Date().getFullYear();
  $events: BehaviorSubject<OrchEvent[]> = new BehaviorSubject<OrchEvent[]>([]);
  $showingYear: BehaviorSubject<number> = new BehaviorSubject(new Date().getFullYear());
  $detailsModalIsOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $selectedEvent: BehaviorSubject<OrchEvent | null> = new BehaviorSubject<OrchEvent | null>(null);
  $loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $addNewEventModalIsOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $editEventModalIsOpen: BehaviorSubject<OrchEvent | undefined> = new BehaviorSubject<OrchEvent | undefined>(undefined);

  private _events?: Subscription;

  constructor(private http: HttpClient, private navigationService: NavigationService) { 
    this.apiHost = environment.baseApiUrl;
  }

  ngOnDestroy(): void {
    this._events?.unsubscribe();
  }

  selectEvent(event: OrchEvent): void {
    this.$selectedEvent.next(event);
    this.$detailsModalIsOpen.next(true);
  }

  closeDetailsModal(): void {
    this.$selectedEvent.next(null);
    this.$detailsModalIsOpen.next(false);
  }

  getEvents(): void {
    this.$loading.next(true);
    this._events = this.http.get<any>(`${this.apiHost}/getEventsForYear/${this.$showingYear.getValue()}`).subscribe({
      next: (res) => {
        this.$events.next(res)
        this.$loading.next(false);
      },
      error: (e) => {
        console.log(e)
        this.$loading.next(false);
      }
    })
  }

  getEventById(id: string): Observable<OrchEvent> {
    return this.http.get<OrchEvent>(`${this.apiHost}/event-details/${id}`, this.httpOptions)
  }

  goNextYear(): void {
    this.$showingYear.next(this.$showingYear.getValue() + 1);
    this.getEvents()
  }

  goPreviousYear(): void {
    this.$showingYear.next(this.$showingYear.getValue() - 1);
    this.getEvents()
  }

  openAddNewEventModal(): void {
    this.$editEventModalIsOpen.next(undefined)
    this.$selectedEvent.next(null)
    this.$addNewEventModalIsOpen.next(true)
  }

  closeAddNewEventModal(): void {
    this.$addNewEventModalIsOpen.next(false);
    this.$editEventModalIsOpen.next(undefined)
    this.$selectedEvent.next(null)
  }

  addEvent(newEvent: OrchEventDTO): Observable<OrchEvent[]> {
    return this.http.post<OrchEvent[]>(`${this.apiHost}/addNewEvent/${this.$showingYear.getValue()}`, newEvent, this.httpOptions)
  }

  updateEvent(enevtToUpdate: OrchEventDTO): Observable<OrchEvent[]> {
    return this.http.post<OrchEvent[]>(`${this.apiHost}/updateEvent/${this.$showingYear.getValue()}`, enevtToUpdate, this.httpOptions)
  }

  deleteEvent(id: string): Observable<OrchEvent[]> {
    return this.http.post<OrchEvent[]>(`${this.apiHost}/deleteEvent/${this.$showingYear.getValue()}`, {id: id}, this.httpOptions)
  }

  canUserChangeEvent(): boolean {
    return this.navigationService.getUser()?.role === Roles.bandDirector
    || this.navigationService.getUser()?.role === Roles.instructor
    || this.navigationService.getUser()?.role === Roles.inspector
  }

}
