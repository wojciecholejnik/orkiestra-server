import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { Member, UniformGroupAndPart } from 'src/app/shared/models';
import { MembersService } from '../members.service';

@Component({
    selector: 'app-member-uniforms',
    templateUrl: './member-uniforms.component.html',
    styleUrls: ['./member-uniforms.component.scss']
})
export class MemberUniformsComponent implements OnInit, OnDestroy {

    @Input() id!: string;
    @Input() member!: Member;
    @Input() canEdit!: boolean;
    _uniformsGroupsAndParts?: Subscription;
    uniformsGroups: any = [];
    loading = true;
    assignUniformsIsOpen = false;
    isOpen = true;

    constructor(private membersService: MembersService, private navigationService: NavigationService) { }

    ngOnInit(): void {
        this.getData();
        
    }

    getData() {
        this.loading = true;
        this._uniformsGroupsAndParts = this.membersService.getUniformsGroupsAndParts(this.id).subscribe(groups => {
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
            } else {
                group.isOpen = false
            }
        });
    }

    isMemberHasPart(ids: string[]) {
        const index = ids.indexOf(this.id);
        return index >= 0
    }

    onAssignClose(){
        this.getData();
        this.assignUniformsIsOpen = false;
    }

    tableIsOpen(): void {
        this.isOpen = !this.isOpen;
    }

    ngOnDestroy(): void {
        this._uniformsGroupsAndParts?.unsubscribe();
    }

    canEditUniforms(): boolean {
        return this.navigationService.checkPrivilege('editResourcesUniforms')
    }

}
