import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { MembersTabs, Roles } from 'src/app/shared/models';
import { MembersService } from '../members.service';
import { Location } from '@angular/common'

@Component({
    selector: 'app-members-navigation',
    templateUrl: './members-navigation.component.html',
    styleUrls: ['./members-navigation.component.scss']
})
export class MembersNavigationComponent implements OnInit, OnDestroy {

    private _activeTab?: Subscription;
    private _addMemberIsOpen?: Subscription;
    private _membersTableView?: Subscription;
    private _memberDetailsView?: Subscription;
    private _deviceType?: Subscription;

    userRole?: Roles;
    membersTabs: MembersTabs = {} as MembersTabs;
    addMemberIsOpen: boolean = false;
    membersTableIsOpen = true;
    memberDetailsAreOpen = '';
    deviceType = '';

    constructor(
        private membersService: MembersService,
        private navigationService: NavigationService,
        private location: Location) { }

    ngOnInit(): void {
        this._activeTab = this.membersService.activeTab.subscribe(tabs => this.membersTabs = tabs);
        this._addMemberIsOpen = this.membersService.addMembersIsOpen.subscribe(value => this.addMemberIsOpen = value);
        this._memberDetailsView = this.membersService.memberDetailsAreOpen.subscribe(state => this.memberDetailsAreOpen = state);
        this._membersTableView = this.membersService.membersTableIsOpen.subscribe(state => this.membersTableIsOpen = state);
        this._deviceType = this.navigationService.deviceType.subscribe(type => this.deviceType = type);
        this.userRole = this.navigationService.getUser()?.role
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
        this.location.back()
    }

    ngOnDestroy(): void {
        this._addMemberIsOpen?.unsubscribe();
        this._activeTab?.unsubscribe();
        this._membersTableView?.unsubscribe();
        this._memberDetailsView?.unsubscribe();
        this._deviceType?.unsubscribe();
    }

    canAddMember(): boolean {
        return this.navigationService.checkPrivilege('addNewMember')
    }

    shouldRenderSpectators(): boolean {
        return this.userRole === Roles.bandDirector || this.userRole === Roles.spectator
    }
}
