import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResourcesTabs } from 'src/app/shared/models';
import { ResourcesService } from '../resources.service';

@Component({
    selector: 'app-resources-wrapper',
    templateUrl: './resources-wrapper.component.html',
    styleUrls: ['./resources-wrapper.component.scss']
})
export class ResourcesWrapperComponent implements OnInit, OnDestroy {

    _activeTab?: Subscription;
    activeTab?: ResourcesTabs;
    _addResourceInstrumentIsOpen?: Subscription;
    addResourceInstrumentIsOpen: any;
    _addResourceUniformIsOpen?: Subscription;
    addResourceUniformIsOpen: any;
    _addResourceSectionIsOpen?: Subscription;
    addResourceSectionIsOpen: any;

    constructor(private resourcesService: ResourcesService) { }

    ngOnInit(): void {
        this._activeTab = this.resourcesService.activeTab.subscribe(tabs => this.activeTab = tabs);
        this._addResourceInstrumentIsOpen = this.resourcesService.addResourceInstrumentIsOpen.subscribe(state => this.addResourceInstrumentIsOpen = state);
        this._addResourceUniformIsOpen = this.resourcesService.addResourceUniformsIsOpen.subscribe(state => this.addResourceUniformIsOpen = state);
        this._addResourceSectionIsOpen = this.resourcesService.addResourceSectionIsOpen.subscribe(state => this.addResourceSectionIsOpen = state);
    }

    ngOnDestroy(): void {
        this._activeTab?.unsubscribe();
        this._addResourceInstrumentIsOpen?.unsubscribe();
        this._addResourceUniformIsOpen?.unsubscribe();
    }


    closeAddResourceInstrumentModal(){
        this.resourcesService.addResourceInstrumentIsOpen.next(false);
    }

}
