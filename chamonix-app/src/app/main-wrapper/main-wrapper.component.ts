import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavOption, User } from '../shared/models';
import { NavigationService } from './navigation-service.service';

@Component({
    selector: 'app-main-wrapper',
    templateUrl: './main-wrapper.component.html',
    styleUrls: ['./main-wrapper.component.scss']
})
export class MainWrapperComponent implements OnInit, OnDestroy {

    _navOptions?: Subscription;
    navOptions: NavOption[] = [];
    _userLogged?: Subscription;
    userLogged?: User;
    _deviceType?: Subscription;
    deviceType = '';

    constructor(private navigationService: NavigationService) { }

    ngOnInit(): void {
        this._navOptions = this.navigationService.activeModule.subscribe(options => this.navOptions = options);
        this._userLogged = this.navigationService.isUserLogged.subscribe(state => this.userLogged = state);
        this._deviceType = this.navigationService.deviceType.subscribe(type => this.deviceType = type);
    }

    ngOnDestroy(): void {
        this._navOptions?.unsubscribe();
        this._userLogged?.unsubscribe();
        this._deviceType?.unsubscribe();
    }

}
