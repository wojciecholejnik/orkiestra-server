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

  membersTabs: MembersTabs = {} as MembersTabs;
  activeTabSubscription?: Subscription;
  addMemberIsOpen: boolean = false;
  addMemberIsOpenSubscription?: Subscription;

  constructor(private membersService: MembersService) { }

  ngOnInit(): void {
    this.activeTabSubscription = this.membersService.activeTab.subscribe(tabs => this.membersTabs = tabs);
    this.addMemberIsOpenSubscription = this.membersService.addMembersIsOpen.subscribe(value => this.addMemberIsOpen = value);
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

  ngOnDestroy(): void {
    this.addMemberIsOpenSubscription?.unsubscribe();
    this.activeTabSubscription?.unsubscribe();
  }
}
