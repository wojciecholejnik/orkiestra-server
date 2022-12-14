import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DiaryWrapperComponent } from './diary-wrapper/diary-wrapper.component';
import { DiaryNavigationComponent } from './diary-navigation/diary-navigation.component';
import { DiaryOrchestraLessonsComponent } from './diary-orchestra-lessons/diary-orchestra-lessons.component';
import { DiaryTableComponent } from './diary-table/diary-table.component';



@NgModule({
    declarations: [
    DiaryWrapperComponent,
    DiaryNavigationComponent,
    DiaryOrchestraLessonsComponent,
    DiaryTableComponent
  ],
    imports: [
      CommonModule,
      SharedModule,
  ],
    exports: [
      DiaryWrapperComponent
  ],
  providers: [DatePipe]
})
export class DiaryModule { }
