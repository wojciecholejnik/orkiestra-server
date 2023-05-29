import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-dashboard-wrapper',
  templateUrl: './dashboard-wrapper.component.html',
  styleUrls: ['./dashboard-wrapper.component.scss']
})
export class DashboardWrapperComponent implements OnInit, OnDestroy {

  user?: User;

  _user?: Subscription;

  constructor(private navigationService: NavigationService) { }

  ngOnInit(): void {
    this._user = this.navigationService.isUserLogged.subscribe(user => this.user = user);
  }

  ngOnDestroy(): void {
    this._user?.unsubscribe();
  }

}
