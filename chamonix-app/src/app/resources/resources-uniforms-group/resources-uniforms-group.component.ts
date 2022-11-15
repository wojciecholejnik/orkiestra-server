import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResourcesService } from '../resources.service';

@Component({
    selector: 'app-resources-uniforms-group',
    templateUrl: './resources-uniforms-group.component.html',
    styleUrls: ['./resources-uniforms-group.component.scss']
})
export class ResourcesUniformsGroupComponent implements OnInit, OnDestroy, OnChanges {

  @Input() uniformsGroup!: {_id: string, name: string};
  _getParts?: Subscription;
  parts: any;
  loading = true;
  isOpen = false;
  confirmationIsOpen = false;
  editGroupIsOpen = false;
  addPartsIsOpen = false;
  editPartIsOpen = false;
  selectedPart: any;

  constructor(private resourcesService: ResourcesService) { 
  }

  ngOnInit(): void {
    this.getParts();
  }

  ngOnChanges(): void {
    this.getParts();
  }

  getParts() {
    this._getParts = this.resourcesService.getPartsForUniformsGroup(this.uniformsGroup?._id).subscribe({
      next: (parts) => {
        this.parts = [];
        this.parts = parts;
        this.loading = false;
      },
      error: () =>  {
        this.parts = [];
        this.loading = false;
      }
    })
  }

  ngOnDestroy(): void {
      this._getParts?.unsubscribe();
  }

  toggleCard(){
    this.isOpen = !this.isOpen;
  }

  openConfirmation(){
    this.confirmationIsOpen = true;
  }

  removeGroup() {
    this.resourcesService.removeUniformsGroup(this.uniformsGroup._id).subscribe({
      next: () => {
        this.resourcesService.shuldGetResourcesUniforms.next(true);
      },
      error: () => {},

    })
  }

  openModalEditGroup() {
    this.editGroupIsOpen = true;
  }

  closeEditModal() {
    this.resourcesService.shuldGetResourcesUniforms.next(true);
    this.editGroupIsOpen = false;
  }

  openAddParts() {
    this.addPartsIsOpen = true;
  }

  closeAddPartsModal() {
    this.addPartsIsOpen = false;
    this.editPartIsOpen = false;
    this.getParts();
  }

  removePart(id: string) {
    this.resourcesService.removePart(id).subscribe({
      next: () => {
        this.getParts();
      }
    })
  }

  selectEditingPart(part: any) {
    this.selectedPart = part;
    this.editPartIsOpen = true;
  }

}
