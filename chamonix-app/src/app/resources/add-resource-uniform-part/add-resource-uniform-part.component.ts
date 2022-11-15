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
        if (!this.editingItem) {
            return this.fb.group({
                name: this.fb.control(''),
                amount: this.fb.control(null)
            });
        } else {
            return this.fb.group({
                name: this.fb.control(this.editingItem.name),
                amount: this.fb.control(this.editingItem.state)
            });
        }
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
                this.handleRequest();
            },
            error: () => {
                this.handleRequest();
            }
        })
    }

    editPart() {
        const DTO = {
            name: this.form.value.parts[0].name,
            state: this.form.value.parts[0].amount
        };
        this.resourvesService.editPart(this.editingItem._id, DTO).subscribe({
            next: () => {
                this.handleRequest();
            },
            error: () => {
                this.handleRequest();
            }
        })
    }

    handleRequest(){
        this.onCloseModal.emit(true);
    }

}
