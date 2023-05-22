import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { Subscription } from 'rxjs';
import { EventExternalMember, OrchEvent, OrchEventDTO } from '../calendar-types';
import { MembersService } from 'src/app/members/members.service';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { DeviceType } from 'src/app/shared/models';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss']
})
export class NewEventComponent implements OnInit, OnDestroy {
  isOpen = false;
  externalEventMembers: EventExternalMember[] =[];
  memberListVisible = false;
  externalMemberListVisible = false;
  eventMembers: EventMemberMapped[] = [];
  newExternalMember: EventExternalMember = {
    name: '',
    instrument: '',
    phone: ''
  }
  emptyEvent: OrchEventDTO = {
    dateFrom: new Date().toDateString(),
    dateTo: undefined,
    title: '',
    description: '',
    members: [],
    externalMembers: [],
    address: '',
    closed: false,
    year: 0
  }
  newEvent: OrchEventDTO = {...this.emptyEvent}
  eventToEdit?: OrchEvent;
  requestPending = false;
  device: DeviceType = DeviceType.laptop

  private _isOpen?: Subscription;
  private _activeMembers?: Subscription;
  private _addNewEvent?: Subscription;
  private _editEventModalIsOpen?: Subscription;
  private _device?: Subscription;

  constructor(private calendarService: CalendarService, private membersService: MembersService, private navigationService: NavigationService) { }

  ngOnInit(): void {
    this._device = this.navigationService.deviceType.subscribe(type => this.device = type)
    this._isOpen = this.calendarService.$addNewEventModalIsOpen.subscribe(state => this.isOpen = state);
    this._editEventModalIsOpen = this.calendarService.$editEventModalIsOpen.subscribe(item => {
      this.eventToEdit = item;
      if (this.eventToEdit) {
        this.calendarService.$addNewEventModalIsOpen.next(true);
        this.newEvent = {...this.eventToEdit, members: this.eventToEdit.members.map(item => item._id)}
        this.eventMembers = this.eventMembers.map(member => (
          {
            ...member,
            present: this.eventToEdit!.members.find(item => item._id === member._id) ? true : false
          }
        ))
        this.externalEventMembers = this.eventToEdit.externalMembers;
      } else {
        this.newEvent = {...this.emptyEvent};
        this.externalEventMembers = [];
        this.eventMembers = this.eventMembers.map(member => (
          {
            ...member,
            present: false
          }
        ))
      }

    });
    this.membersService.getActiveMembers().subscribe(members => this.eventMembers = members.map(item => (
      {
        _id: item._id,
        firstName: item.firstName,
        lastName: item.lastName,
        present: false,
      }
      )))
  }

  ngOnDestroy(): void {
    this._isOpen?.unsubscribe();
    this._activeMembers?.unsubscribe();
    this._addNewEvent?.unsubscribe();
    this._editEventModalIsOpen?.unsubscribe();
  }

  openModal(): void {
    this.calendarService.openAddNewEventModal()
  }

  closeModal(): void {
    this.calendarService.closeAddNewEventModal()
  }

  count(present: boolean): number {
    return present ? this.eventMembers.filter(member => member.present).length : this.eventMembers.filter(member => !member.present).length
  }

  togglePresence(index: number): void {
    this.eventMembers[index].present = !this.eventMembers[index].present
  }

  toggleMembersLIstVisible(): void {
    this.memberListVisible = !this.memberListVisible
  }

  toggleExternalMembersLIstVisible(): void {
    this.externalMemberListVisible = !this.externalMemberListVisible
  }

  addExternalMember(): void {
    if (!this.newExternalMember.name && !this.newExternalMember.instrument) return
    this.externalEventMembers.push(this.newExternalMember)
    this.clearNewExternalMember()
  }

  clearNewExternalMember(): void {
    this.newExternalMember = {
      name: '',
      instrument: '',
      phone: ''
    }
  }

  removeExternalMember(index: number): void {
    this.externalEventMembers.splice(index, 1)
  }

  saveEvent(): void {
    const presentMembers = this.eventMembers.filter(member => member.present);
    const mapedNewEvent: OrchEventDTO = {
      ...this.newEvent,
      members: presentMembers.map(member => member._id),
      externalMembers: this.externalEventMembers,
      year: new Date(this.newEvent.dateFrom).getFullYear()
    }
    if (
      this.newEvent.title.length > 0
      && this.newEvent.dateFrom.length > 0
      && this.newEvent.address.length > 0
      && this.newEvent.description.length > 0
      ) {
        this.requestPending = true;
        this.calendarService.$loading.next(true);
        if (!this.eventToEdit) {
          this.calendarService.addEvent(mapedNewEvent).subscribe(res => {
            this.calendarService.$events.next(res);
            this.calendarService.$loading.next(false);
            this.closeModal()
            this.requestPending = false;
          })
        }
        if (this.eventToEdit) {
          this.calendarService.updateEvent(mapedNewEvent).subscribe(res => {
            this.calendarService.$events.next(res);
            this.calendarService.$selectedEvent.next(null)
            this.calendarService.$loading.next(false);
            this.closeModal()
            this.requestPending = true;
          })
        }
      }
  }

  phoneDevice(): boolean {
    return this.device === DeviceType.phone
  }

}

interface EventMemberMapped {
  _id: string,
  firstName: string,
  lastName: string,
  present: boolean,
}
