import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastService } from 'src/app/shared/toast-service/toast.service';
import { AccountingService } from '../accounting.service';


@Component({
  selector: 'app-add-accounting-item',
  templateUrl: './add-accounting-item.component.html',
  styleUrls: ['./add-accounting-item.component.scss']
})
export class AddAccountingItemComponent implements OnInit {

  @Input() year!: number
  @Input() budgetId!: string
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>()

  newItem = {
    date: '',
    description: '',
    value: 0,
    type: ''
  }

  valueValidError = false;
  descriptionValidError = false;
  loading = false

  constructor(private toastService: ToastService, private accountingService: AccountingService) { }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.onClose.emit()
  }

  validateValues(): boolean {
    this.valueValidError = false
    this.descriptionValidError = false
    let isValid = true;
    if (!this.newItem.value) {
      isValid = false
      this.valueValidError = true
    }
    if (!this.newItem.description) {
      isValid = false
      this.descriptionValidError = true
    }
    return isValid
  }

  save(): void {
    const isValid = this.validateValues()
    if (!isValid) return
    this.accountingService.sendRequestAddNewHistoryItem(
      {
        ...this.newItem, 
        date: this.newItem.date ? new Date(this.newItem.date) : '',
        value: this.newItem.type === '+' ? this.newItem.value : this.newItem.value*-1,
        year: this.year,
        id: this.budgetId
      }
    )
    this.closeModal()
  }

}
