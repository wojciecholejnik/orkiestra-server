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

  membersSubscription?: Subscription;
  membersTabsSubscription?: Subscription;
  tabs: MembersTabs = {} as MembersTabs;

  constructor(private membersService: MembersService) { }

  ngOnInit(): void {
    this.membersTabsSubscription = this.membersService.activeTab.subscribe(tabs => {
      this.tabs = tabs;
    });
  }

  ngOnDestroy(): void {
      this.membersSubscription?.unsubscribe();
      this.membersTabsSubscription?.unsubscribe();
  }

}
