import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ResourcesService } from '../resources.service';

@Component({
    selector: 'app-add-resource-uniform',
    templateUrl: './add-resource-uniform.component.html',
    styleUrls: ['./add-resource-uniform.component.scss']
})
export class AddResourceUniformComponent implements OnInit {

    @Input() editingItem?: any;
    @Output() onCloseModal: EventEmitter<any> = new EventEmitter();
    uniformsGroupName: FormControl = new FormControl();
    requestPending = false;

    constructor(private resourcesService: ResourcesService) {

    }

    ngOnInit(): void {
        if (this.editingItem) {
            this.uniformsGroupName.setValue(this.editingItem.name)
        }
    }

    closeModal() {
        this.resourcesService.addResourceUniformsIsOpen.next(false);
        this.onCloseModal.emit()
    }

    addUniformGroup(){
        if (this.uniformsGroupName && !this.editingItem) {
            const DTO = {name: this.uniformsGroupName.value};
            this.requestPending = true;
            this.resourcesService.addUnfirmsGroup(DTO).subscribe({
                    next: () => {
                        this.resourcesService.shuldGetResourcesUniforms.next();
                        this.resourcesService.addResourceUniformsIsOpen.next(false);
                        this.requestPending = false;
                    }
                })
            } else if (this.uniformsGroupName && this.editingItem) {
                const DTO = {id: this.editingItem._id, name: this.uniformsGroupName.value};
                this.requestPending = true;
                this.resourcesService.editUnfirmsGroup(DTO).subscribe({
                    next: () => {
                        this.resourcesService.shuldGetResourcesUniforms.next();
                        this.requestPending = false;
                        this.onCloseModal.emit(true);
                    }
                })
            }
        } 

}
