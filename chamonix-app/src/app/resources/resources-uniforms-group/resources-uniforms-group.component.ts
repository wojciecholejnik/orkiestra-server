import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResourcesService } from '../resources.service';

@Component({
    selector: 'app-resources-uniforms-group',
    templateUrl: './resources-uniforms-group.component.html',
    styleUrls: ['./resources-uniforms-group.component.scss']
})
export class ResourcesUniformsGroupComponent implements OnInit, OnDestroy {

  @Input() uniformsGroup!: {_id: string, name: string};
  _getParts?: Subscription;
  parts: any;
  loading = true;
  isOpen = false;

    constructor(private resourcesService: ResourcesService) { 
    }

    ngOnInit(): void {
      this._getParts = this.resourcesService.getPartsForUniformsGroup(this.uniformsGroup?._id).subscribe({
        next: (parts) => {
          this.parts = parts;
          this.loading = false;
        },
        error: () => this.loading = false
      })
    }

    ngOnDestroy(): void {
        this._getParts?.unsubscribe();
    }

    toggleCard(){
      this.isOpen = !this.isOpen;
    }

}
