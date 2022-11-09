import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InstrumentsSectionView } from 'src/app/shared/models';
import { ResourcesService } from '../resources.service';
import { InstrumentsService } from './instruments.service';

@Component({
    selector: 'app-resources-instruments-wrapper',
    templateUrl: './resources-instruments-wrapper.component.html',
    styleUrls: ['./resources-instruments-wrapper.component.scss']
})
export class ResourcesInstrumentsWrapperComponent implements OnInit, OnDestroy {

    _sectionIsOpen?: Subscription;
    sectionIsOpen!: InstrumentsSectionView;
    woodwindsAreOpen!: boolean;
    percussionsAreOpen!: boolean;
    othersAreOpen!: boolean;

    loading = true;
    resources: any;
    _getResourcesInstruments?: Subscription;

    constructor(private instrumentsService: InstrumentsService, private resourcesService: ResourcesService) { 
        this._sectionIsOpen = this.instrumentsService.sectionIsOpen.subscribe(state => this.sectionIsOpen = state);
        this.resourcesService.shouldGetResourcesInstruments.subscribe(() => this.getResourcesInstruments());
    }

    ngOnInit(): void {
        this.getResourcesInstruments();
    }

    ngOnDestroy(): void {
        this._getResourcesInstruments?.unsubscribe();
    }

    getResourcesInstruments(){
        this._getResourcesInstruments = this.resourcesService.getAllResourcesInstruments().subscribe({
            next: (res) => {
                this.resources = res;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.resources = null;
            }
        })
    }

}
