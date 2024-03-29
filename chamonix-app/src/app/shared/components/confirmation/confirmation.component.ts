import { DatePipe } from '@angular/common';
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
    saving = false;

    confirmationText = 'Czy na pewnoe chcesz to zrobić ??!';

    constructor(private datePipe: DatePipe) { }

    ngOnInit(): void {
        this.saving = false;
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

        if (this.type === 'removeUniformPart') {
            this.confirmationText = 'Czy na pewno usunąć część umundurowania ' + this.data.name + ' ?'
        } 

        if (this.type === 'removeSection') {
            this.confirmationText = 'Czy na pewno usunąć sekcję ' + this.data.name + ' i podległe jej instrumenty ?'
        } 

        if (this.type === 'removeInstrumentFromSection') {
            this.confirmationText = 'Czy na pewno usunąć instrument ' + this.data.name + ' ?'
        }

        if (this.type === 'deletePresence') {
            this.confirmationText = 'Czy na pewno usunąć litę obecności z dnia ' + this.datePipe.transform(this.data.date, 'dd.MM.YYYY') + ' ?'
        }

        if (this.type === 'removeContributionList') {
            this.confirmationText = 'Czy na pewno usunąć listę składek za rok ' + this.data.year + ' ?'
        }

        if (this.type === 'removeEvent') {
            this.confirmationText = 'Czy na pewno usunąć wydarzenie ' + this.data.title + ' ?'
        }

        if (this.type === 'addNewBudget') {
            this.confirmationText = 'Czy na pewno chcesz otworzyć nowy budżet dla roku ' + this.data.year + ' ? Tej akcji nie można będzie cofnąć.'
        }
    }

    confirm(){
        this.onConfirm.emit(true);
        this.saving = true;
    }

    abort(){
        this.onAbort.emit(true);
    }

}
