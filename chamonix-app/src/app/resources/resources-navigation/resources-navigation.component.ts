import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResourcesTabs } from 'src/app/shared/models';
import { ResourcesService } from '../resources.service';

@Component({
    selector: 'app-resources-navigation',
    templateUrl: './resources-navigation.component.html',
    styleUrls: ['./resources-navigation.component.scss']
})
export class ResourcesNavigationComponent implements OnInit {

    _activeTab!: Subscription;
    activeTab!: ResourcesTabs;

    constructor(private resourcesService: ResourcesService) { }

    ngOnInit(): void {
        this._activeTab = this.resourcesService.activeTab.subscribe(tabs => this.activeTab = tabs);
    }

    toggleActiveTab(tabtoChange: string): void {
        for (let key in this.activeTab) {
            if (key !== tabtoChange) {
                this.activeTab[key] = false;
            } else {
                this.activeTab[key] = true;
            }
        }
    }
 
}
