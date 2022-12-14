import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainWrapperModule } from './main-wrapper/main-wrapper.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';

registerLocaleData(localePl);

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MainWrapperModule,
        BrowserAnimationsModule
    ],
    providers: [DatePipe, CookieService],
    bootstrap: [AppComponent]
})
export class AppModule { }
