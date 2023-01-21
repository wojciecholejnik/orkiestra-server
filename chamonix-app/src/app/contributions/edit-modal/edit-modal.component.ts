import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContributionListMember, EditContributionsList } from 'src/app/shared/models';
import { ContributionsService } from '../contributions.service';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit, OnDestroy {
  @Input() member!: ContributionListMember;
  @Input() listId!: string;
  @Output() onSave: EventEmitter<ContributionListMember> = new EventEmitter();
  @Output() onCancel:  EventEmitter<any> = new EventEmitter();

  monthsToShow!: MonthToShow[];
  balanceToShow!: number;
  valueToContributionsAccount = 0;
  valueToProcess = 0;
  pricePerMont = 10;
  processingDisabled = false;
  $save?: Subscription;

  constructor(private contributionsService: ContributionsService) { }

  ngOnInit(): void {
    this.mapMonths();
    this.balanceToShow = this.member.member.contributionsAccount
  }

  ngOnDestroy(): void {
    this.$save?.unsubscribe();
  }

  closeModal(){
    this.onCancel.next()
  }

  mapMonths() {
    this.monthsToShow = this.member.months.map(month => {
      return {
        monthNumber: month.monthNumber,
        paid: month.paid,
        name: this.showMonthName(month.monthNumber),
        newPaid: false,
        toRemove: false,
      }
    })
  }

  showMonthName(monthNr: number): string {
    switch (monthNr) {
      case 0 : {
        return 'styczeń'
      }
      case 1 : {
        return 'luty'
      }
      case 2 : {
        return 'marzec'
      }
      case 3 : {
        return 'kwiecień'
      }
      case 4 : {
        return 'maj'
      }
      case 5 : {
        return 'czerwiec'
      }
      case 6 : {
        return 'lipiec'
      }
      case 7 : {
        return 'sierpień'
      }
      case 8 : {
        return 'wrzesień'
      }
      case 9 : {
        return 'październik'
      }
      case 10 : {
        return 'listopad'
      }
      case 11 : {
        return 'grudzień'
      }
      default : {
        return ''
      }
    }
  }
  
  togglePaidMonth(month: MonthToShow) {
    if (this.valueToProcess || this.valueToContributionsAccount) return
    if (!month.paid) {
      month.newPaid = !month.newPaid;
      this.processingDisabled = true;
    } else {
      month.toRemove = !month.toRemove
    }
  }

  processValue() {
    this.balanceToShow = this.member.member.contributionsAccount;
    this.valueToContributionsAccount = 0;
    this.mapMonths();

    let sumValue = this.member.member.contributionsAccount + this.valueToProcess;
    
    if (sumValue < this.pricePerMont) {
      this.valueToContributionsAccount = sumValue - this.member.member.contributionsAccount;
      return
    }
    const unpaidMonthAmount = this.member.months.filter(month => month.paid === false).length;
    let monthToPayAmount = Math.floor((this.valueToProcess + this.member.member.contributionsAccount)/this.pricePerMont);
    if (unpaidMonthAmount < monthToPayAmount) {
      const valueForOverpaidMonths = (monthToPayAmount - unpaidMonthAmount) * this.pricePerMont;
      sumValue -= valueForOverpaidMonths;
      monthToPayAmount = unpaidMonthAmount;
      this.valueToContributionsAccount = Math.floor(sumValue % this.pricePerMont) - this.member.member.contributionsAccount + valueForOverpaidMonths;
    } else {
      this.valueToContributionsAccount = Math.floor(sumValue % this.pricePerMont) - this.member.member.contributionsAccount;
    }
    
    let i = 1;
    this.monthsToShow = this.monthsToShow.map(month => {
      if (!month.paid && !month.newPaid && i <= monthToPayAmount) {
        i += 1
        return {...month, newPaid: true}
      } else {
        return month
      }
    })
  }

  restore() {
    this.mapMonths();
    this.balanceToShow = this.member.member.contributionsAccount;
    this.valueToProcess = 0;
    this.valueToContributionsAccount = 0;
    this.processingDisabled = false;
  }

  save() {
    const DTO: EditContributionsList = {
      listId: this.listId,
      memberId: this.member.member._id,
      memberContributionsAccount: this.member.member.contributionsAccount + this.valueToContributionsAccount,
      months: this.monthsToShow.map(month => ({
        monthNumber: month.monthNumber,
        paid: (month.paid && !month.toRemove) || month.newPaid ? true : false
      }))
      
    }
    
    this.$save = this.contributionsService.editListForMember(DTO).subscribe({
      next: (res) => {
        this.contributionsService.listToShow.next(res);
        this.closeModal();
      },
      error: (e) => {
        // TODO: error handler
      }
    })
  }

}

type MonthToShow = {
  monthNumber: number,
  paid: boolean;
  name: string;
  newPaid: boolean;
  toRemove: boolean;
}
