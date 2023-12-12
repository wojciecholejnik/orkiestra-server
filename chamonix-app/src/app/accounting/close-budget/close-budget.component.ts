import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountingService } from '../accounting.service';
import { AccountingList } from 'src/app/shared/models';
import { ToastService } from 'src/app/shared/toast-service/toast.service';

@Component({
  selector: 'app-close-budget',
  templateUrl: './close-budget.component.html',
  styleUrls: ['./close-budget.component.scss']
})
export class CloseBudgetComponent implements OnInit, OnDestroy {

  @Input() year!: number
  @Input() id!: string
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>()

  acctiveToTransfer: MappedAccountingList[] = []
  activeToTransferLoading = false;

  private _save?: Subscription
  private _acctiveToTransfer?: Subscription

  constructor(private accountingService: AccountingService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.getActiveToTransfer()
  }

  ngOnDestroy(): void {
    this._save?.unsubscribe()
    this._acctiveToTransfer?.unsubscribe()
  }

  getActiveToTransfer(): void {
    this.activeToTransferLoading = true
    this._acctiveToTransfer = this.accountingService.getAllActiveBugetsNewerThan(this.year).subscribe({
      next: (data) => {
        if (!("message" in data))
        this.acctiveToTransfer = data.map(budget => ({...budget, checked: false}))
        this.activeToTransferLoading = false
      },
      error: (err) => {
        this.activeToTransferLoading = false
      },
    })
  }

  checkBudget(id: string): void {
    this.acctiveToTransfer = this.acctiveToTransfer.map(budget => {
      return {...budget, checked: budget._id === id}
    })
  }

  closeModal(): void {
    this.onClose.emit()
  }

  validate(): number {
    let budgetIndex = -1
    this.acctiveToTransfer.forEach((budget, index) => {
      if (budget.checked) {
        budgetIndex = index
      }
    })
    return budgetIndex
  }

  save(): void {
    const checkedBudget = this.validate()
    if (checkedBudget < 0) {
      return
    }
    this._save = this.accountingService.closeBudget(this.id, this.acctiveToTransfer[checkedBudget]._id).subscribe({
      next: (res) => {
        this.accountingService.$listToShow.next(res)
        this.closeModal()
      }, 
      error: () => {
        this.toastService.show('Nie udało się zamknąć budżetu. Spróbuj ponownie później.', { classname: 'bg-danger text-light', delay: 5000 })

      }
    })
  }

}

interface MappedAccountingList extends AccountingList {
  checked: boolean
}
