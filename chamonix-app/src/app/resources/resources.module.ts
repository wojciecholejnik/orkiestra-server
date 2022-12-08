import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesWrapperComponent } from './resources-wrapper/resources-wrapper.component';
import { ResourcesNavigationComponent } from './resources-navigation/resources-navigation.component';
import { AddResourceInstrumentComponent } from './add-resource-instrument/add-resource-instrument.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResourcesInstrumentsGroupComponent } from './resources-instruments-group/resources-instruments-group.component';
import { ResourcesInstrumentsWrapperComponent } from './resources-instruments-wrapper/resources-instruments-wrapper.component';
import { ResourcesUniformsWrapperComponent } from './resources-uniforms-wrapper/resources-uniforms-wrapper.component';
import { ResourcesUniformsGroupComponent } from './resources-uniforms-group/resources-uniforms-group.component';
import { AddResourceUniformComponent } from './add-resource-uniform/add-resource-uniform.component';
import { AddResourceUniformPartComponent } from './add-resource-uniform-part/add-resource-uniform-part.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResourcesInstrumentDetailsComponent } from './resources-instrument-details/resources-instrument-details.component';
import { ResourcesSectionsWrapperComponent } from './resources-sections-wrapper/resources-sections-wrapper.component';
import { ResourcesSectionGroupComponent } from './resources-section-group/resources-section-group.component';
import { AddResourceSectionComponent } from './add-resource-section/add-resource-section.component';
import { AddResourceSectionInstrumentComponent } from './add-resource-section-instrument/add-resource-section-instrument.component';



@NgModule({
    declarations: [
        ResourcesWrapperComponent,
        ResourcesNavigationComponent,
        AddResourceInstrumentComponent,
        ResourcesInstrumentsGroupComponent,
        ResourcesInstrumentsWrapperComponent,
        ResourcesUniformsWrapperComponent,
        ResourcesUniformsGroupComponent,
        AddResourceUniformComponent,
        AddResourceUniformPartComponent,
        ResourcesInstrumentDetailsComponent,
        ResourcesSectionsWrapperComponent,
        ResourcesSectionGroupComponent,
        AddResourceSectionComponent,
        AddResourceSectionInstrumentComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule
    ],
    exports: [
        ResourcesWrapperComponent
    ]
})
export class ResourcesModule { }
