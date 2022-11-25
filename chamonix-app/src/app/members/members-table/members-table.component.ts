import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from "rxjs/operators";
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { Member, MembersTabs, Sorting } from 'src/app/shared/models';
import { MembersService } from '../members.service';

@Component({
    selector: 'app-members-table',
    templateUrl: './members-table.component.html',
    styleUrls: ['./members-table.component.scss']
})
export class MembersTableComponent implements OnInit, OnDestroy {

    @Input('membersType') membersType!: string;
    _members?: Subscription;
    _getData?: Subscription;
    _activeTab?: Subscription;
    _deviceType?: Subscription;
    members: Member[] = [];
    filteredMembers: Member[] = [];
    activeTab?: MembersTabs;
    loading = true;
    sorting: {[key: string]: Sorting} = {
        firstName: '',
        lastName: 'desc',
        instrument: '',
        section: ''
    };
    filtering = {
        firstName: '',
        lastName: '',
        instrument: '',
        section: ''
    };
    selectedMemberAction: Member = {} as Member;
    searchingRowIsOpen = false;

    confirmationRemoveIsOpen = false;
    confirmationRestoreIsOpen = false;
    editMemberisOpen = false;
    deviceType = '';

    constructor(private membersService: MembersService, private navigationService: NavigationService) {}

    ngOnInit(): void {
        this._deviceType = this.navigationService.deviceType.subscribe(type => this.deviceType = type);
        this._activeTab = this.membersService.activeTab.subscribe(tabs => {
            this.activeTab = tabs;
            this.getMembers();
        });
        this._getData = this.membersService.addMembersIsOpen.subscribe(() => {
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
                this.filteredMembers.sort((a, b) => a[sortBy].localeCompare(b[sortBy]))
            }
            if (dir === 'desc' && this.sorting[sortBy]) {
                this.filteredMembers.sort((a, b) => b[sortBy].localeCompare(a[sortBy]))
            }
        }

        if (sortBy === 'instrument') {
            if (dir === 'asc') {
                this.filteredMembers.sort((a, b) => a.instrument.name.localeCompare(b.instrument.name))
            }
            if (dir === 'desc') {
                this.filteredMembers.sort((a, b) => b.instrument.name.localeCompare(a.instrument.name))
            }
        }

        if (sortBy === 'section') {
            if (dir === 'asc') {
                this.filteredMembers.sort((a, b) => a.instrument.section.name.localeCompare(b.instrument.section.name))
            }
            if (dir === 'desc') {
                this.filteredMembers.sort((a, b) => b.instrument.section.name.localeCompare(a.instrument.section.name))
            }
        }

    }

    checkMember(member: Member){
        return (
            member.firstName.toLowerCase().includes(this.filtering.firstName.toLowerCase()) 
            && member.lastName.toLowerCase().includes(this.filtering.lastName.toLowerCase()) 
            && member.instrument.name.toLowerCase().includes(this.filtering.instrument.toLowerCase()) 
            && member.instrument.section.name.toLowerCase().includes(this.filtering.section.toLowerCase()) 
        )
    }

    filter(){
        const filteredData: Member[] = this.members.filter((member) => this.checkMember(member))
        this.filteredMembers = filteredData;
    }

    getMembers(){
        if (this.activeTab && this.activeTab.currentMembers) {
            this._members = this.membersService.getActiveMembers().subscribe(currentMembers => {
                this.handleGetMembers(currentMembers);
            });
        } else if (this.activeTab && this.activeTab.exMembers) {
            this._members = this.membersService.getExMembers().subscribe(exMembers => {
                this.handleGetMembers(exMembers);
            }); 
        } else if (this.activeTab && this.activeTab.mainStaff) {
            this._members = this.membersService.getMainStaffMembers().subscribe(mainStaffMembers => {
                this.handleGetMembers(mainStaffMembers);
            }); 
        } else if (this.activeTab && this.activeTab.students) {
            this._members = this.membersService.getStudentsMembers().subscribe(studentsMembers => {
                this.handleGetMembers(studentsMembers);
            }); 
        }
    }

    handleGetMembers(res: Member[]) {
        this.members = res;
        this.filter();
        this.loading = false;
    }

    removeMember(id: string, isActiveMember: boolean) {
        if (isActiveMember) {
            this.membersService.moveMemberToExMembers(id).pipe(take(1)).subscribe(() => {
            this.getMembers();
        })
        } else {
            this.membersService.removeMember(id).pipe(take(1)).subscribe(() => {
            this.getMembers();
        });
        }
        this.confirmationRemoveIsOpen = false;
        this.selectedMemberAction = {} as Member;
    }

    restoreMember(id: string) {
        this.membersService.restoreMember(id).pipe(take(1)).subscribe(() => {
            this.getMembers();
        });
        this.confirmationRestoreIsOpen = false;
        this.selectedMemberAction = {} as Member;
    }

    closeEditMember(){
        this.editMemberisOpen = false
    }

    isAnyFilter(): boolean {
        return this.filtering.firstName.length > 0 || this.filtering.lastName.length > 0 || this.filtering.instrument.length > 0 || this.filtering.section.length > 0
    }

    clearFilters(){
        this.filtering = {
            firstName: '',
            lastName: '',
            instrument: '',
            section: ''
        };
        this.filter();
    }

    viewOnPhone(){
        return this.deviceType === 'phone'
    }

    ngOnDestroy(): void {
        this._members?.unsubscribe();
        this._getData?.unsubscribe();
        this._activeTab?.unsubscribe();
        this._deviceType?.unsubscribe();
        this.members = [];
    }

    goToDetails(id: string) {
        this.membersService.membersTableIsOpen.next(false);
        this.membersService.memberDetailsAreOpen.next(id);
    }

}
