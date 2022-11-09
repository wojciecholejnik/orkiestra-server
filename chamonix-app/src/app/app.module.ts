import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainWrapperModule } from './main-wrapper/main-wrapper.module';

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
        MainWrapperModule
    ],
    providers: [DatePipe],
    bootstrap: [AppComponent]
})
export class AppModule { }
