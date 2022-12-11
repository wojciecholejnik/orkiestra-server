import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { DiaryTabs } from 'src/app/shared/models';
import { DiaryService } from '../diary.service';

@Component({
    selector: 'app-diary-navigation',
    templateUrl: './diary-navigation.component.html',
    styleUrls: ['./diary-navigation.component.scss']
})
export class DiaryNavigationComponent implements OnInit, OnDestroy {

    _activeTabs?: Subscription;
    _deviceType? : Subscription;
    activeTabs!: DiaryTabs;
    deviceType = '';

    constructor(private diaryService: DiaryService, private navigationService: NavigationService) { }

    ngOnInit(): void {
        this._activeTabs = this.diaryService.activeTab.subscribe(tabs => this.activeTabs = tabs);
        this._deviceType = this.navigationService.deviceType.subscribe(type => this.deviceType = type);

    }

    ngOnDestroy(): void {
        this._activeTabs?.unsubscribe();
        this._deviceType?.unsubscribe();
    }

    toggleActiveTab(tabtoChange: any ){
        const valueToChange = tabtoChange.target ? tabtoChange.target.value : tabtoChange
        for (let key in this.activeTabs) {
            if (key !== valueToChange) {
                this.activeTabs[key] = false;
            } else {
                this.activeTabs[key] = true;
            }
        }
    }

}
