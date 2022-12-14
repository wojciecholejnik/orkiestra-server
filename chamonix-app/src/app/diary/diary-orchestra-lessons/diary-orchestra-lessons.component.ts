import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MembersService } from 'src/app/members/members.service';
import { Lesson, Member } from 'src/app/shared/models';
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
    showingDate = new Date(new Date(new Date().setHours(8,0,0,0)).setDate(1));
    showingMonth = '';
    filteredLessons: Lesson[] = [];

    constructor(private membersService: MembersService) { }

    ngOnInit(): void {
        this.getMusicians();
        this.showingMonth = this.showMonthName(this.showingDate.getMonth());
        this.filterLessons();
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

    filterLessons() {
        const dateFrom = this.showingDate;
        const dateTo = new Date(new Date(this.showingDate).setMonth(this.showingDate.getMonth() + 1));

        this.filteredLessons = this.mockedData.filter(lesson => lesson.date >= dateFrom && lesson.date < dateTo)
    }

  mockedData: Lesson[] = [
    {
      date: new Date(new Date().setMonth(11, 12)),
      type: 'normal-lesson',
      members: [
        {
            "_id": "6367b0005c83ed6633e28fcf",
            "status": "absent"
        },
        {
            "_id": "63679e3c5c83ed6633e28d7e",
            "status": "present"
        },
        {
            "_id": "6367a0a45c83ed6633e28e31",
            "status": "present"
        },
        {
            "_id": "6367a0ef5c83ed6633e28e3d",
            "status": "present"
        },
        {
            "_id": "63679daf5c83ed6633e28d66",
            "status": "absent"
        },
        {
            "_id": "6367a3d25c83ed6633e28e8a",
            "status": "absent"
        },
        {
            "_id": "6367a1425c83ed6633e28e4f",
            "status": "present"
        },
        {
            "_id": "6367a3ec5c83ed6633e28e90",
            "status": "present"
        },
        {
            "_id": "63679e925c83ed6633e28dae",
            "status": "absent"
        },
        {
            "_id": "6367a1a65c83ed6633e28e5b",
            "status": "present"
        },
        {
            "_id": "63679d625c83ed6633e28d40",
            "status": "present"
        },
        {
            "_id": "6367a5425c83ed6633e28f2f",
            "status": "absent"
        },
        {
            "_id": "63679f7c5c83ed6633e28dfe",
            "status": "present"
        },
        {
            "_id": "6367a1815c83ed6633e28e55",
            "status": "present"
        },
        {
            "_id": "6367a5695c83ed6633e28f3b",
            "status": "absent"
        },
        {
            "_id": "6367a5ac5c83ed6633e28f48",
            "status": "present"
        },
        {
            "_id": "6367a0c85c83ed6633e28e37",
            "status": "present"
        },
        {
            "_id": "636a736da6234ccedad4ee68",
            "status": "absent"
        },
        {
            "_id": "6367a00a5c83ed6633e28e16",
            "status": "present"
        },
        {
            "_id": "6367a3ae5c83ed6633e28e84",
            "status": "present"
        },
        {
            "_id": "6367a64a5c83ed6633e28f60",
            "status": "present"
        },
        {
            "_id": "63679ebe5c83ed6633e28dc6",
            "status": "present"
        },
        {
            "_id": "6367a4a65c83ed6633e28f1d",
            "status": "present"
        },
        {
            "_id": "6367a1e45c83ed6633e28e61",
            "status": "present"
        },
        {
            "_id": "6367a5c05c83ed6633e28f54",
            "status": "present"
        },
        {
            "_id": "6367a11a5c83ed6633e28e43",
            "status": "present"
        },
        {
            "_id": "636799bb5c83ed6633e28d2e",
            "status": "present"
        },
        {
            "_id": "6367a1335c83ed6633e28e49",
            "status": "present"
        }
      ]
    },
    {
      date: new Date(new Date().setMonth(11, 7)),
      type: 'normal-lesson',
      members: [
        {
            "_id": "6367b0005c83ed6633e28fcf",
            "status": "present"
        },
        {
            "_id": "63679e3c5c83ed6633e28d7e",
            "status": "absent"
        },
        {
            "_id": "6367a0a45c83ed6633e28e31",
            "status": "late"
        },
        {
            "_id": "6367a0ef5c83ed6633e28e3d",
            "status": "absent"
        },
        {
            "_id": "63679daf5c83ed6633e28d66",
            "status": "absent"
        },
        {
            "_id": "6367a3d25c83ed6633e28e8a",
            "status": "present"
        },
        {
            "_id": "6367a1425c83ed6633e28e4f",
            "status": "present"
        },
        {
            "_id": "6367a3ec5c83ed6633e28e90",
            "status": "present"
        },
        {
            "_id": "63679e925c83ed6633e28dae",
            "status": "absent"
        },
        {
            "_id": "6367a1a65c83ed6633e28e5b",
            "status": "present"
        },
        {
            "_id": "63679d625c83ed6633e28d40",
            "status": "present"
        },
        {
            "_id": "6367a5425c83ed6633e28f2f",
            "status": "absent"
        },
        {
            "_id": "63679f7c5c83ed6633e28dfe",
            "status": "present"
        },
        {
            "_id": "6367a1815c83ed6633e28e55",
            "status": "present"
        },
        {
            "_id": "6367a5695c83ed6633e28f3b",
            "status": "absent"
        },
        {
            "_id": "6367a5ac5c83ed6633e28f48",
            "status": "present"
        },
        {
            "_id": "6367a0c85c83ed6633e28e37",
            "status": "present"
        },
        {
            "_id": "636a736da6234ccedad4ee68",
            "status": "absent"
        },
        {
            "_id": "6367a00a5c83ed6633e28e16",
            "status": "present"
        },
        {
            "_id": "6367a3ae5c83ed6633e28e84",
            "status": "present"
        },
        {
            "_id": "6367a64a5c83ed6633e28f60",
            "status": "present"
        },
        {
            "_id": "63679ebe5c83ed6633e28dc6",
            "status": "present"
        },
        {
            "_id": "6367a4a65c83ed6633e28f1d",
            "status": "present"
        },
        {
            "_id": "6367a1e45c83ed6633e28e61",
            "status": "present"
        },
        {
            "_id": "6367a5c05c83ed6633e28f54",
            "status": "present"
        },
        {
            "_id": "6367a11a5c83ed6633e28e43",
            "status": "present"
        },
        {
            "_id": "636799bb5c83ed6633e28d2e",
            "status": "present"
        },
        {
            "_id": "6367a1335c83ed6633e28e49",
            "status": "present"
        }
      ]    
    },
    {
      date: new Date(new Date().setMonth(11, 5)),
      type: 'normal-lesson',
      members: [
        {
            "_id": "6367b0005c83ed6633e28fcf",
            "status": "absent"
        },
        {
            "_id": "63679e3c5c83ed6633e28d7e",
            "status": "present"
        },
        {
            "_id": "6367a0a45c83ed6633e28e31",
            "status": "late"
        },
        {
            "_id": "6367a0ef5c83ed6633e28e3d",
            "status": "present"
        },
        {
            "_id": "63679daf5c83ed6633e28d66",
            "status": "absent"
        },
        {
            "_id": "6367a3d25c83ed6633e28e8a",
            "status": "absent"
        },
        {
            "_id": "6367a1425c83ed6633e28e4f",
            "status": "present"
        },
        {
            "_id": "6367a3ec5c83ed6633e28e90",
            "status": "present"
        },
        {
            "_id": "63679e925c83ed6633e28dae",
            "status": "absent"
        },
        {
            "_id": "6367a1a65c83ed6633e28e5b",
            "status": "present"
        },
        {
            "_id": "63679d625c83ed6633e28d40",
            "status": "present"
        },
        {
            "_id": "6367a5425c83ed6633e28f2f",
            "status": "absent"
        },
        {
            "_id": "63679f7c5c83ed6633e28dfe",
            "status": "present"
        },
        {
            "_id": "6367a1815c83ed6633e28e55",
            "status": "present"
        },
        {
            "_id": "6367a5695c83ed6633e28f3b",
            "status": "absent"
        },
        {
            "_id": "6367a5ac5c83ed6633e28f48",
            "status": "present"
        },
        {
            "_id": "6367a0c85c83ed6633e28e37",
            "status": "present"
        },
        {
            "_id": "636a736da6234ccedad4ee68",
            "status": "absent"
        },
        {
            "_id": "6367a00a5c83ed6633e28e16",
            "status": "present"
        },
        {
            "_id": "6367a3ae5c83ed6633e28e84",
            "status": "present"
        },
        {
            "_id": "6367a64a5c83ed6633e28f60",
            "status": "present"
        },
        {
            "_id": "63679ebe5c83ed6633e28dc6",
            "status": "present"
        },
        {
            "_id": "6367a4a65c83ed6633e28f1d",
            "status": "present"
        },
        {
            "_id": "6367a1e45c83ed6633e28e61",
            "status": "present"
        },
        {
            "_id": "6367a5c05c83ed6633e28f54",
            "status": "present"
        },
        {
            "_id": "6367a11a5c83ed6633e28e43",
            "status": "present"
        },
        {
            "_id": "636799bb5c83ed6633e28d2e",
            "status": "present"
        },
        {
            "_id": "6367a1335c83ed6633e28e49",
            "status": "present"
        }
      ]    
    },
    {
        date: new Date(new Date().setMonth(10, 12)),
        type: 'normal-lesson',
        members: [
          {
              "_id": "6367b0005c83ed6633e28fcf",
              "status": "absent"
          },
          {
              "_id": "63679e3c5c83ed6633e28d7e",
              "status": "present"
          },
          {
              "_id": "6367a0a45c83ed6633e28e31",
              "status": "present"
          },
          {
              "_id": "6367a0ef5c83ed6633e28e3d",
              "status": "present"
          },
          {
              "_id": "63679daf5c83ed6633e28d66",
              "status": "absent"
          },
          {
              "_id": "6367a3d25c83ed6633e28e8a",
              "status": "absent"
          },
          {
              "_id": "6367a1425c83ed6633e28e4f",
              "status": "present"
          },
          {
              "_id": "6367a3ec5c83ed6633e28e90",
              "status": "present"
          },
          {
              "_id": "63679e925c83ed6633e28dae",
              "status": "absent"
          },
          {
              "_id": "6367a1a65c83ed6633e28e5b",
              "status": "present"
          },
          {
              "_id": "63679d625c83ed6633e28d40",
              "status": "present"
          },
          {
              "_id": "6367a5425c83ed6633e28f2f",
              "status": "absent"
          },
          {
              "_id": "63679f7c5c83ed6633e28dfe",
              "status": "present"
          },
          {
              "_id": "6367a1815c83ed6633e28e55",
              "status": "present"
          },
          {
              "_id": "6367a5695c83ed6633e28f3b",
              "status": "absent"
          },
          {
              "_id": "6367a5ac5c83ed6633e28f48",
              "status": "present"
          },
          {
              "_id": "6367a0c85c83ed6633e28e37",
              "status": "present"
          },
          {
              "_id": "636a736da6234ccedad4ee68",
              "status": "absent"
          },
          {
              "_id": "6367a00a5c83ed6633e28e16",
              "status": "present"
          },
          {
              "_id": "6367a3ae5c83ed6633e28e84",
              "status": "present"
          },
          {
              "_id": "6367a64a5c83ed6633e28f60",
              "status": "present"
          },
          {
              "_id": "63679ebe5c83ed6633e28dc6",
              "status": "present"
          },
          {
              "_id": "6367a4a65c83ed6633e28f1d",
              "status": "present"
          },
          {
              "_id": "6367a1e45c83ed6633e28e61",
              "status": "present"
          },
          {
              "_id": "6367a5c05c83ed6633e28f54",
              "status": "present"
          },
          {
              "_id": "6367a11a5c83ed6633e28e43",
              "status": "present"
          },
          {
              "_id": "636799bb5c83ed6633e28d2e",
              "status": "present"
          },
          {
              "_id": "6367a1335c83ed6633e28e49",
              "status": "present"
          }
        ]
      },
      {
        date: new Date(new Date().setMonth(10, 7)),
        type: 'normal-lesson',
        members: [
          {
              "_id": "6367b0005c83ed6633e28fcf",
              "status": "present"
          },
          {
              "_id": "63679e3c5c83ed6633e28d7e",
              "status": "absent"
          },
          {
              "_id": "6367a0a45c83ed6633e28e31",
              "status": "late"
          },
          {
              "_id": "6367a0ef5c83ed6633e28e3d",
              "status": "absent"
          },
          {
              "_id": "63679daf5c83ed6633e28d66",
              "status": "absent"
          },
          {
              "_id": "6367a3d25c83ed6633e28e8a",
              "status": "present"
          },
          {
              "_id": "6367a1425c83ed6633e28e4f",
              "status": "present"
          },
          {
              "_id": "6367a3ec5c83ed6633e28e90",
              "status": "present"
          },
          {
              "_id": "63679e925c83ed6633e28dae",
              "status": "absent"
          },
          {
              "_id": "6367a1a65c83ed6633e28e5b",
              "status": "present"
          },
          {
              "_id": "63679d625c83ed6633e28d40",
              "status": "present"
          },
          {
              "_id": "6367a5425c83ed6633e28f2f",
              "status": "absent"
          },
          {
              "_id": "63679f7c5c83ed6633e28dfe",
              "status": "present"
          },
          {
              "_id": "6367a1815c83ed6633e28e55",
              "status": "present"
          },
          {
              "_id": "6367a5695c83ed6633e28f3b",
              "status": "absent"
          },
          {
              "_id": "6367a5ac5c83ed6633e28f48",
              "status": "present"
          },
          {
              "_id": "6367a0c85c83ed6633e28e37",
              "status": "present"
          },
          {
              "_id": "636a736da6234ccedad4ee68",
              "status": "absent"
          },
          {
              "_id": "6367a00a5c83ed6633e28e16",
              "status": "present"
          },
          {
              "_id": "6367a3ae5c83ed6633e28e84",
              "status": "present"
          },
          {
              "_id": "6367a64a5c83ed6633e28f60",
              "status": "present"
          },
          {
              "_id": "63679ebe5c83ed6633e28dc6",
              "status": "present"
          },
          {
              "_id": "6367a4a65c83ed6633e28f1d",
              "status": "present"
          },
          {
              "_id": "6367a1e45c83ed6633e28e61",
              "status": "present"
          },
          {
              "_id": "6367a5c05c83ed6633e28f54",
              "status": "present"
          },
          {
              "_id": "6367a11a5c83ed6633e28e43",
              "status": "present"
          },
          {
              "_id": "636799bb5c83ed6633e28d2e",
              "status": "present"
          },
          {
              "_id": "6367a1335c83ed6633e28e49",
              "status": "present"
          }
        ]    
      },
      {
        date: new Date(new Date().setMonth(9, 5)),
        type: 'normal-lesson',
        members: [
          {
              "_id": "6367b0005c83ed6633e28fcf",
              "status": "absent"
          },
          {
              "_id": "63679e3c5c83ed6633e28d7e",
              "status": "present"
          },
          {
              "_id": "6367a0a45c83ed6633e28e31",
              "status": "late"
          },
          {
              "_id": "6367a0ef5c83ed6633e28e3d",
              "status": "present"
          },
          {
              "_id": "63679daf5c83ed6633e28d66",
              "status": "absent"
          },
          {
              "_id": "6367a3d25c83ed6633e28e8a",
              "status": "absent"
          },
          {
              "_id": "6367a1425c83ed6633e28e4f",
              "status": "present"
          },
          {
              "_id": "6367a3ec5c83ed6633e28e90",
              "status": "present"
          },
          {
              "_id": "63679e925c83ed6633e28dae",
              "status": "absent"
          },
          {
              "_id": "6367a1a65c83ed6633e28e5b",
              "status": "present"
          },
          {
              "_id": "63679d625c83ed6633e28d40",
              "status": "present"
          },
          {
              "_id": "6367a5425c83ed6633e28f2f",
              "status": "absent"
          },
          {
              "_id": "63679f7c5c83ed6633e28dfe",
              "status": "present"
          },
          {
              "_id": "6367a1815c83ed6633e28e55",
              "status": "present"
          },
          {
              "_id": "6367a5695c83ed6633e28f3b",
              "status": "absent"
          },
          {
              "_id": "6367a5ac5c83ed6633e28f48",
              "status": "present"
          },
          {
              "_id": "6367a0c85c83ed6633e28e37",
              "status": "present"
          },
          {
              "_id": "636a736da6234ccedad4ee68",
              "status": "absent"
          },
          {
              "_id": "6367a00a5c83ed6633e28e16",
              "status": "present"
          },
          {
              "_id": "6367a3ae5c83ed6633e28e84",
              "status": "present"
          },
          {
              "_id": "6367a64a5c83ed6633e28f60",
              "status": "present"
          },
          {
              "_id": "63679ebe5c83ed6633e28dc6",
              "status": "present"
          },
          {
              "_id": "6367a4a65c83ed6633e28f1d",
              "status": "present"
          },
          {
              "_id": "6367a1e45c83ed6633e28e61",
              "status": "present"
          },
          {
              "_id": "6367a5c05c83ed6633e28f54",
              "status": "present"
          },
          {
              "_id": "6367a11a5c83ed6633e28e43",
              "status": "present"
          },
          {
              "_id": "636799bb5c83ed6633e28d2e",
              "status": "present"
          },
          {
              "_id": "6367a1335c83ed6633e28e49",
              "status": "present"
          }
        ]    
      },
  ];

}
