import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarWrapperComponent } from './calendar-wrapper/calendar-wrapper.component';
import { SharedModule } from '../shared/shared.module';
import { EventsListComponent } from './events-list/events-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { NewEventComponent } from './new-event/new-event.component';
import { FormsModule } from '@angular/forms';
import { EventPreviewComponent } from './event-preview/event-preview.component';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [
    CalendarWrapperComponent,
    EventsListComponent,
    EventDetailsComponent,
    NewEventComponent,
    EventPreviewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    DragDropModule
  ],
  exports:[CalendarWrapperComponent]
})
export class CalendarModule { }
