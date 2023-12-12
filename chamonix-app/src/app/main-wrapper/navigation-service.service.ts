import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Privileges, User, Roles, PrivilegesTypes, DeviceType, NavOptions, ActiveModule } from '../shared/models';

@Injectable({
     providedIn: 'root'
})
export class NavigationService  {

    activeModule: BehaviorSubject<ActiveModule[]> = new BehaviorSubject<ActiveModule[]>([
        {name: 'Pulpit', isActive: true, href: NavOptions.dashboard},
        {name: 'Członkowie', isActive: false, href: NavOptions.members},
        {name: 'Dziennik', isActive: false, href: NavOptions.diary},
        {name: 'Kalendarz', isActive: false, href: NavOptions.calendar},
        {name: 'Zasoby', isActive: false, href: NavOptions.resources},
        {name: 'Składki', isActive: false, href: NavOptions.contrbutions},
        {name: 'Księgowość', isActive: false, href: NavOptions.accounting},
    ]);
    deviceType: BehaviorSubject<DeviceType> = new BehaviorSubject<DeviceType>(DeviceType.laptop);
    isUserLogged: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
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
          editResourcesUniforms: true,
          editContributions: true,
          editDiary: true,
          editCalendar: true
        };
        break
      }
      case Roles.instructor: {
        this.privileges = {
          addNewMember: true,
          addNewRoleStaff: false,
          editPresence: true,
          editResourcesInstrument: true,
          editResourcesUniforms: false,
          editContributions: false,
          editDiary: true,
          editCalendar: true
        };
        break
      }
      case Roles.inspector: {
        this.privileges = {
          addNewMember: false,
          addNewRoleStaff: false,
          editPresence: false,
          editResourcesInstrument: false,
          editResourcesUniforms: true,
          editContributions: false,
          editDiary: false,
          editCalendar: true
        };
        break
      }
      case Roles.member: {
        this.privileges = {
          addNewMember: false,
          addNewRoleStaff: false,
          editPresence: false,
          editResourcesInstrument: false,
          editResourcesUniforms: false,
          editContributions: false,
          editDiary: false,
          editCalendar: false
        };
        break
      }
      default: {
        this.privileges = {
          addNewMember: false,
          addNewRoleStaff: false,
          editPresence: false,
          editResourcesInstrument: false,
          editResourcesUniforms: false,
          editContributions: false,
          editDiary: false,
          editCalendar: false
        }
      }
    }
  }

  logOut(): void {
    localStorage.clear()
    this.isUserLogged.next(undefined)
  }

}
