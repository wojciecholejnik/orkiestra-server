import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Section } from 'src/app/shared/models';
import { ResourcesService } from '../resources.service';

@Component({
    selector: 'app-resources-section-group',
    templateUrl: './resources-section-group.component.html',
    styleUrls: ['./resources-section-group.component.scss']
})
export class ResourcesSectionGroupComponent implements OnInit, OnDestroy {

    @Input() section!: Section;
    isOpen = false;
    removeSectionIsOpen = false;
    _removeSection?: Subscription;

    constructor(private resourcesService: ResourcesService) { }

    ngOnInit(): void {
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

}
