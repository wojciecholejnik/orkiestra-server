import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CalendarService } from '../calendar.service';
import { EventMember, OrchEvent } from '../calendar-types';
import { Location } from '@angular/common';
import { MembersService } from 'src/app/members/members.service';
import { Member } from 'src/app/shared/models';
import { area } from 'd3';

@Component({
  selector: 'app-event-preview',
  templateUrl: './event-preview.component.html',
  styleUrls: ['./event-preview.component.scss']
})
export class EventPreviewComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private calendarService: CalendarService,
    private location: Location,
    private membersServcie: MembersService
  ) { }

  event?: OrchEvent;
  activeMembers: Member[] = [];
  eventMembersUnset: EventMember[] = [];

  private _details?: Subscription;
  private _activeMembers?: Subscription;

  ngOnInit(): void {
    this._activeMembers = this.membersServcie.getActiveMembers().subscribe(res => {
      this.activeMembers = res;
      this.getEventData();
    })
  }

  ngOnDestroy(): void {
    this._details?.unsubscribe();
    this._activeMembers?.unsubscribe();
  }

  getEventData(): void {
    this.route.paramMap.subscribe(param => {
      const id = param.get('id')
      if (id) {
        this._details = this.calendarService.getEventById(id).subscribe(res => {
          if (res && res._id) {
            this.event = res;
            this.activeMembers.forEach(member => {
              const isPresent = this.event!.members.findIndex(item => item._id === member._id) >= 0;
              const isAbsent = this.event!.membersAbsent.findIndex(item => item._id === member._id) >= 0;
              if (!isPresent && !isAbsent) {
                this.eventMembersUnset.push(member)
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
            })
          }
        })
      }
    })
  }

  back(): void {
    this.location.back()
  }

  showPresent(): EventMember[] {
    return this.event!.members
  }

  showAbsent(): EventMember[] {
    return this.event!.membersAbsent
  }

}
