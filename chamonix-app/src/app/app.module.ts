import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { DashboardWrapperComponent } from './dashboard/dashboard-wrapper/dashboard-wrapper.component';
import { EventPreviewComponent } from './calendar/event-preview/event-preview.component';
import { AuthService } from './shared/authInterceptorService/authService';
import { AuthInterceptorService } from './shared/authInterceptorService/authInterceptorService';
import { AccountingWrapperComponent } from './accounting/accounting-wrapper/accounting-wrapper.component';

registerLocaleData(localePl);

const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full'},
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
            { 
                path: NavOptions.dashboard,
                component: DashboardWrapperComponent,
                children: [
                    { path: 'calendar-event/:id', component: EventPreviewComponent }
                ]
            },
            { 
                path: NavOptions.diary,
                component: DiaryWrapperComponent 
            },
            { 
                path: NavOptions.calendar, 
                component: CalendarWrapperComponent,
                children: [
                    { path: 'details/:id', component: MemberDetailsComponent }
                ]
            },
            { 
                path: NavOptions.resources, 
                component: ResourcesWrapperComponent 
            },
            { 
                path: NavOptions.contrbutions, 
                component: ContributionsWrapperComponent 
            },
            { 
                path: NavOptions.accounting, 
                component: AccountingWrapperComponent 
            }
        ]
    },
    { path: 'uniforms-preview/:id', component: MemberUniformsComponent},
    { path: 'calendar-event/:id', component: EventPreviewComponent},
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
    providers: [
        DatePipe,
        CookieService,
        ToastService,
        AuthService, 
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
