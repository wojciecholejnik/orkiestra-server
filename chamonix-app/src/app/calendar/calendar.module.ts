import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarWrapperComponent } from './calendar-wrapper/calendar-wrapper.component';
import { SharedModule } from '../shared/shared.module';
import { EventsListComponent } from './events-list/events-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { NewEventComponent } from './new-event/new-event.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CalendarWrapperComponent,
    EventsListComponent,
    EventDetailsComponent,
    NewEventComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  exports:[CalendarWrapperComponent]
})
export class CalendarModule { }
