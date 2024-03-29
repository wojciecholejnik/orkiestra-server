import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResourcesService } from '../resources.service';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';

@Component({
    selector: 'app-resources-uniforms-group',
    templateUrl: './resources-uniforms-group.component.html',
    styleUrls: ['./resources-uniforms-group.component.scss']
})
export class ResourcesUniformsGroupComponent implements OnInit, OnDestroy, OnChanges {

  @Input() uniformsGroup!: {_id: string, name: string, parts: any[]};
  _getParts?: Subscription;
  parts: Part[] = [];
  loading = true;
  isOpen = false;
  confirmationIsOpen = false;
  editGroupIsOpen = false;
  addPartsIsOpen = false;
  editPartIsOpen = false;
  selectedPart?: Part;
  removePartIsOpen = false;

  constructor(private resourcesService: ResourcesService, private navigationService: NavigationService) { 
  }

  ngOnInit(): void {
    this.getParts();
  }

  ngOnChanges(changes: SimpleChanges): void {
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

  removePart(part: Part) {
    this.removePartIsOpen = true;
    this.selectedPart = part;
  }

  confirmPartRemove(){
    if (this.selectedPart) {
      this.resourcesService.removePart(this.selectedPart._id, this.uniformsGroup._id).subscribe({
        next: () => {
          this.getParts();
          this.removePartIsOpen = false;
        },
        error: () => this.resourcesService.shuldGetResourcesUniforms.next(true)
      })
    }
  }

  selectEditingPart(part: Part) {
    this.selectedPart = part;
    this.editPartIsOpen = true;
  }

  comupteState(part: Part) {

    return {
      state: part.state,
      inUse: part.usingMembers.length,
      free: part.state - part.usingMembers.length
    }
  }

  canEdit(): boolean {
    return this.navigationService.checkPrivilege("editResourcesUniforms")
  }

}

interface Part {
  _id: string;
  name: string;
  state: number;
  usingMembers: string[]
}
