import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ResourcesService } from '../resources.service';

@Component({
    selector: 'app-add-resource-uniform-part',
    templateUrl: './add-resource-uniform-part.component.html',
    styleUrls: ['./add-resource-uniform-part.component.scss']
})
export class AddResourceUniformPartComponent implements OnInit {

    @Input() editingItem?: any;
    @Input() uniformGroup!: {_id: string, name: string};
    @Output() onCloseModal: EventEmitter<any> = new EventEmitter();
    requestPending = false;
    form: any;

    constructor(private fb: FormBuilder, private resourvesService: ResourcesService) { }

    ngOnInit(): void {
        this.form = this.fb.group({
            parts: this.fb.array([])
        });
        this.addControl();
    }

    part(): any {
        return this.fb.group({
          name: this.fb.control(''),
          amount: this.fb.control(null)
        });
    }

    get partsFieldAsFormArray(): any {
        return this.form.get('parts') as FormArray;
    }

    addControl(): void {
        this.partsFieldAsFormArray.push(this.part());
    }

    remove(i: number): void {
        this.partsFieldAsFormArray.removeAt(i);
    }

    closeModal() {
        this.onCloseModal.emit(true);
    }

    addParts() {
        const DTO = {
            groupId: this.uniformGroup._id,
            ...this.form.value
        };
        this.resourvesService.addUniformParts(DTO).subscribe({
            next: () => {
                this.onCloseModal.emit(true)
            }
        })
    }

}
