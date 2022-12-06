import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { User } from '../shared/models';

@Injectable({
     providedIn: 'root'
})
export class NavigationService  {

    activeModule: BehaviorSubject<any> = new BehaviorSubject([
        {name: 'Członkowie', isActive: false},
        {name: 'Dziennik', isActive: false},
        {name: 'Kalendarz', isActive: false},
        {name: 'Zasoby', isActive: true},
    ]);
    deviceType: BehaviorSubject<string> = new BehaviorSubject('');
    isUserLogged: Subject<any> = new Subject();
    private user?: User;

  constructor() { }

  setScreenWidth() {
    const width = window.innerWidth;
    let type = '';
    if (width <= 801) {
      type = 'phone';
    } else if (width > 801 && width <= 1200) {
      type = 'tablet'
    } else {
      type = 'laptop'
    }

    this.deviceType.next(type);
  }

  setUser(user: User) {
    this.user = user;
  }
  
  getUser():User | undefined {
    return this.user
  }

}
