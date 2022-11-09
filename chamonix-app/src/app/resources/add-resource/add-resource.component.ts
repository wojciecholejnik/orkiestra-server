import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Instrument, Member, newResourceDTO, Section } from 'src/app/shared/models';
import { ResourcesService } from '../resources.service';

@Component({
    selector: 'app-add-resource',
    templateUrl: './add-resource.component.html',
    styleUrls: ['./add-resource.component.scss']
})
export class AddResourceComponent implements OnInit, OnDestroy {

    @Output() onModalClose: EventEmitter<any> = new EventEmitter()

    _getSections?: Subscription;
    _getInstrumentsBySectioin?: Subscription;
    _getActiveMembers?: Subscription;
    sections: Section[] = [];
    activeCategory: any;
    activeSection: any;
    activeInstrument: any;
    activeMembers: Member[] = [];
    instrumentsBySection: Instrument[] = [];
    instrumentsReady = false;

    

    constructor(private resourcesService: ResourcesService, private fb: FormBuilder) { }

    instrumentForm = this.fb.group({
        brand: ['', Validators.required], 
        model: [''], 
        serialNumber: [''], 
        condition: [''],
        description: [''],
        user: [''],
    })

    ngOnInit(): void {
        this._getSections = this.resourcesService.getSections().subscribe(sections => this.sections = sections);
    }

    ngOnDestroy(): void {
        this._getSections?.unsubscribe();
    }

    closeModal() {
        this.onModalClose.emit();
    }

    getInstrumentsBbySection(){
        this._getInstrumentsBySectioin = this.resourcesService.getInstrumentsBySection(this.activeSection).subscribe(instruments => {
            this.instrumentsBySection = instruments;
            this.instrumentsReady = true;
        })
        this.getActiveMembers();
    }

    getActiveMembers(){
        this._getActiveMembers = this.resourcesService.getActiveMembers().subscribe(members => {
            this.activeMembers = members;
        })
    }

    addInstrument(){
        const DTO: newResourceDTO = {
            type: this.activeInstrument,
            ...this.instrumentForm.value
        }
        this.resourcesService.addResource(DTO).subscribe(() => this.resourcesService.shouldGetResources.next());
        this.resourcesService.addReourceIsOpen.next(false);
    }

}
