import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { ResourcesTabs } from 'src/app/shared/models';
import { ResourcesService } from '../resources.service';

@Component({
    selector: 'app-resources-navigation',
    templateUrl: './resources-navigation.component.html',
    styleUrls: ['./resources-navigation.component.scss']
})
export class ResourcesNavigationComponent implements OnInit, OnDestroy {

    _activeTab!: Subscription;
    _deviceType?: Subscription;
    activeTab!: ResourcesTabs;
    deviceType = '';
    constructor(private resourcesService: ResourcesService, private navigationService: NavigationService) { }

    ngOnInit(): void {
        this._activeTab = this.resourcesService.activeTab.subscribe(tabs => this.activeTab = tabs);
        this._deviceType = this.navigationService.deviceType.subscribe(type => this.deviceType = type);
    }

    ngOnDestroy(): void {
        this._activeTab.unsubscribe();
        this._deviceType?.unsubscribe();
    }

    toggleActiveTab(tabtoChange: any): void {
        const valueToChange = tabtoChange.target ? tabtoChange.target.value : tabtoChange
        for (let key in this.activeTab) {
            if (key !== valueToChange) {
                this.activeTab[key] = false;
            } else {
                this.activeTab[key] = true;
            }
        }
    }

    toggleAddResourceInstrument(state: boolean): void {
        this.resourcesService.addResourceInstrumentIsOpen.next(state);
    }
    
    toggleAddResourceUniforms(state: boolean): void {
        this.resourcesService.addResourceUniformsIsOpen.next(state);
    }

    toggleAddResourceSections(state: boolean): void {
        this.resourcesService.addResourceSectionIsOpen.next(state);
    }
}
