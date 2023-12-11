import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountingList, ContributionListMember, ContributionsList, DeviceType, Roles } from 'src/app/shared/models';
import { NavigationService } from '../../main-wrapper/navigation-service.service';
import { AccountingService } from '../accounting.service';

@Component({
  selector: 'app-accounting-table',
  templateUrl: './accounting-table.component.html',
  styleUrls: ['./accounting-table.component.scss']
})
export class AccountingTableComponent implements OnInit, OnDestroy {
  @Input() list!: AccountingList;
  modalIsOpen = false;
  memberToModal?: ContributionListMember;
  deviceType: DeviceType = DeviceType.laptop;
  canEdit = false;

  private _deviceType?: Subscription;

  constructor(private navigationService: NavigationService, private accountingService: AccountingService) { }

  ngOnInit(): void {
    this.canEdit = this.navigationService.getUser()?.role === Roles.bandDirector || this.navigationService.getUser()?.role === Roles.paymaster
    this._deviceType = this.navigationService.deviceType.subscribe(type => this.deviceType = type);
  }

  isPhoneType(): boolean {
    return this.deviceType === DeviceType.phone
  }

  showAuthorForPhoneDevice(fullAuthor: string): string  {
    const names = fullAuthor.split(' ')
    return `${names[0][0]}. ${names[1]}`
  }

  ngOnDestroy(): void {
    this._deviceType?.unsubscribe();
  }

  formatValue(value: number | string): string {
    return this.accountingService.formatValue(value)
  }


}
