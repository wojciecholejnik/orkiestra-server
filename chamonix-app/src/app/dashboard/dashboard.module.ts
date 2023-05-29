import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardWrapperComponent } from './dashboard-wrapper/dashboard-wrapper.component';
import { DashboardEventsComponent } from './dashboard-events/dashboard-events.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DashboardWrapperComponent,
    DashboardEventsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class DashboardModule { }
