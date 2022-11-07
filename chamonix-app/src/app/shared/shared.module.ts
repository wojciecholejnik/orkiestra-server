import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalWrapperComponent } from './components/modal-wrapper/modal-wrapper.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';



@NgModule({
  declarations: [
    ModalWrapperComponent,
    ConfirmationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalWrapperComponent,
    ConfirmationComponent
  ]
})
export class SharedModule { }
