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
    uniformsGroupName: FormControl = new FormControl();


    constructor(private resourcesService: ResourcesService) {

    }

    ngOnInit(): void {
    }

    closeModal() {
        this.resourcesService.addResourceUniformsIsOpen.next(false);
    }

    addUniformGroup(){
        if (this.uniformsGroupName) {
            const DTO = {name: this.uniformsGroupName.value}
            this.resourcesService.addUnfirmsGroup(DTO).subscribe({
                    next: () => {
                    this.resourcesService.shuldGetResourcesUniforms.next();
                    this.resourcesService.addResourceUniformsIsOpen.next(false);
                }
            })
            }
        }

}
