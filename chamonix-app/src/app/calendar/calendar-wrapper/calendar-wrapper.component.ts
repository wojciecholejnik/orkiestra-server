import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { Roles } from 'src/app/shared/models';
import { ToastService } from 'src/app/shared/toast-service/toast.service';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-calendar-wrapper',
  templateUrl: './calendar-wrapper.component.html',
  styleUrls: ['./calendar-wrapper.component.scss']
})
export class CalendarWrapperComponent implements OnInit {

  constructor(
    private calendarService: CalendarService,
    private navigationService: NavigationService,
    private toastService: ToastService) { }

  canEdit = false;
  deviceType = 'laptop';
  loading = false;
  listToShow: any[] = [];
  currentYear: number = new Date().getFullYear();
  showingYear: number = new Date().getFullYear();

  $deviceType?: Subscription;
  $list?: Subscription;

  ngOnInit(): void {
    this.$deviceType = this.navigationService.deviceType.subscribe(type => this.deviceType = type);
    // this.$list = this.calendarService.listToShow.subscribe(list => {
    //   this.listToShow = list;
    //   if (list.year || list.error) {
    //     this.loading = false;
    //   }
    //   if (list.year) {
    //     this.showingYear = list.year
    //   }
    // });
    //this.calendarService.getListForYear(this.currentYear);
    this.canEdit = this.navigationService.getUser()?.role === Roles.bandDirector
    this.listToShow = this.mockedEvents;
  }

  ngOnDestroy(): void {
    this.$deviceType?.unsubscribe();
    this.$list?.unsubscribe();
  }

  goNextYear(){
    this.loading = true;
    this.showingYear += 1;
    // this.contribubtionsService.getListForYear(this.showingYear);
  }

  goPreviousYear(){
    this.loading = true;
    this.showingYear -= 1;
    // this.contribubtionsService.getListForYear(this.showingYear);
  }

  mockedEvents = [
    {
      _id: '12eqdas2312',
      dateFrom: new Date(),
      dateTo: new Date(new Date().setDate(new Date().getDate() + 1)),
      title: "Warsztaty orkiestrowe",
      membersParticipating: [
        {
          _id: "6367b0005c83ed6633e28fcf",
          firstName: "Anna",
          lastName: "Adamczyk"
        },
        {
          _id: "63679e3c5c83ed6633e28d7e",
          firstName: "Magdalena",
          lastName: "Adamczyk"
        },
        {
          _id: "63679daf5c83ed6633e28d66",
          firstName: "Artur",
          lastName: "Duszczyk"
        }
      ],
      externalMembers: [
        {
          name: "Ryszard Śliwa",
          phone: "123456789"
        }
      ]
    },
    {
      _id: '12eqdas2312',
      dateFrom: new Date(new Date().setDate(new Date().getDate() -20)),
      dateTo: null,
      title: "Koncert",
      membersParticipating: [
        {
          _id: "6367b0005c83ed6633e28fcf",
          firstName: "Anna",
          lastName: "Adamczyk"
        },
        {
          _id: "63679e3c5c83ed6633e28d7e",
          firstName: "Magdalena",
          lastName: "Adamczyk"
        },
        {
          _id: "63679daf5c83ed6633e28d66",
          firstName: "Artur",
          lastName: "Duszczyk"
        }
      ],
      externalMembers: []
    }
  ]

}
