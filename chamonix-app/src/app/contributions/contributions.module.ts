import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContributionsWrapperComponent } from './contributions-wrapper/contributions-wrapper.component';
import { ContributionsTableComponent } from './contributions-table/contributions-table.component';
import { EditModalComponent } from './edit-modal/edit-modal.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AddUserComponent } from './add-user/add-user.component';
import { AddNewListComponent } from './add-new-list/add-new-list.component';



@NgModule({
  declarations: [
    ContributionsWrapperComponent,
    ContributionsTableComponent,
    EditModalComponent,
    AddUserComponent,
    AddNewListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  exports: [ContributionsWrapperComponent]
})
export class ContributionsModule { }
