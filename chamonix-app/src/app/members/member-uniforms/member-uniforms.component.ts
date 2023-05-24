import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { Member } from 'src/app/shared/models';
import { MembersService } from '../members.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/shared/toast-service/toast.service';

@Component({
    selector: 'app-member-uniforms',
    templateUrl: './member-uniforms.component.html',
    styleUrls: ['./member-uniforms.component.scss']
})
export class MemberUniformsComponent implements OnInit, OnDestroy {

    @Input() id?: string | null;
    @Input() member!: Member;
    @Input() canEdit!: boolean;
    _uniformsGroupsAndParts?: Subscription;
    _userDertails?: Subscription;
    uniformsGroups: any = [];
    loading = true;
    assignUniformsIsOpen = false;
    isOpen = true;
    userDetails: Member = {} as Member;

    constructor(
        private membersService: MembersService,
        private navigationService: NavigationService,
        private route: ActivatedRoute,
        private _router: Router,
        private location: Location,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.getData();
    }

    ngOnDestroy(): void {
        this._uniformsGroupsAndParts?.unsubscribe();
        this._userDertails?.unsubscribe();
    }

    getData() {
        this.loading = true;
        if (!this.id) {
            this.id = this.route.snapshot.paramMap.get('id');
        }
        if (this.id) {
            this._uniformsGroupsAndParts = this.membersService.getUniformsGroupsAndParts(this.id).subscribe(groups => {
                this.uniformsGroups = groups.map(group => {
                    return {
                        ...group,
                        isOpen: true
                    }
                });
                this.loading = false;
            })
            if (this.isUserPreview()) {
                this._userDertails = this.membersService.getMemberDetails(this.id).subscribe((data) => {
                    this.userDetails = data;
                    this.loading = false;
                });
            }
        }
    }

    toggleIsOpen(groupId: string) {
        if (this.isUserPreview()) return
        this.uniformsGroups.forEach((group: any) => {
            if (group._id === groupId) {
                group.isOpen = !group.isOpen
            }
        });
    }

    isMemberHasPart(ids: string[]) {
        const index = ids.indexOf(this.id!);
        return index >= 0
    }

    onAssignClose(){
        this.getData();
        this.assignUniformsIsOpen = false;
    }

    tableIsOpen(): void {
        if (this.isUserPreview()) return
        this.isOpen = !this.isOpen;
    }

    canEditUniforms(): boolean {
        return this.navigationService.checkPrivilege('editResourcesUniforms')
    }

    isUserPreview(): boolean {
        return this._router.url.includes('preview')
    }

    copyUrl(): void {
        const urlParts = window.location.href.split('/');
        const url = urlParts[0] + '//' + urlParts[2] + '/' + `uniforms-preview/${this.id}`
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = url;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.toastService.show('Skopiowano', { classname: 'bg-success text-light', delay: 1500 })

    }

    back(): void {
        this.location.back()
    }

}
