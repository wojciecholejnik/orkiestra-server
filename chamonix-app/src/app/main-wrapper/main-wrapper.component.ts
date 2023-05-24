import { Component, HostListener, OnDestroy, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { NavOption, User } from '../shared/models';
import { NavigationService } from './navigation-service.service';
import { Router } from '@angular/router';

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
    secToLogout = 60*10; //in seconds
    local = localStorage;

    constructor(
        private navigationService: NavigationService,
        private cookieService: CookieService,
        private changeDetector: ChangeDetectorRef,
        private router: Router
    ) { }

    ngOnInit(): void {
        this._navOptions = this.navigationService.activeModule.subscribe(options => this.navOptions = options);
        this._userLogged = this.navigationService.isUserLogged.subscribe(user => {
            this.userLogged = user;
            if (user) {
                this.router.navigate([`main/members`]) 
                this.saveToLocalStoarge(user)
                this.addCookie();
                this.navigationService.setUser(user);
                const isLoggedInterval = setInterval(() => {
                    const isLogged = this.cookieService.check('userLogged');
                    if (!isLogged) {
                        this.logout();
                        this.navigationService.isUserLogged.next(null);
                        clearInterval(isLoggedInterval);
                    }
                },1000)
            }  else {
                this.logout();
            }
        });
        this._deviceType = this.navigationService.deviceType.subscribe(type => this.deviceType = type);
    }

    ngOnDestroy(): void {
        this._navOptions?.unsubscribe();
        this._userLogged?.unsubscribe();
        this._deviceType?.unsubscribe();
    }

    ngAfterContentChecked(): void {
        this.changeDetector.detectChanges();
      }

    @HostListener('document:click', ['$event'])
    DocumentClick(event: Event) {
        this.addCookie();
    }

    saveToLocalStoarge(user?: User) {
        if (user) {
            this.local.setItem('_id', user._id);
            this.local.setItem('login', user.login);
            this.local.setItem('role', user.role);
            this.local.setItem('firstName', user.firstName);
            this.local.setItem('lastName', user.lastName);
        }
    }

    addCookie() {
        let d:Date = new Date();
        d.setTime(d.getTime() + this.secToLogout * 1000);
        this.cookieService.set('userLogged', '1', d);
    }

    logout() {
        this.cookieService.delete('userLogged');
        this.local.removeItem('_id');
        this.local.removeItem('login');
        this.local.removeItem('role');
        this.local.removeItem('name');
    }

}
