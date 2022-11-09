import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavOption } from '../shared/models';
import { NavigationService } from './navigation-service.service';

@Component({
    selector: 'app-main-wrapper',
    templateUrl: './main-wrapper.component.html',
    styleUrls: ['./main-wrapper.component.scss']
})
export class MainWrapperComponent implements OnInit, OnDestroy {

    navigationSubscription?: Subscription;
    navOptions: NavOption[] = [];

    constructor(private navigationService: NavigationService) { }

    ngOnInit(): void {
        this.navigationSubscription = this.navigationService.activeModule.subscribe(options => this.navOptions = options);
    }

    ngOnDestroy(): void {
        this.navigationSubscription?.unsubscribe();
    }

}
