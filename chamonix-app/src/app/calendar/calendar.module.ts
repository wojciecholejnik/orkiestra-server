import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarWrapperComponent } from './calendar-wrapper/calendar-wrapper.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    CalendarWrapperComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[CalendarWrapperComponent]
})
export class CalendarModule { }
