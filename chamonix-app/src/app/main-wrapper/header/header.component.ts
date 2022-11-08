import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    menuIsOpen = false;

    constructor() {}

    ngOnInit(): void {}

    toggleMenuIsOpen(): void {
        this.menuIsOpen = !this.menuIsOpen;
    }

    userMenuOptionClick(): void {
        this.menuIsOpen = false;
    }
}
