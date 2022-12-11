import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DiaryWrapperComponent } from './diary-wrapper/diary-wrapper.component';
import { DiaryNavigationComponent } from './diary-navigation/diary-navigation.component';
import { DiaryOrchestraLessonsComponent } from './diary-orchestra-lessons/diary-orchestra-lessons.component';



@NgModule({
    declarations: [
    DiaryWrapperComponent,
    DiaryNavigationComponent,
    DiaryOrchestraLessonsComponent
  ],
    imports: [
      CommonModule,
      SharedModule
  ],
    exports: [
      DiaryWrapperComponent
  ]
})
export class DiaryModule { }
