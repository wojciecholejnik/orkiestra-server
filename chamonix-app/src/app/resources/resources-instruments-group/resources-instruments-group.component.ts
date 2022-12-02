import { style } from '@angular/animations';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { Instrument, InstrumentsSectionView } from 'src/app/shared/models';
import { InstrumentsService } from '../resources-instruments-wrapper/instruments.service';
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

    _sectionIsOpen!: Subscription;
    _deviceType?: Subscription;
    deviceType = '';
    sectionIsOpen!: InstrumentsSectionView;
    SectionNameTranslations: {[key: string]: string} = {
        brass: 'blacha',
        woodwinds: 'drewno',
        percussions: 'perkusja',
        others: 'pozostałe'
    }
    

    constructor(
        private instrumentsService: InstrumentsService,
        private resourcesService: ResourcesService,
        private navigationService: NavigationService
    ) { }

    ngOnInit(): void {
        this._sectionIsOpen = this.instrumentsService.sectionIsOpen.subscribe(state => this.sectionIsOpen = state);
        this._deviceType = this.navigationService.deviceType.subscribe(type => this.deviceType = type);
        this.group = this.group.map(insturment => ({...insturment, isOpen: false}));
        this.filtering();
    }

    ngOnDestroy(): void {
        this._sectionIsOpen.unsubscribe();
        this._deviceType?.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.group = this.group.map(insturment => ({...insturment, isOpen: false}));
        this.filtering();
    }

    openCard(name: string){
        for (let key in this.sectionIsOpen) {
            if (key === name) {
                this.sectionIsOpen[key] = !this.sectionIsOpen[key]
            }
        }
        this.instrumentsService.sectionIsOpen.next(this.sectionIsOpen);
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

    toggleOpenDetails(instrument: DetailsToView) {
        if (this.viewOnPhone()) {
            instrument.isOpen = !instrument.isOpen;
        }
    }

}

interface DetailsToView extends Instrument {
    isOpen: boolean
}
