import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalWrapperComponent } from './components/modal-wrapper/modal-wrapper.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { LoadingComponent } from './loading/loading.component';



@NgModule({
    declarations: [
        ModalWrapperComponent,
        ConfirmationComponent,
        LoadingComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ModalWrapperComponent,
        ConfirmationComponent,
        LoadingComponent
    ]
})
export class SharedModule { }
