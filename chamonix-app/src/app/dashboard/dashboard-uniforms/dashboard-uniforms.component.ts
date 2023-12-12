import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { MembersService } from 'src/app/members/members.service';
import { Roles, UniformGroupAndPart, User } from 'src/app/shared/models';

@Component({
  selector: 'app-dashboard-uniforms',
  templateUrl: './dashboard-uniforms.component.html',
  styleUrls: ['./dashboard-uniforms.component.scss']
})
export class DashboardUniformsComponent implements OnInit, OnDestroy {

  @Input() user!: User;
  loading = true;
  uniformsGroups: any[] = [];

  _uniformsGroupsAndParts?: Subscription;

  constructor(
    private membersService: MembersService,
    private navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
      this._uniformsGroupsAndParts?.unsubscribe();
  }

  getData() {
    this.loading = true;
    this._uniformsGroupsAndParts = this.membersService.getUniformsGroupsAndParts(this.user._id).subscribe(groups => {
        this.uniformsGroups = groups.map(group => {
            return {
                ...group,
                isOpen: false
            }
        });
        this.loading = false;
    })
  }

  toggleIsOpen(groupId: string) {
    this.uniformsGroups.forEach((group: any) => {
      if (group._id === groupId) {
          group.isOpen = !group.isOpen
      }
    })
  }

  isMemberHasPart(ids: string[]) {
    const index = ids.indexOf(this.user._id);
    return index >= 0
  }

  disabledView(): boolean {
    return this.navigationService.getUser()?.role === Roles.spectator
  }

  countOwned(group: {name: string, parts: [{name: string, usingMembers: string[]}]}): string {
    let counter = 0;
    group.parts.forEach(checkGroup => {
      if (this.isMemberHasPart(checkGroup.usingMembers)) {
        counter ++
      }
    })

    return ` (${counter}/${group.parts.length})`
  }

}
