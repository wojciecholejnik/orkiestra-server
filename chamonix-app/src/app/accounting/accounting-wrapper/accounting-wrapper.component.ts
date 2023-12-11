import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountingList, ContributionsList, DeviceType, Roles } from 'src/app/shared/models';
import { NavigationService } from '../../main-wrapper/navigation-service.service';
import { ToastService } from 'src/app/shared/toast-service/toast.service';
import { AccountingService } from '../accounting.service';

@Component({
  selector: 'app-accounting-wrapper',
  templateUrl: './accounting-wrapper.component.html',
  styleUrls: ['./accounting-wrapper.component.scss']
})
export class AccountingWrapperComponent implements OnInit, OnDestroy {

  currentYear: number = new Date().getFullYear();
  showingYear: number = new Date().getFullYear();
  listToShow?: AccountingList;
  addMemberToListIsOpen = false;
  newListOpen = false;
  removeListModalOpen = false;
  loading = true;
  deviceType: DeviceType = DeviceType.laptop;
  canEdit = false;
  newBudgetModalOpen = false;
  newBudgetLoading = false;
  addItemModalIsOpen = false;
  closeBudgetModalIsOpen = false

  private _list: Subscription = new Subscription();
  private _deviceType?: Subscription;
  private _newBudgetModalOpen?: Subscription;
  private _newBudgetLoading?: Subscription;

  constructor(
    private accountingService: AccountingService,
    private navigationService: NavigationService,
    private toastService: ToastService) { }

  ngOnInit(): void {
    this._newBudgetModalOpen = this.accountingService.$openNewBudgetIsOpen.subscribe(state => this.newBudgetModalOpen = state);
    this._newBudgetLoading = this.accountingService.$openNewBudgetLoading.subscribe(state => {
      this.newBudgetLoading = state;
      if (this.newBudgetLoading && state) {
        this.cloaseModalAddNewBudget()
      }
    });
    this._deviceType = this.navigationService.deviceType.subscribe(type => this.deviceType = type);
    this._list = this.accountingService.$listToShow.subscribe(list => {
      if ('year' in list) {
        this.listToShow = list;
        this.loading = false;
        this.showingYear = list.year
      } else {
        this.loading = false;
        this.listToShow = undefined;
      }
    });
    this.accountingService.getListForYear(this.currentYear);
    this.canEdit = this.navigationService.getUser()?.role === Roles.bandDirector || this.navigationService.getUser()?.role === Roles.paymaster

  }

  ngOnDestroy(): void {
    this._list?.unsubscribe();
    this._deviceType?.unsubscribe();
    this._newBudgetLoading?.unsubscribe();
    this._newBudgetModalOpen?.unsubscribe();
  }

  goNextYear(){
    this.loading = true;
    this.showingYear += 1;
    this.accountingService.getListForYear(this.showingYear);
  }

  goPreviousYear(){
    this.loading = true;
    this.showingYear -= 1;
    this.accountingService.getListForYear(this.showingYear);
  }

  toggleaddMemberToListIsOpen() {
    this.addMemberToListIsOpen = !this.addMemberToListIsOpen
  }

  toggleNewListOpen() {
    this.newListOpen = !this.newListOpen;
  }

  toggleRemoveListOpen() {
    this.removeListModalOpen = !this.removeListModalOpen;
  }

  canCloseList(): boolean {
    return !!this.listToShow && !this.loading && !this.listToShow.isClosed
  }

  formatValue(value: number | string): string {
    return this.accountingService.formatValue(value)
  }

  openModalAddNewBudget(): void {
    this.accountingService.openNewBudgetModal()
  }

  cloaseModalAddNewBudget(): void {
    this.accountingService.closeNewBudgetIsModal()
  }

  createNewBudget(): void {
    this.accountingService.sendRequestOpenNewBudget(this.showingYear)
  }

  openModalAddNewItem(): void {
    this.addItemModalIsOpen = true
  }

  closeModalAddNewItem(): void {
    this.addItemModalIsOpen = false
  }

  openModalCloseBudget(): void {
    this.closeBudgetModalIsOpen = true
  }

  closeModalCloseBudget(): void {
    this.closeBudgetModalIsOpen = false
  }

}
