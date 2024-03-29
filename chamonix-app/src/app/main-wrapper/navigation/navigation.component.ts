import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActiveModule, NavOptions } from 'src/app/shared/models';
import { NavigationService } from '../navigation-service.service';
import { Router, RouterEvent } from '@angular/router';

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
    this.checkActive(window.location.pathname.split('/')[2])
    this._router.events.subscribe((val: any) => {
      if (val && val.id && val.url && val.urlAfterRedirects && !val.state) {
        this.checkActive(window.location.pathname.split('/')[2])
      }
    })
  }

  changeActiveItem(href: string){
    this.checkIsActive(href as NavOptions)
    this._router.navigate([`main/${href}`])
    this.checkActive(href);
    this.navigationService.activeModule.next(this.navOptions);
  }

  checkActive(href: string) {
    this.navOptions.forEach(option => {
      if (option.href !== href) {
        option.isActive = false;
      } else {
        option.isActive = true;
      }
    })
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
