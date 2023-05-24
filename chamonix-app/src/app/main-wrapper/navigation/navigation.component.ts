import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActiveModule, NavOption, NavOptions } from 'src/app/shared/models';
import { NavigationService } from '../navigation-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {

  _navOptions?: Subscription;
  _deviceType?: Subscription;
  navOptions: ActiveModule[] = []
  deviceType = '';
  navIsOpen = false;

  constructor(private navigationService: NavigationService, private _router: Router,) { }

  ngOnInit(): void {
    this._navOptions = this.navigationService.activeModule.subscribe(options => this.navOptions = options);
    this._deviceType = this.navigationService.deviceType.subscribe(type => this.deviceType = type);
  }

  changeActiveItem(module: ActiveModule){
    this.checkIsActive(module.href)
    this._router.navigate([`main/${module.href}`])
    this.navOptions.forEach(option => {
      if (option.name !== module.name) {
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

  checkIsActive(name: NavOptions): boolean {
    const route = this._router.url.split('/')[2]
    return route == name
  }

}
