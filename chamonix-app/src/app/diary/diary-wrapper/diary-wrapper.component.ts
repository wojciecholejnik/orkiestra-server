import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DiaryTabs } from 'src/app/shared/models';
import { DiaryService } from '../diary.service';

@Component({
    selector: 'app-diary-wrapper',
    templateUrl: './diary-wrapper.component.html',
    styleUrls: ['./diary-wrapper.component.scss']
})
export class DiaryWrapperComponent implements OnInit, OnDestroy {

    _activeTabs?: Subscription;
    activeTabs!: DiaryTabs;

    constructor(private diaryService: DiaryService) { }

    ngOnInit(): void {
        this._activeTabs = this.diaryService.activeTab.subscribe(tabs => this.activeTabs = tabs);
    }

    ngOnDestroy(): void {
        this._activeTabs?.unsubscribe();
    }

}
