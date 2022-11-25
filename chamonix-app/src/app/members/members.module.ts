import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MembersWrapperComponent } from './members-wrapper/members-wrapper.component';
import { MembersNavigationComponent } from './members-navigation/members-navigation.component';
import { MembersTableComponent } from './members-table/members-table.component';
import { SharedModule } from '../shared/shared.module';
import { AddMemberComponent } from './add-member/add-member.component';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MemberUniformsComponent } from './member-uniforms/member-uniforms.component';
import { AssignUniformsComponent } from './assign-uniforms/assign-uniforms.component';
import { MemberInstrumentsComponent } from './member-instruments/member-instruments.component';
import { NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        MembersWrapperComponent,
        MembersNavigationComponent,
        MembersTableComponent,
        AddMemberComponent,
        MemberDetailsComponent,
        MemberUniformsComponent,
        AssignUniformsComponent,
        MemberInstrumentsComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ClipboardModule,
        NgbModule
    ],
    exports: [
        MembersWrapperComponent
    ]
})
export class MembersModule { }
