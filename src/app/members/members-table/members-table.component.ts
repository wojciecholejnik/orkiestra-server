import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Member, MembersTabs, Sorting } from 'src/app/shared/models';
import { MembersService } from '../members.service';

@Component({
  selector: 'app-members-table',
  templateUrl: './members-table.component.html',
  styleUrls: ['./members-table.component.scss']
})
export class MembersTableComponent implements OnInit, OnDestroy {

  @Input('membersType') membersType!: string;
  members: Member[] = [];
  activeTab?: MembersTabs;
  activeMembersSubscription?: Subscription;
  exMembersSubscription?: Subscription;
  sorting: {[key: string]: Sorting} = {
    firstName: '',
    lastName: 'asc',
    instrument: '',
    section: ''
  };
  selectedMemberAction: Member = {} as Member;

  confirmationRemoveIsOpen = false;
  confirmationRestoreIsOpen = false;
  editMemberisOpen = false;

  constructor(private membersService: MembersService) { }

  ngOnInit(): void {
    this.membersService.activeTab.subscribe(tabs => {
      this.activeTab = tabs;
      this.getMembers();
    });
    this.membersService.getMembers.subscribe(() => {
      this.getMembers();
    })
  }

  changeSorting(clickedKey: string) {
    for (let key in this.sorting) {
      if (key !== clickedKey) {
        this.sorting[key] = '';
      } else {
        if (this.sorting[key] === 'asc') {
          this.sorting[key] = 'desc';
          this.sort('desc', key);
        } else if (this.sorting[key] === 'desc') {
          this.sorting[key] = 'asc';
          this.sort('asc', key);
        } else {
          this.sorting[key] = 'asc';
          this.sort('asc', key);
        }
      }
    }
  }

  sort(dir: Sorting, sortBy: string){

      if (sortBy === 'firstName' || sortBy === 'lastName') {
        if (dir === 'asc' && this.sorting[sortBy]) {
          this.members.sort((a, b) => a[sortBy].localeCompare(b[sortBy]))
        }
        if (dir === 'desc' && this.sorting[sortBy]) {
          this.members.sort((a, b) => b[sortBy].localeCompare(a[sortBy]))
        }
      }

      if (sortBy === 'instrument') {
        if (dir === 'asc') {
          this.members.sort((a, b) => a.instrument.name.localeCompare(b.instrument.name))
        }
        if (dir === 'desc') {
          this.members.sort((a, b) => b.instrument.name.localeCompare(a.instrument.name))
        }
      }

      if (sortBy === 'section') {
        if (dir === 'asc') {
          this.members.sort((a, b) => a.instrument.section.name.localeCompare(b.instrument.section.name))
        }
        if (dir === 'desc') {
          this.members.sort((a, b) => b.instrument.section.name.localeCompare(a.instrument.section.name))
        }
      }

  }

  getMembers(){
    if (this.activeTab && this.activeTab.currentMembers) {
      this.membersService.getActiveMembers().subscribe(currentMembers => {
        this.members = currentMembers;
        this.changeSorting('lastName');
        // this.sort('asc', 'lastName');
      });
    } else if (this.activeTab && this.activeTab.exMembers) {
      this.membersService.getExMembers().subscribe(exMembers => {
        this.members = exMembers;
        this.changeSorting('lastName');
        // this.sort('asc', 'lastName');
      });
    }
  }

  removeMember(id: string, isActiveMember: boolean) {
    if (isActiveMember) {
      this.membersService.moveMemberToExMembers(id).subscribe(() => {
        this.getMembers();
      })
    } else {
      this.membersService.removeMember(id).subscribe(() => {
        this.getMembers();
      });
    }
    this.confirmationRemoveIsOpen = false;
    this.selectedMemberAction = {} as Member;
  }

  restoreMember(id: string) {
    this.membersService.restoreMember(id).subscribe(() => {
      this.getMembers();
    });
    this.confirmationRestoreIsOpen = false;
    this.selectedMemberAction = {} as Member;
  }

  closeEditMember(){
    this.editMemberisOpen = false
  }

  ngOnDestroy(): void {
      this.activeMembersSubscription?.unsubscribe();
      this.exMembersSubscription?.unsubscribe();
      this.members = [];
  }

}
