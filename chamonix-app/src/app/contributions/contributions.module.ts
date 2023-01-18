import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContributionsWrapperComponent } from './contributions-wrapper/contributions-wrapper.component';
import { ContributionsTableComponent } from './contributions-table/contributions-table.component';



@NgModule({
  declarations: [
    ContributionsWrapperComponent,
    ContributionsTableComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ContributionsWrapperComponent]
})
export class ContributionsModule { }
