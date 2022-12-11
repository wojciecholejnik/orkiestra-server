import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainWrapperComponent } from './main-wrapper.component';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MembersModule } from '../members/members.module';
import { ResourcesModule } from '../resources/resources.module';
import { LoginModule } from '../login/login.module';
import { EditUserComponent } from './header/edit-user/edit-user.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenageUsersComponent } from './header/menage-users/menage-users.component';
import { DiaryModule } from '../diary/diary.module';



@NgModule({
    declarations: [
        MainWrapperComponent,
        HeaderComponent,
        NavigationComponent,
        EditUserComponent,
        MenageUsersComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MembersModule,
        ResourcesModule,
        LoginModule,
        FormsModule,
        ReactiveFormsModule,
        DiaryModule
    ],
    exports: [
        MainWrapperComponent
    ]
})
export class MainWrapperModule { }
