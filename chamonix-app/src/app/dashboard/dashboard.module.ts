import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardWrapperComponent } from './dashboard-wrapper/dashboard-wrapper.component';
import { DashboardPresencesComponent } from './dashboard-presences/dashboard-presences.component';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardEventsComponent } from './dashboard-events/dashboard-events.component';
import { DashboardUniformsComponent } from './dashboard-uniforms/dashboard-uniforms.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardContributionsComponent } from './dashboard-contributions/dashboard-contributions.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    DashboardWrapperComponent,
    DashboardPresencesComponent,
    DashboardEventsComponent,
    DashboardUniformsComponent,
    DashboardContributionsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxChartsModule,
    RouterModule,
    SharedModule
  ],
  exports: [RouterModule]
})
export class DashboardModule { }
