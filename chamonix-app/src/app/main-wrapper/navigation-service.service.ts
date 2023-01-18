import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Privileges, User, Roles } from '../shared/models';

@Injectable({
     providedIn: 'root'
})
export class NavigationService  {

    activeModule: BehaviorSubject<any> = new BehaviorSubject([
        {name: 'Członkowie', isActive: false},
        {name: 'Dziennik', isActive: false},
        {name: 'Kalendarz', isActive: false},
        {name: 'Zasoby', isActive: false},
        {name: 'Składki', isActive: true},
    ]);
    deviceType: BehaviorSubject<string> = new BehaviorSubject('');
    isUserLogged: Subject<any> = new Subject();
    private user?: User;
    private privileges: Privileges = {} as Privileges;

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
    this.setPrivileges(user);
  }
  
  getUser():User | undefined {
    return this.user
  }

  private setPrivileges(user: User): void {
    switch (user.role) {
      case Roles.bandDirector: {
        this.privileges = {
          addNewMember: true,
          addNewRoleStaff: true,
          editPresence: true,
          editResourcesInstrument: true,
          editResourcesUniforms: true
        };
        break
      }
      case Roles.instructor: {
        this.privileges = {
          addNewMember: true,
          addNewRoleStaff: false,
          editPresence: true,
          editResourcesInstrument: true,
          editResourcesUniforms: false
        };
        break
      }
      case Roles.inspector: {
        this.privileges = {
          addNewMember: false,
          addNewRoleStaff: false,
          editPresence: false,
          editResourcesInstrument: false,
          editResourcesUniforms: true
        };
        break
      }
      case Roles.member: {
        this.privileges = {
          addNewMember: false,
          addNewRoleStaff: false,
          editPresence: false,
          editResourcesInstrument: false,
          editResourcesUniforms: false
        };
        break
      }
      default: {
        this.privileges = {
          addNewMember: false,
          addNewRoleStaff: false,
          editPresence: false,
          editResourcesInstrument: false,
          editResourcesUniforms: false
        }
      }
    }
  }

}
