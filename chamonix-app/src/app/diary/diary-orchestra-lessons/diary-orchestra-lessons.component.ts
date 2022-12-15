import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MembersService } from 'src/app/members/members.service';
import { Lesson, Member } from 'src/app/shared/models';
import {DatePipe} from "@angular/common";
import { DiaryService } from '../diary.service';

@Component({
    selector: 'app-diary-orchestra-lessons',
    templateUrl: './diary-orchestra-lessons.component.html',
    styleUrls: ['./diary-orchestra-lessons.component.scss'],
  providers: [DatePipe]
})
export class DiaryOrchestraLessonsComponent implements OnInit, OnDestroy {

    _musicians?: Subscription;
    musicians: Member[] = [];
    _presences?: Subscription;
    presences: Lesson[] = [];
    today: Date = new Date();
    showingDate = new Date(new Date(new Date().setHours(0,0,0,0)).setDate(1));
    showingMonth = '';
    filteredLessons: Lesson[] = [];
    musiciansLoading = true;
    presencesLoading = true;
    dateFrom: Date = new Date();
    dateTo: Date = new Date();
    buttonDisabled = false;

    constructor(private membersService: MembersService, private diaryService: DiaryService) { }

    ngOnInit(): void {
        this.getMusicians();
        this.showingMonth = this.showMonthName(this.showingDate.getMonth());
        this.getPresences();
    }

    getMusicians(): void {
        this._musicians = this.membersService.getMainStaffMembers().subscribe(musicians => {
            this.musicians = musicians;
            this.musiciansLoading = false;
        });
    }

    getPresences(): void {
        this._presences = this.diaryService.readPresences().subscribe(presences => {
            this.presences = presences.map((lesson: Lesson) => ({...lesson, date: new Date(lesson.date)}));
            this.filterLessons();
            this.presencesLoading = false;
        })
    }

    showMonthName(monthNr: number): string {
      switch (monthNr) {
        case 0 : {
          return 'styczeń'
        }
        case 1 : {
          return 'luty'
        }
        case 2 : {
          return 'marzec'
        }
        case 3 : {
          return 'kwiecień'
        }
        case 4 : {
          return 'maj'
        }
        case 5 : {
          return 'czerwiec'
        }
        case 6 : {
          return 'lipiec'
        }
        case 7 : {
          return 'sierpień'
        }
        case 8 : {
          return 'wrzesień'
        }
        case 9 : {
          return 'październik'
        }
        case 10 : {
          return 'listopad'
        }
        case 11 : {
          return 'grudzień'
        }
        default : {
          return ''
        }
      }
    }

    monthEarlier(): void {
      this.showingDate = new Date(new Date(this.showingDate).setMonth(this.showingDate.getMonth() - 1));
      this.showingMonth = this.showMonthName(this.showingDate.getMonth());
      this.filterLessons();
    }

    monthLater(): void {
      if (this.showingDate < this.today) {
        this.showingDate = new Date(new Date(this.showingDate).setMonth(this.showingDate.getMonth() + 1));
        this.showingMonth = this.showMonthName(this.showingDate.getMonth());
        this.filterLessons();
      }
    }

    ngOnDestroy(): void {
        this._musicians?.unsubscribe();
    }

    filterLessons(): void {
        this.dateFrom = this.showingDate;
        this.dateTo = new Date(new Date(this.showingDate).setMonth(this.showingDate.getMonth() + 1));

        this.filteredLessons = this.presences.filter(lesson => lesson.date >= this.dateFrom && lesson.date < this.dateTo)
    }

    toggleDisableButtons(event: any): void {
      this.buttonDisabled = event;
    }

}
