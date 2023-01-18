import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Roles, User } from 'src/app/shared/models';
import { NavigationService } from '../navigation-service.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    menuIsOpen = false;
    editUserIsOpen = false;
    loggedUser?: User;
    manageModalIsActive = false;
    
    constructor(private navigationService: NavigationService) {}
    @ViewChild('menuContainer') menuContainer: any
    @HostListener('document:click', ['$event'])
        DocumentClick(event: Event) {
        if (this.menuIsOpen && !this.menuContainer.nativeElement.contains(event.target)) {
            this.menuIsOpen = false
        }
  }

    ngOnInit(): void {
        this.loggedUser = this.navigationService.getUser();
    }

    toggleMenuIsOpen(): void {
        this.menuIsOpen = !this.menuIsOpen;
    }
    
    userMenuOptionClick(): void {
        this.menuIsOpen = false;
    }
    
    logout(){
        this.navigationService.isUserLogged.next(null);
        this.menuIsOpen = false;
    }
    
    openEditModal() {
        this.editUserIsOpen = true;
        this.toggleMenuIsOpen();
    }

    closeEditModal() {
        this.editUserIsOpen = false;
    }

    showUserName() {
        return this.loggedUser?.firstName + ' ' + this.loggedUser?.lastName 
    }

    showUserRole(): string {
        if (this.loggedUser && this.loggedUser.role === Roles.bandDirector) {
            return 'kapelmistrz'
        } else if (this.loggedUser && this.loggedUser.role === Roles.instructor) {
            return 'instruktor'
        } else if (this.loggedUser && this.loggedUser.role === Roles.inspector) {
            return 'inspektor'
        } else if (this.loggedUser && this.loggedUser.role === Roles.member) {
            return 'członek orkiestry'
        }
        else {
            return ''
        }
    }

    isBandDirector() {
        return this.loggedUser?.role === Roles.bandDirector
    }

    openManageModal(): void {
        this.manageModalIsActive = true;
    }

    closeManageModal() {
        this.manageModalIsActive = false;
    }
}
