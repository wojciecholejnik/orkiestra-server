import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { Subscription } from 'rxjs';
import { EventExternalMember, OrchEvent, OrchEventDTO } from '../calendar-types';
import { MembersService } from 'src/app/members/members.service';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { DeviceType } from 'src/app/shared/models';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

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
  eventMembersPresent: EventMemberMapped[] = [];
  eventMembersAbsent: EventMemberMapped[] = [];
  eventMembersUnset: EventMemberMapped[] = [];
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
    membersAbsent: [],
    externalMembers: [],
    address: '',
    closed: false,
    year: 0,
    playlist: '',
    uniforms: '',
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
        this.newEvent = {
          ...this.eventToEdit,
          members: this.eventToEdit.members.map(item => item._id),
          membersAbsent: this.eventToEdit.membersAbsent.map(item => item._id)
        };
        this.eventMembers = this.eventMembers.map(member => (
          {
            ...member,
            present: this.eventToEdit!.members.find(item => item._id === member._id) 
            ? true 
            : (this.eventToEdit!.membersAbsent.find(item => item._id === member._id) ? false : undefined)
          }
        ))
        this.eventMembersPresent = this.eventMembers.filter(member => member.present === true);
        this.eventMembersAbsent = this.eventMembers.filter(member => member.present === false);
        this.eventMembersUnset = this.eventMembers.filter(member => member.present === undefined);
        this.externalEventMembers = this.eventToEdit.externalMembers;
        setTimeout(() => {
          const areas = document.querySelectorAll('textarea')
          if (!areas) return
          else {
            areas.forEach(area => {
              area.style.height = (area.scrollHeight + 2)+ 'px';
            })
          }
        }, 100)
      } else {
        this.newEvent = {...this.emptyEvent};
        this.externalEventMembers = [];
        this.eventMembers = this.eventMembers.map(member => (
          {
            ...member,
            present: undefined
          }
        ))
        this.eventMembersAbsent = [];
        this.eventMembersPresent = [];
        this.eventMembersUnset = this.eventMembers
      }

    });
    this.membersService.getActiveMembers().subscribe(members => this.eventMembers = members.map(item => (
      {
        _id: item._id,
        firstName: item.firstName,
        lastName: item.lastName,
        present: undefined,
      }
      )))
  }

  ngOnDestroy(): void {
    this._isOpen?.unsubscribe();
    this._activeMembers?.unsubscribe();
    this._addNewEvent?.unsubscribe();
    this._editEventModalIsOpen?.unsubscribe();
  }

  drop(event: CdkDragDrop<EventMemberMapped[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.sortMemberTable(this.eventMembersPresent);
    this.sortMemberTable(this.eventMembersAbsent);
    this.sortMemberTable(this.eventMembersUnset);
  }

  sortMemberTable(table: EventMemberMapped[]): void {
    table.sort((a, b) => {
      if (a.lastName > b.lastName ) {
        return 1
      } else if (a.lastName < b.lastName) {
        return -1
      } else {
        return a.firstName > b.firstName ? 1 : -1
      }
    })
  }

  openModal(): void {
    this.calendarService.openAddNewEventModal()
  }

  closeModal(): void {
    this.calendarService.closeAddNewEventModal()
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
    const presentMembers = this.eventMembersPresent;
    const absentMembers = this.eventMembersAbsent;
    const mapedNewEvent: OrchEventDTO = {
      ...this.newEvent,
      members: presentMembers.map(member => member._id),
      membersAbsent: absentMembers.map(member => member._id),
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
            this.requestPending = false;
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
  present: boolean | undefined,
}
