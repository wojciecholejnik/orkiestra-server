import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { Instrument } from 'src/app/shared/models';
import { ResourcesService } from '../resources.service';

@Component({
    selector: 'app-resources-instruments-group',
    templateUrl: './resources-instruments-group.component.html',
    styleUrls: ['./resources-instruments-group.component.scss']
})
export class ResourcesInstrumentsGroupComponent implements OnInit, OnDestroy, OnChanges {

    @Input() groupName: string = '';
    @Input() group: any [] = [];
    filter: 'used' | 'unused' | 'all' = 'all';
    filteredGroup: any[] = [];
    loading = true;
    confirmationRemoveIsOpen = false;
    editingIsOpen = false;
    selectedInstrument: any = {};
    isOpen = false;

    _sectionIsOpen!: Subscription;
    _deviceType?: Subscription;
    deviceType = ''; 

    constructor(
        private resourcesService: ResourcesService,
        private navigationService: NavigationService
    ) { }

    ngOnInit(): void {
        this._deviceType = this.navigationService.deviceType.subscribe(type => this.deviceType = type);
        this.filtering();
    }

    ngOnDestroy(): void {
        this._deviceType?.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.filtering();
    }

    toggleFilter(state: 'used' | 'unused') {
        if (state === 'used') {
            if (this.filter === 'all' || this.filter === 'unused') {
                this.filter = 'used';
            } else {
                this.filter = 'all';
            }
        }
        if (state === 'unused') {
            if (this.filter === 'all' || this.filter === 'used') {
                this.filter = 'unused';
            } else {
                this.filter = 'all';
            }
        }

        this.filtering();
    }

    filtering(){
        if (!this.filteredGroup) {
            return
        }

        if (this.filter === 'used') {
            this.filteredGroup = this.group.filter((instrument: any) => instrument.user);
        } else if (this.filter === 'unused') {
            this.filteredGroup = this.group.filter((instrument: any) => !instrument.user);
        } else {
            this.filteredGroup = this.group;
        }

        this.loading = false;
    }

    selectInstrumentToRemoce(instrument: any) {
        this.selectedInstrument = instrument;
        this.confirmationRemoveIsOpen = true;
    }

    removeInstrument(id: string){
        this.resourcesService.deleteResource(id).subscribe(() => {
            this.resourcesService.shouldGetResourcesInstruments.next(true);
            this.confirmationRemoveIsOpen = false;
            this.selectedInstrument = {};
        })
    }

    selectAndEdit(instrument: any){
        this.selectedInstrument = {
            activeCategory: 'instruments',
            ...instrument
        };
        this.editingIsOpen = true;
    }

    closeEditingModal(){
        this.resourcesService.shouldGetResourcesInstruments.next(true);
        this.editingIsOpen = false;
        this.selectedInstrument = {};
    }

    viewOnPhone(): boolean {
        return this.deviceType === 'phone'
    }

    toggleIsGroupOpen() {
        this.isOpen = !this.isOpen;
    }

    toggleOpenDetails(instrument: DetailsToView) {
        if (this.viewOnPhone()) {
            instrument.isOpen = !instrument.isOpen;
        }
    }

}

interface DetailsToView extends Instrument {
    isOpen: boolean
}
