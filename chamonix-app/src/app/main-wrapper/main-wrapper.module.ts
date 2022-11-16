import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainWrapperComponent } from './main-wrapper.component';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MembersModule } from '../members/members.module';
import { ResourcesModule } from '../resources/resources.module';
import { LoginModule } from '../login/login.module';



@NgModule({
    declarations: [
        MainWrapperComponent,
        HeaderComponent,
        NavigationComponent
    ],
    imports: [
        CommonModule,
        MembersModule,
        ResourcesModule,
        LoginModule
    ],
    exports: [
        MainWrapperComponent
    ]
})
export class MainWrapperModule { }
