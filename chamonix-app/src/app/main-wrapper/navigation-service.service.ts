import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Privileges, User, Roles, PrivilegesTypes, DeviceType } from '../shared/models';

@Injectable({
     providedIn: 'root'
})
export class NavigationService  {

    activeModule: BehaviorSubject<any> = new BehaviorSubject([
        {name: 'Członkowie', isActive: true},
        {name: 'Dziennik', isActive: false},
        {name: 'Kalendarz', isActive: false},
        {name: 'Zasoby', isActive: false},
        {name: 'Składki', isActive: false},
    ]);
    deviceType: BehaviorSubject<DeviceType> = new BehaviorSubject<DeviceType>(DeviceType.laptop);
    isUserLogged: Subject<any> = new Subject();
    private user?: User;
    private privileges: Privileges = {} as Privileges;

  constructor() { }

  setScreenWidth() {
    const width = window.innerWidth;
    let type = DeviceType.laptop;
    if (width <= 801) {
      type = DeviceType.phone;
    } else if (width > 801 && width <= 1200) {
      type = DeviceType.tablet
    } else {
      type = DeviceType.laptop
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

  checkPrivilege(privilege: PrivilegesTypes): boolean {
    return this.privileges[privilege]
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
