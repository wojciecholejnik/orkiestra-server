import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResourcesTabs } from 'src/app/shared/models';
import { ResourcesService } from '../resources.service';

@Component({
    selector: 'app-resources-wrapper',
    templateUrl: './resources-wrapper.component.html',
    styleUrls: ['./resources-wrapper.component.scss']
})
export class ResourcesWrapperComponent implements OnInit {

    _activeTab?: Subscription;
    activeTab?: ResourcesTabs;

    constructor(private resourcesService: ResourcesService) { }

    ngOnInit(): void {
        this._activeTab = this.resourcesService.activeTab.subscribe(tabs => this.activeTab = tabs)
    }

}
