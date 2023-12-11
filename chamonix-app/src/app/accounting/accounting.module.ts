import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountingWrapperComponent } from './accounting-wrapper/accounting-wrapper.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AccountingTableComponent } from './accounting-table/contributions-table.component';
import { AddAccountingItemComponent } from './add-accounting-item/add-accounting-item.component';
import { CloseBudgetComponent } from './close-budget/close-budget.component';


@NgModule({
  declarations: [
    AccountingWrapperComponent,
    AccountingTableComponent,
    AddAccountingItemComponent,
    CloseBudgetComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  exports: []
})
export class AccountingModuleModule { }
