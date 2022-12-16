import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
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
    deviceTypeSubscription?: Subscription;
    membersTabs: MembersTabs = {} as MembersTabs;
    addMemberIsOpen: boolean = false;
    membersTableIsOpen = true;
    memberDetailsAreOpen = '';
    deviceType = '';

    constructor(private membersService: MembersService, private navigationService: NavigationService) { }

    ngOnInit(): void {
        this.activeTabSubscription = this.membersService.activeTab.subscribe(tabs => this.membersTabs = tabs);
        this.addMemberIsOpenSubscription = this.membersService.addMembersIsOpen.subscribe(value => this.addMemberIsOpen = value);
        this.memberDetailsViewSubscription = this.membersService.memberDetailsAreOpen.subscribe(state => this.memberDetailsAreOpen = state);
        this.membersTableViewSubsscription = this.membersService.membersTableIsOpen.subscribe(state => this.membersTableIsOpen = state);
        this.deviceTypeSubscription = this.navigationService.deviceType.subscribe(type => this.deviceType = type);
    }

    toggleActiveTab(tabtoChange: any ){
        const valueToChange = tabtoChange.target ? tabtoChange.target.value : tabtoChange
        for (let key in this.membersTabs) {
            if (key !== valueToChange) {
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
        this.deviceTypeSubscription?.unsubscribe();
    }

    canAddMember(): boolean {
        return this.navigationService.checkPrivilege('addNewMember')
    }
}
