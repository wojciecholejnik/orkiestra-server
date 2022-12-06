import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResourcesService } from '../resources.service';

@Component({
    selector: 'app-resources-sections-wrapper',
    templateUrl: './resources-sections-wrapper.component.html',
    styleUrls: ['./resources-sections-wrapper.component.scss']
})
export class ResourcesSectionsWrapperComponent implements OnInit, OnDestroy {

    _sections?: Subscription;
    _sectionsShouldGet?: Subscription;
    sections: any[] = [];

    constructor(private resourcesService: ResourcesService) { }

    ngOnInit(): void {
        this.getSections();
        this._sectionsShouldGet = this.resourcesService.shuldGetResourcesSections.subscribe(() => {
            this.getSections();
        });
    }

    getSections() {
        this._sections = this.resourcesService.getSections().subscribe(sections => this.sections = sections);
    }

    ngOnDestroy(): void {
        this._sections?.unsubscribe();
        this._sectionsShouldGet?.unsubscribe();
    }

}
