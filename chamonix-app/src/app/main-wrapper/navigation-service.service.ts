import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
     providedIn: 'root'
})
export class NavigationService {

    activeModule: BehaviorSubject<any> = new BehaviorSubject([
        {name: 'Członkowie', isActive: true},
        {name: 'Dziennik', isActive: false},
        {name: 'Kalendarz', isActive: false},
        {name: 'Zasoby', isActive: false},
    ]);
    deviceType: BehaviorSubject<string> = new BehaviorSubject('');
    isUserLogged: BehaviorSubject<any> = new BehaviorSubject(false);

  constructor() { }

  setScreenWidth() {
    const width = window.innerWidth;
    let type = '';
    if (width <= 420) {
      type = 'phone';
    } else if (width > 420 && width <= 1200) {
      type = 'tablet'
    } else {
      type = 'laptop'
    }

    this.deviceType.next(type);
  }

}
