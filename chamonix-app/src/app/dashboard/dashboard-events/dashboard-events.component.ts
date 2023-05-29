import { Component, Input, OnDestroy, OnInit,  } from '@angular/core';
import { Subscription } from 'rxjs';
import { Lesson, User } from 'src/app/shared/models';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard-events',
  templateUrl: './dashboard-events.component.html',
  styleUrls: ['./dashboard-events.component.scss']
})
export class DashboardEventsComponent implements OnInit, OnDestroy {

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
      console.log(res)
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

}
