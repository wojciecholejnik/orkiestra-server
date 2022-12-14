import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Section } from 'src/app/shared/models';
import { ResourcesService } from '../resources.service';


@Component({
    selector: 'app-add-resource-section',
    templateUrl: './add-resource-section.component.html',
    styleUrls: ['./add-resource-section.component.scss']
})
export class AddResourceSectionComponent implements OnInit, OnDestroy {

    @Output() onModalClose: EventEmitter<any> = new EventEmitter();
    @Output() onEditSave: EventEmitter<any> = new EventEmitter();
    @Input() editingItem?: Section;
    instructorsLoading = true;
    instructors: any[] = [];
    _instructors?: Subscription;

    constructor(private resourcesService: ResourcesService, private fb: FormBuilder) { }
        sectionForm = this.fb.group({
            name: ['', Validators.required], 
            instructor: ['', Validators.required],
        })
   

    ngOnInit(): void {
        this._instructors = this.resourcesService.getInstructors().subscribe(instructors => {
            this.instructors = instructors,
            this.instructorsLoading = false
        })
        if (this.editingItem) {
            this.sectionForm.controls.name.setValue(this.editingItem.name),
            this.sectionForm.controls.instructor.setValue(this.editingItem.instructor._id)
        }
    }

    ngOnDestroy(): void {
        this._instructors?.unsubscribe();
    }

    addSection(){
        if (this.sectionForm.status === 'VALID') {
            this.resourcesService.addSection(this.sectionForm.value).subscribe(() => {
                this.resourcesService.shuldGetResourcesSections.next();
                this.closeModal();
            })
        }
    }

    updateSection(){
        if (this.editingItem) {
            this.resourcesService.updateSection(this.editingItem._id, this.sectionForm.value).subscribe(() => {
                this.onEditSave.next(true);
            }) 
        }
    }

    closeModal(){
        this.resourcesService.addResourceSectionIsOpen.next(false);
        this.onModalClose.next(true);
    }

}
