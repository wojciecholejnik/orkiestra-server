import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MembersService } from 'src/app/members/members.service';
import { Member } from 'src/app/shared/models';
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-diary-orchestra-lessons',
    templateUrl: './diary-orchestra-lessons.component.html',
    styleUrls: ['./diary-orchestra-lessons.component.scss'],
  providers: [DatePipe]
})
export class DiaryOrchestraLessonsComponent implements OnInit, OnDestroy {

    _musicians?: Subscription;
    musicians: Member[] = [];
    today: Date = new Date();
    showingDate = new Date();
    showingMonth = '';

    constructor(private membersService: MembersService) { }

    ngOnInit(): void {
        this.getMusicians();
        this.showingMonth = this.showMonthName(this.showingDate.getMonth());
    }

    getMusicians(): void {
        this._musicians = this.membersService.getMainStaffMembers().subscribe(musicians => {
            this.musicians = musicians;
        });
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
    }

  monthLater(): void {
    if (this.showingDate < this.today) {
      this.showingDate = new Date(new Date(this.showingDate).setMonth(this.showingDate.getMonth() + 1));
      this.showingMonth = this.showMonthName(this.showingDate.getMonth());
    }
  }

    ngOnDestroy(): void {
        this._musicians?.unsubscribe();
    }

  mockedData = [
    {
      date: new Date(new Date().setMonth(11, 12)),
      type: 'normal-lesson',
      members: ['63679e3c5c83ed6633e28d7e', '6367a3d25c83ed6633e28e8a', '6367a3ec5c83ed6633e28e90', '63679e925c83ed6633e28dae', '63679e925c83ed6633e28dae', '63679e925c83ed6633e28dae']
    },
    {
      date: new Date(new Date().setMonth(11, 7)),
      type: 'normal-lesson',
      members: ['63679e3c5c83ed6633e28d7e', '6367a3d25c83ed6633e28e8a', '63679e925c83ed6633e28dae', '63679e925c83ed6633e28dae', '63679e925c83ed6633e28dae']
    },
    {
      date: new Date(new Date().setMonth(11, 5)),
      type: 'normal-lesson',
      members: ['63679e3c5c83ed6633e28d7e', '6367a3d25c83ed6633e28e8a', '6367a3ec5c83ed6633e28e90', '63679e925c83ed6633e28dae', '63679e925c83ed6633e28dae', '63679e925c83ed6633e28dae']
    }
  ];

}
