import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesWrapperComponent } from './resources-wrapper/resources-wrapper.component';
import { ResourcesNavigationComponent } from './resources-navigation/resources-navigation.component';
import { AddResourceComponent } from './add-resource/add-resource.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResourcesInstrumentsGroupComponent } from './resources-instruments-group/resources-instruments-group.component';
import { ResourcesInstrumentsWrapperComponent } from './resources-instruments-wrapper/resources-instruments-wrapper.component';



@NgModule({
    declarations: [
        ResourcesWrapperComponent,
        ResourcesNavigationComponent,
        AddResourceComponent,
        ResourcesInstrumentsGroupComponent,
        ResourcesInstrumentsWrapperComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        ResourcesWrapperComponent
    ]
})
export class ResourcesModule { }
