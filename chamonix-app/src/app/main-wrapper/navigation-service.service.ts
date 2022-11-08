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

  constructor() { }

}
