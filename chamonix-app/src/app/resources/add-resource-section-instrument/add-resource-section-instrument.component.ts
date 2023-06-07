import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Instrument, Section } from 'src/app/shared/models';
import { ResourcesService } from '../resources.service';

@Component({
    selector: 'app-add-resource-section-instrument',
    templateUrl: './add-resource-section-instrument.component.html',
    styleUrls: ['./add-resource-section-instrument.component.scss']
})
export class AddResourceSectionInstrumentComponent implements OnInit, OnDestroy {

    @Input() section!: Section;
    @Input() editingItem?: Instrument;
    @Output() onAbort: EventEmitter<any> = new EventEmitter();
    @Output() onAddInstrument: EventEmitter<any> = new EventEmitter();
    _addInstrument?: Subscription;

    constructor(private fb: FormBuilder, private resourcesService: ResourcesService) { }

    instrumentForm = this.fb.group({
        name: ['', Validators.required]
    })

    ngOnInit(): void {
        if (this.editingItem) {
            this.instrumentForm.controls.name.setValue(this.editingItem.name)
        }
    }

    ngOnDestroy(): void {
        this._addInstrument?.unsubscribe();
    }

    addInstrument() {
        const DTO = {
            ...this.instrumentForm.value,
            section: this.section._id
        };
        this._addInstrument = this.resourcesService.addInstrumentToSection(DTO).subscribe(() => {
            this.onAddInstrument.next(true);
        });
    }

    updateInstrument() {
        if (this.editingItem) {
            const DTO = {
                _id: this.editingItem?._id,
                name: this.instrumentForm.controls.name.value
            };
            this._addInstrument = this.resourcesService.updateInstrumentInSection(DTO).subscribe(() => {
                this.onAddInstrument.next(true);
            });
        }
    }

    onSubmitForm(){
        if (!this.editingItem) {
            this.addInstrument();
        } else {
            this.updateInstrument();
        }
    }

    closeModal() {
        this.onAbort.next(true);
    }

}
