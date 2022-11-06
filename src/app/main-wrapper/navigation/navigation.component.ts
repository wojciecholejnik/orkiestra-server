import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavOption } from 'src/app/shared/models';
import { NavigationService } from '../navigation-service.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {

  navigationSubscription?: Subscription;

  constructor(private navigationService: NavigationService) { }

  navOptions: NavOption[] = []

  ngOnInit(): void {
    this.navigationSubscription = this.navigationService.activeModule.subscribe(options => this.navOptions = options);
  }

  changeActiveItem(name: string){
    this.navOptions.forEach(option => {
      if (option.name !== name) {
        option.isActive = false;
      } else {
        option.isActive = true;
      }
    })
    this.navigationService.activeModule.next(this.navOptions);
  }

  ngOnDestroy(): void {
      this.navigationSubscription?.unsubscribe();
  }

}
