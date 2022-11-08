import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesWrapperComponent } from './resources-wrapper/resources-wrapper.component';
import { ResourcesNavigationComponent } from './resources-navigation/resources-navigation.component';



@NgModule({
    declarations: [
        ResourcesWrapperComponent,
        ResourcesNavigationComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ResourcesWrapperComponent
    ]
})
export class ResourcesModule { }
