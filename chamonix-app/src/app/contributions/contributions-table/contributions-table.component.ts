import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContributionListMember, ContributionsList, DeviceType, Roles } from 'src/app/shared/models';
import { NavigationService } from '../../main-wrapper/navigation-service.service';

@Component({
  selector: 'app-contributions-table',
  templateUrl: './contributions-table.component.html',
  styleUrls: ['./contributions-table.component.scss']
})
export class ContributionsTableComponent implements OnInit, OnDestroy {
  @Input() list!: ContributionsList;
  modalIsOpen = false;
  memberToModal?: ContributionListMember;
  $deviceType?: Subscription;
  deviceType: DeviceType = 'laptop';
  canEdit = false;

  constructor(private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.canEdit = this.navigationService.getUser()?.role === Roles.bandDirector || this.navigationService.getUser()?.role === Roles.paymaster
    this.$deviceType = this.navigationService.deviceType.subscribe(type => this.deviceType = type);
  }

  ngOnDestroy(): void {
    this.$deviceType?.unsubscribe();
  }

  toggleModal(member?: ContributionListMember) {
    if (this.canEdit) {
      this.modalIsOpen = !this.modalIsOpen;
      this.memberToModal = this.memberToModal ? undefined : member;
    }
  }

  setRomanianMonths(monthNr: number): string {
    switch (monthNr) {
      case 0 : {
        return 'I'
      }
      case 1 : {
        return 'II'
      }
      case 2 : {
        return 'III'
      }
      case 3 : {
        return 'IV'
      }
      case 4 : {
        return 'V'
      }
      case 5 : {
        return 'VI'
      }
      case 6 : {
        return 'VII'
      }
      case 7 : {
        return 'VIII'
      }
      case 8 : {
        return 'IX'
      }
      case 9 : {
        return 'X'
      }
      case 10 : {
        return 'XI'
      }
      case 11 : {
        return 'XII'
      }
      default : {
        return ''
      }
    }
  }

}
