import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationModalType, Member } from '../../models';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
    @Input() type: ConfirmationModalType = '';
    @Input() data: Member | any;
    @Output() onConfirm = new EventEmitter<boolean>();
    @Output() onAbort = new EventEmitter<boolean>();

    confirmationText = '';

    constructor() { }

    ngOnInit(): void {
        if (this.type === 'removeMember') {
            this.confirmationText = 'Czy na pewno chcesz usunąć członka ' + this.data.firstName + ' ' + this.data.lastName + ' ?'
        }

        if (this.type === 'restoreMember') {
            this.confirmationText = 'Czy na pewno przywrócić członka ' + this.data.firstName + ' ' + this.data.lastName + ' ?'
        }

        if (this.type === 'removeInstrument') {
            this.confirmationText = 'Czy na pewno usunąć instrument ' + this.data.brand + ' ' + this.data.model + ' ?'
        }
        
        if (this.type === 'removeUniformGroup') {
            this.confirmationText = 'Czy na pewno usunąć grupę umundurowania ' + this.data.name + ' ?'
        }
    }

    confirm(){
        this.onConfirm.emit(true);
    }

    abort(){
        this.onAbort.emit(true);
    }

}
