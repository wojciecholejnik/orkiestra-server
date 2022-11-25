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

  _navOptions?: Subscription;
  _deviceType?: Subscription;
  navOptions: NavOption[] = []
  deviceType = '';
  navIsOpen = false;

  constructor(private navigationService: NavigationService) { }

  ngOnInit(): void {
    this._navOptions = this.navigationService.activeModule.subscribe(options => this.navOptions = options);
    this._deviceType = this.navigationService.deviceType.subscribe(type => this.deviceType = type);
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
      this._navOptions?.unsubscribe();
      this._deviceType?.unsubscribe();
  }

  toggleNav(){
    this.navIsOpen = !this.navIsOpen;
  }

}
