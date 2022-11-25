import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationService } from './main-wrapper/navigation-service.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'chamonix-app';

    constructor(private navigationService: NavigationService) {}

    ngOnInit(): void {
        this.navigationService.setScreenWidth();
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize() {
      this.navigationService.setScreenWidth();
    }
}
