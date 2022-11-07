import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MembersTabs } from 'src/app/shared/models';
import { MembersService } from '../members.service';

@Component({
  selector: 'app-members-wrapper',
  templateUrl: './members-wrapper.component.html',
  styleUrls: ['./members-wrapper.component.scss']
})
export class MembersWrapperComponent implements OnInit, OnDestroy {

  membersTabsSubscription?: Subscription;
  membersTableViewSubsscription?: Subscription;
  memberDetailsViewSubscription?: Subscription;
  tabs: MembersTabs = {} as MembersTabs;
  membersTableIsOpen = true;
  memberDetailsAreOpen = '';

  constructor(private membersService: MembersService) { }

  ngOnInit(): void {
    this.membersTableViewSubsscription = this.membersService.membersTableIsOpen.subscribe(state => this.membersTableIsOpen = state);
    this.membersTabsSubscription = this.membersService.activeTab.subscribe(tabs => {
      this.tabs = tabs;
    });
    this.memberDetailsViewSubscription = this.membersService.memberDetailsAreOpen.subscribe(state => this.memberDetailsAreOpen = state)
  }

  closeDetails(){
    this.membersService.memberDetailsAreOpen.next('');
    this.membersService.membersTableIsOpen.next(true);
  }

  ngOnDestroy(): void {
    this.membersTableViewSubsscription?.unsubscribe();
    this.memberDetailsViewSubscription?.unsubscribe();
    this.membersTabsSubscription?.unsubscribe();
  }

}
