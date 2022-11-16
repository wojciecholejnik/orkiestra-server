import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../navigation-service.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    menuIsOpen = false;

    constructor(private navigationService: NavigationService) {}

    ngOnInit(): void {}

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
}
