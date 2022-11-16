import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-member-instruments',
    templateUrl: './member-instruments.component.html',
    styleUrls: ['./member-instruments.component.scss']
})
export class MemberInstrumentsComponent implements OnInit {
    @Input() instruments!: any;
    isOpen = true;

    constructor() { }

    ngOnInit(): void {
    }

    toggleIsOpen(): void {
        this.isOpen = !this.isOpen;
    }

}
