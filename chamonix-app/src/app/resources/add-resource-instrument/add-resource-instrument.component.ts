import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Instrument, newResourceDTO, Section } from 'src/app/shared/models';
import { ResourcesService } from '../resources.service';

@Component({
    selector: 'app-add-resource-instrument',
    templateUrl: './add-resource-instrument.component.html',
    styleUrls: ['./add-resource-instrument.component.scss']
})
export class AddResourceInstrumentComponent implements OnInit, OnDestroy {

    @Input() editingItem?: any;
    @Output() onModalClose: EventEmitter<any> = new EventEmitter()

    _getSections?: Subscription;
    _getInstrumentsBySectioin?: Subscription;
    _getActiveMembers?: Subscription;
    sections: Section[] = [];
    activeCategory: any;
    activeSection: any;
    activeInstrument: any;
    activeMembers: {firstName: string, lastName: string, _id: string}[] = [];
    instrumentsBySection: Instrument[] = [];
    instrumentsReady = false;
    sectionsLoading = false;
    error = '';

    
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
        this.sectionsLoading = true;
        this._getSections = this.resourcesService.getSections().subscribe({
            next: (sections) => {
                this.sections = sections;
                this.sectionsLoading = false;
            },
            error: () => this.error = 'Coś poszlo nie tak. Spróbuj ponownie'
        });
        if (this.editingItem) {
            this.activeCategory = this.editingItem.activeCategory;
            this.activeSection = this.editingItem.type.section._id;
            this.activeInstrument = this.editingItem.type._id;
            this.getInstrumentsBbySection();
            this.instrumentForm.controls.brand.setValue(this.editingItem.brand);
            this.instrumentForm.controls.model.setValue(this.editingItem.model);
            this.instrumentForm.controls.serialNumber.setValue(this.editingItem.serialNumber);
            this.instrumentForm.controls.condition.setValue(this.editingItem.condition);
            this.instrumentForm.controls.description.setValue(this.editingItem.description);
            this.instrumentForm.controls.user.setValue(this.editingItem.user._id)
        }
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
        this._getActiveMembers = this.resourcesService.getMembersNames().subscribe(members => {
            this.activeMembers = members;
        })
    }

    addInstrument(){
        const DTO: newResourceDTO = {
            type: this.activeInstrument,
            ...this.instrumentForm.value
        };
        if (!DTO.user.length) {DTO.user = '63623d124e6e26c95b316f52'};
        this.resourcesService.addResource(DTO).subscribe(() => this.resourcesService.shouldGetResourcesInstruments.next());
        this.resourcesService.addResourceInstrumentIsOpen.next(false);
    }

    updateInstrument() {
        const DTO: newResourceDTO = {
            type: this.activeInstrument,
            ...this.instrumentForm.value
        };
        if (!DTO.user.length) {DTO.user = '63623d124e6e26c95b316f52'};
        this.resourcesService.updateResource(this.editingItem._id, DTO).subscribe(() => this.resourcesService.shouldGetResourcesInstruments.next());
        this.closeModal();
    }

}
