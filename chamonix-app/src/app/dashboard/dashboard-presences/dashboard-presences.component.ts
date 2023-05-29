import { Component, Input, OnDestroy, OnInit,  } from '@angular/core';
import { Subscription } from 'rxjs';
import { Lesson, User } from 'src/app/shared/models';
import { DashboardService } from '../dashboard.service';
import { SingleSeries } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard-presences',
  templateUrl: './dashboard-presences.component.html',
  styleUrls: ['./dashboard-presences.component.scss']
})
export class DashboardPresencesComponent implements OnInit, OnDestroy {

  @Input() user!: User;
  lessons?: Lesson[];
  range: 'month' | 'year' = 'month';
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth();

  _lessons?: Subscription

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getPresences()
  }

  ngOnDestroy(): void {
    this._lessons?.unsubscribe()
  }

  getPresences(): void {
    let rangeValue = this.selectedYear.toString()
    if (this.range === 'month') {
      let monthValue = (this.selectedMonth + 1).toString()
      if (monthValue.length < 2) {
        monthValue = `0${monthValue}`
      }

      rangeValue += `-${monthValue}`
    }

    this._lessons = this.dashboardService.readPresences(rangeValue).subscribe(res => {
      let counted = {
        present: 0,
        absent: 0,
        late: 0
      }
      const mappedLesson = res.map(lesson => (
        {
          ...lesson,
          userStatus: lesson.members.find(member => member._id === this.user._id)?.status
        }
      ))
      mappedLesson.forEach(lesson => {
        if (lesson.userStatus && lesson.userStatus === 'present') {
          counted.present += 1
        }
        if (lesson.userStatus && lesson.userStatus === 'absent') {
          counted.absent += 1
        }
        if (lesson.userStatus && lesson.userStatus === 'late') {
          counted.late += 1
        }
      })
      this.data = [
        {
          name: 'Obecności',
          value: counted.present,
        },
        {
          name: 'Nieobecności',
          value: counted.absent,
        },
        {
          name: 'Spóźnień',
          value: counted.late,
        },
      ];
        
    })
  }

  onRangeChange() {
    this.getPresences()
  }

  changeSelected(direction: 'increase' | 'decrease') {

    if (this.range === 'year') {
      if (direction === 'increase') {
        if (this.selectedYear === new Date().getFullYear()) return
        this.selectedYear += 1
      }
      if (direction === 'decrease') {
        this.selectedYear -= 1
      }
    }

    if (this.range === 'month') {
      if (direction === 'increase') {
        if (this.selectedYear === new Date().getFullYear() && this.selectedMonth === new Date().getMonth()) return
        if (this.selectedMonth === 11) {
          this.selectedYear +=1
          this.selectedMonth = 0
        } else {
          this.selectedMonth += 1
        }
      }
      if (direction === 'decrease') {
        if (this.selectedMonth === 0 ) {
          this.selectedYear -= 1
          this.selectedMonth = 11
        } else {
          this.selectedMonth -= 1
        }
      }
    }

    this.getPresences()
  }

  showMonth(): string {
    switch (this.selectedMonth) {
      case 0: { 
        return 'styczeń';
      }
      case 1: { 
        return 'luty';
      }
      case 2: { 
        return 'marzec';
      }
      case 3: { 
        return 'kwiecień';
      }
      case 4: { 
        return 'maj';
      }
      case 5: { 
        return 'czerwiec';
      }
      case 6: { 
        return 'lipiec';
      }
      case 7: { 
        return 'sierpień';
      }
      case 8: { 
        return 'wrzesień';
      }
      case 9: { 
        return 'październik';
      }
      case 10: { 
        return 'listopad';
      }
      case 11: { 
        return 'grudzień';
      }

      default: {
        return '';
      }
    }
  }

  countPerMonth(): void {

  }

  data: SingleSeries = [
    {
      name: 'Obecności',
      value: 5,
    },
    {
      name: 'Nieobecności',
      value: 2,
    },
    {
      name: 'Spóźnień',
      value: 1,
    },
  ];

  customColors: any[] = [
    {
      name: 'Obecności',
      value: 'green'
    },
    {
      name: 'Spóźnień',
      value: 'yellow'
    },
    {
      name: 'Nieobecności',
      value: 'red'
    },
  ];

}
