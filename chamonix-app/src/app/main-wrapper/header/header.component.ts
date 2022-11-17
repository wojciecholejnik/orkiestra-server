import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
    _loggedUser?: Subscription;
    loggedUser?: User
    constructor(private navigationService: NavigationService) {}

    ngOnInit(): void {
        this._loggedUser = this.navigationService.isUserLogged.subscribe(user => {
            this.loggedUser = user
        })
    }

    toggleMenuIsOpen(): void {
        this.menuIsOpen = !this.menuIsOpen;
    }
    
    userMenuOptionClick(): void {
        this.menuIsOpen = false;
    }
    
    logout(){
        this.navigationService.isUserLogged.next(false);
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
        return this.loggedUser?.name
    }

    isBandDirector() {
        return this.loggedUser?.role === Roles.bandDirecotr
    }
}
