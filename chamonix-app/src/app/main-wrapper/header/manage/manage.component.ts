import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MembersService } from 'src/app/members/members.service';
import { Roles, UserToManage, UserToManageDTO } from 'src/app/shared/models';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnDestroy {

    @Output() onModalClose: EventEmitter<boolean> = new EventEmitter();
    _users?: Subscription;
    _update?: Subscription;
    users: any[] = [];
    filteredUsers: UserToManage[] = [];
    loading = true;
    editingOne = false;
    newEditingUserDTO: UserToManageDTO = {} as UserToManageDTO;
    updating = false;
    filters = {
        userStatus: '',
        userRole: '',
        userName: ''
    }
    filtersAreVisible = false;

    constructor(private membersService: MembersService) { }

    ngOnInit(): void {
        this._users = this.membersService.getUserToManage().subscribe(res => {
            this.users = res.map(user => ({
                ...user,
                editing: false
            }));
            this.setFilters();
            this.loading = false;
        })
    }

    ngOnDestroy(): void {
        this._users?.unsubscribe();
        this._update?.unsubscribe();
    }

    closeModal(): void {
        this.onModalClose.emit(true);
    }

    save(): void {
        this.closeModal();
    }

    startUpdatingUser(userId: string, newRole: any, newLogin: any, newPassword: any, index: number): void {
        this.users[index].edit = true;
        this.newEditingUserDTO = {
            _id: userId,
            role: newRole.value,
            login: newLogin.value,
            password: newPassword.value
        }
        this.editingOne = true;
    }

    updateUser(userId: string, newRole: any, newLogin: any, newPassword: any): void {
        this.loading = true;
        this.newEditingUserDTO = {
            _id: userId,
            role: newRole.value,
            login: newLogin.value,
            password: newPassword.value
        }
        this._update = this.membersService.editMemberByDirector(this.newEditingUserDTO).subscribe((res) => {
            this.users = res.map((user: UserToManage) => ({
                ...user,
                editing: false
            }));
            this.loading = false;
            this.abortUpdateOne();
        })        
    }

    shouldInputBeBlocked(user: UserToManage) {
        if (!this.editingOne) {
            return true
        } else if (this.editingOne && user._id === this.newEditingUserDTO._id) {
            return false
        } else if (this.editingOne && user._id !== this.newEditingUserDTO._id) {
            return true
        } else {
        } return false
    }

    abortUpdateOne() {
        this.newEditingUserDTO = {} as UserToManageDTO;
        this.editingOne = false;
    }

    setFilters(): void {
        this.filteredUsers = this.users.filter((user: UserToManage) => {
            let statusIsValid = true;
            let roleIsValid = true;
            let nameIsValid = true;

            if(this.filters.userStatus) {
                if (this.filters.userStatus === 'isActive') {
                    statusIsValid = user.isActive === true
                } else {
                    statusIsValid = user.isActive === false
                }
            }

            if(this.filters.userRole) {
                roleIsValid = user.role === this.filters.userRole
            }

            if(this.filters.userName) {
                const nameToCheck = user.lastName.toLocaleLowerCase() + user.firstName.toLocaleLowerCase();
                nameIsValid = nameToCheck.includes(this.filters.userName);
            }

            return statusIsValid && roleIsValid && nameIsValid

        })
    }

    clearFilters(): void {
        this.filters.userStatus = '',
        this.filters.userRole = '',
        this.filters.userName = '',
        this.setFilters();
    }

    toggleFiltersVisible(): void {
        this.filtersAreVisible = !this.filtersAreVisible;
    }

    translateRole(): string {
        if (this.filters.userRole === Roles.instructor) {
            return 'Instruktorzy'
        } else if (this.filters.userRole === Roles.inspector) {
            return 'Inspektorzy'
        } else if (this.filters.userRole === Roles.member) {
            return 'Członkowie'
        } else if (this.filters.userRole === Roles.paymaster) {
            return 'Skarbnicy'
        } else {
            return ''
        }
    }

    isAnyFilterActive(): number {
        return this.filters.userRole.length || this.filters.userStatus.length || this.filters.userName.length
    }

}
