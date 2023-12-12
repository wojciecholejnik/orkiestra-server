import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { Roles, User } from 'src/app/shared/models';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashbord-intruments',
  templateUrl: './dashbord-intruments.component.html',
  styleUrls: ['./dashbord-intruments.component.scss']
})
export class DashbordIntrumentsComponent implements OnInit, OnDestroy {

  private _resourcesInstrument?: Subscription;

  @Input() user!: User;
  instruments: any[] = [];

  constructor(private navigationService: NavigationService, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this._resourcesInstrument = this.dashboardService.readMusicianInstruments(this.user._id).subscribe(res => {
      this.instruments = res
    })
  }

  ngOnDestroy(): void {
    this._resourcesInstrument?.unsubscribe();
  }

  disabledView(): boolean {
    return this.navigationService.getUser()?.role === Roles.spectator
  }

}
