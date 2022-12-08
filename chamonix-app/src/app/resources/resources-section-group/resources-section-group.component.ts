import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Instrument, Section } from 'src/app/shared/models';
import { ResourcesService } from '../resources.service';

@Component({
    selector: 'app-resources-section-group',
    templateUrl: './resources-section-group.component.html',
    styleUrls: ['./resources-section-group.component.scss']
})
export class ResourcesSectionGroupComponent implements OnInit, OnDestroy, OnChanges {

    @Input() section!: Section;
    isOpen = false;
    removeSectionIsOpen = false;
    addInstrumentIsOpen = false;
    _removeSection?: Subscription;
    selectedInstrument?: Instrument;
    removeInstrumentConfirmationIsOpen = false;
    editSectionIsOpen = false;
    selectedSection?: Section;

    constructor(private resourcesService: ResourcesService) { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ngOnDestroy(): void {
        this._removeSection?.unsubscribe();
    }

    toggleIsOpen():void {
        this.isOpen = !this.isOpen;
    }

    renderInstructorName(instructor: {firstName: string, lastName: string}): string {
        return instructor.firstName + ' ' + instructor.lastName
    }

    openRemoveSection() {
        this.removeSectionIsOpen = true;
    }

    onRemoveSection() {
        this._removeSection = this.resourcesService.removeSection(this.section._id).subscribe(() => {
            this.resourcesService.shuldGetResourcesSections.next(true);
            this.removeSectionIsOpen = false;
        })
    }

    onAbortRemoveSection() {
        this.removeSectionIsOpen = false;
    }

    openAddInstrument() {
        this.addInstrumentIsOpen = true;
    }

    onAddInstrument() {
        this.resourcesService.shuldGetResourcesSections.next(true);
        this.addInstrumentIsOpen = false;
        this.selectedInstrument = undefined;
    }

    onAbortAddInstrument() {
        this.addInstrumentIsOpen = false;
        this.selectedInstrument = undefined;
    }

    openEditInstrument(instrument: Instrument) {
        this.selectedInstrument = instrument;
        this.addInstrumentIsOpen = true;
    }

    toggleRemoveIsOpen(instrument?: Instrument) {
        this.removeInstrumentConfirmationIsOpen = !this.removeInstrumentConfirmationIsOpen;
        this.selectedInstrument = this.selectedInstrument ?  undefined : instrument;
    }

    onConfirmRemove() {
        if (this.selectedInstrument) {
            this.resourcesService.removeInstrumentFromSection(this.selectedInstrument?._id).subscribe(() => {
                this.resourcesService.shuldGetResourcesSections.next(true);
                this.toggleRemoveIsOpen(this.selectedInstrument);
            })
        }
    }

    onAbortRemove() {
        this.toggleRemoveIsOpen(this.selectedInstrument);
    }

    openEditGroup(section: Section) {
        this.editSectionIsOpen = true;
        this.selectedSection = section
    }

    onEditGroupAbort() {
        this.selectedSection = undefined;
        this.editSectionIsOpen = false;
    }

    onEditSave() {
        this.resourcesService.shuldGetResourcesSections.next(true);
        this.onEditGroupAbort();
    }

}
