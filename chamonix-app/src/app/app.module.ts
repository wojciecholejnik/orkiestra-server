import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainWrapperModule } from './main-wrapper/main-wrapper.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { ToastContainerComponent } from './shared/toast-service/toast-container.component';
import { ToastService } from './shared/toast-service/toast.service';
import { RouterModule, Routes } from '@angular/router';
import { MainWrapperComponent } from './main-wrapper/main-wrapper.component';
import { MemberUniformsComponent } from './members/member-uniforms/member-uniforms.component';
import { NavOptions } from './shared/models';
import { CalendarWrapperComponent } from './calendar/calendar-wrapper/calendar-wrapper.component';
import { ContributionsWrapperComponent } from './contributions/contributions-wrapper/contributions-wrapper.component';
import { DiaryWrapperComponent } from './diary/diary-wrapper/diary-wrapper.component';
import { MembersWrapperComponent } from './members/members-wrapper/members-wrapper.component';
import { ResourcesWrapperComponent } from './resources/resources-wrapper/resources-wrapper.component';
import { LoginComponent } from './login/login/login.component';
import { MemberDetailsComponent } from './members/member-details/member-details.component';

registerLocaleData(localePl);

const routes: Routes = [
    { path: '', component: LoginComponent},
    { 
        path: 'main', 
        component: MainWrapperComponent,
        children: [
            { 
                path: NavOptions.members,
                component: MembersWrapperComponent,
                children: [
                    { path: 'details/:id', component: MemberDetailsComponent }
                ]
            },
            { path: NavOptions.diary, component: DiaryWrapperComponent },
            { path: NavOptions.calendar, component: CalendarWrapperComponent },
            { path: NavOptions.resources, component: ResourcesWrapperComponent },
            { path: NavOptions.contrbutions, component: ContributionsWrapperComponent }
        ]
    },
    { path: 'uniforms-preview/:id', component: MemberUniformsComponent},
  ];

@NgModule({
    declarations: [
        AppComponent,
        ToastContainerComponent
    ],
    imports: [
        BrowserModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MainWrapperModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes)
    ],
    exports: [ RouterModule ],
    providers: [DatePipe, CookieService, ToastService],
    bootstrap: [AppComponent]
})
export class AppModule { }
