import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MembersTabs } from 'src/app/shared/models';
import { MembersService } from '../members.service';

@Component({
  selector: 'app-members-navigation',
  templateUrl: './members-navigation.component.html',
  styleUrls: ['./members-navigation.component.scss']
})
export class MembersNavigationComponent implements OnInit, OnDestroy {

  activeTabSubscription?: Subscription;
  addMemberIsOpenSubscription?: Subscription;
  membersTableViewSubsscription?: Subscription;
  memberDetailsViewSubscription?: Subscription;
  membersTabs: MembersTabs = {} as MembersTabs;
  addMemberIsOpen: boolean = false;
  membersTableIsOpen = true;
  memberDetailsAreOpen = '';


  constructor(private membersService: MembersService) { }

  ngOnInit(): void {
    this.activeTabSubscription = this.membersService.activeTab.subscribe(tabs => this.membersTabs = tabs);
    this.addMemberIsOpenSubscription = this.membersService.addMembersIsOpen.subscribe(value => this.addMemberIsOpen = value);
    this.memberDetailsViewSubscription = this.membersService.memberDetailsAreOpen.subscribe(state => this.memberDetailsAreOpen = state);
    this.membersTableViewSubsscription = this.membersService.membersTableIsOpen.subscribe(state => this.membersTableIsOpen = state);
  }

  toggleActiveTab(tabtoChange: 'currentMembers' | 'exMembers'){
    for (let key in this.membersTabs) {
      if (key !== tabtoChange) {
        this.membersTabs[key] = false;
      } else {
        this.membersTabs[key] = true;
      }
    }
  }

  openAddMember(){
    this.membersService.addMembersIsOpen.next(true);
  }

  closeDetails(){
    this.membersService.memberDetailsAreOpen.next('');
    this.membersService.membersTableIsOpen.next(true);
  }

  ngOnDestroy(): void {
    this.addMemberIsOpenSubscription?.unsubscribe();
    this.activeTabSubscription?.unsubscribe();
    this.membersTableViewSubsscription?.unsubscribe();
    this.memberDetailsViewSubscription?.unsubscribe();
  }
}
