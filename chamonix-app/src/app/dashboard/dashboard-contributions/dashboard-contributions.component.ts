import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContributionsService } from 'src/app/contributions/contributions.service';
import { ContributionListMember, ContributionsList, User } from 'src/app/shared/models';

@Component({
  selector: 'app-dashboard-contributions',
  templateUrl: './dashboard-contributions.component.html',
  styleUrls: ['./dashboard-contributions.component.scss']
})
export class DashboardContributionsComponent implements OnInit, OnDestroy {

  @Input() user!: User;
  currentYear: number = new Date().getFullYear();
  showingYear: number = new Date().getFullYear();
  memberMonths?: ContributionListMember

  loading = false;

  _list?: Subscription;

  constructor(
    private contribubtionsService: ContributionsService,
  ) { }

  ngOnInit(): void {
    this._list = this.contribubtionsService.listToShow.subscribe(list => {
      if (list.year || list.error) {
        this.loading = false;
      }
      if (list.error) {
        this.memberMonths = undefined
      }
      if (list.year) {
        this.memberMonths = list.members.find((item: any) => item.member._id === this.user._id);
        this.showingYear = list.year
      }
    });
    this.contribubtionsService.getListForYear(this.currentYear);
  }

  ngOnDestroy(): void {
    this._list?.unsubscribe();
  }

  changeSelected(direction: 'increase' | 'decrease') {
    if (direction === 'increase') {
      if (this.showingYear === new Date().getFullYear()) return
      this.showingYear += 1;
      this.loading = true;
    }
    if (direction === 'decrease') {
      this.showingYear -= 1;
      this.loading = true;
    }
    this.contribubtionsService.getListForYear(this.showingYear);
  }

  isBehindOnPayment(monthNr: number): boolean {
    const today = new Date();
    const monthToCheck = new Date(new Date().setFullYear(this.showingYear, monthNr, 1))
    return today > monthToCheck
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

}
