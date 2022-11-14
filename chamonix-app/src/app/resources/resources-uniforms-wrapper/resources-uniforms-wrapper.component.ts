import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResourcesService } from '../resources.service';

@Component({
    selector: 'app-resources-uniforms-wrapper',
    templateUrl: './resources-uniforms-wrapper.component.html',
    styleUrls: ['./resources-uniforms-wrapper.component.scss']
})
export class ResourcesUniformsWrapperComponent implements OnInit, OnDestroy {

    uniforms: any;
    loading = true;
    _getUniformsGroups?: Subscription;
    uniformsGroups: any[] = [];
    

    constructor(private resourcesService: ResourcesService) { 
    }

    ngOnInit(): void {
      this.getUniformsGroup();
      this._getUniformsGroups = this.resourcesService.shuldGetResourcesUniforms.subscribe(() => {
        this.uniforms = [];
        this.getUniformsGroup();
      })
    }

    ngOnDestroy(): void {
        this._getUniformsGroups?.unsubscribe();
    }

    getUniformsGroup(){
      this.loading = true;
      this._getUniformsGroups = this.resourcesService.getUniformsGroups().subscribe({
        next: (groups) => {
          this.uniformsGroups = [];
          this.uniformsGroups = groups;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.uniformsGroups = [];
        }
      });
    }

}
