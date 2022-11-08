import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainWrapperComponent } from './main-wrapper.component';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MembersModule } from '../members/members.module';



@NgModule({
    declarations: [
        MainWrapperComponent,
        HeaderComponent,
        NavigationComponent
    ],
    imports: [
        CommonModule,
        MembersModule
    ],
    exports: [
        MainWrapperComponent
    ]
})
export class MainWrapperModule { }
