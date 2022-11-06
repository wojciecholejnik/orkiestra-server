import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MembersWrapperComponent } from './members-wrapper/members-wrapper.component';
import { MembersNavigationComponent } from './members-navigation/members-navigation.component';
import { MembersTableComponent } from './members-table/members-table.component';
import { SharedModule } from '../shared/shared.module';
import { AddMemberComponent } from './add-member/add-member.component';
import { DatePipe } from '@angular/common';



@NgModule({
  declarations: [
    MembersWrapperComponent,
    MembersNavigationComponent,
    MembersTableComponent,
    AddMemberComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    MembersWrapperComponent
  ],
  providers: [DatePipe]
})
export class MembersModule { }
