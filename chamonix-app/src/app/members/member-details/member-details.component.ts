import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/shared/models';
import { MembersService } from '../members.service';
import {Clipboard} from '@angular/cdk/clipboard'
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-member-details',
    templateUrl: './member-details.component.html',
    styleUrls: ['./member-details.component.scss'],
    providers: [DatePipe]
})
export class MemberDetailsComponent implements OnInit, OnDestroy {

    // @Input() id!: string;
    detailsSubscription?: Subscription;
    memberData: Member = {} as Member;
    editMemberisOpen = false;
    loading = true;
    contactInfoIsOpen = true;
    id: string | null = null;
  

  constructor(
    private membersService: MembersService,
    private clipboard: Clipboard,
    private navigationService: NavigationService,
    private route: ActivatedRoute,
    private location: Location
) { }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');;
        if (this.id) {
            this.membersService.membersTableIsOpen.next(false);
            this.membersService.memberDetailsAreOpen.next(this.id);
            this.getData(this.id);
        } else {
            this.location.back()
        }
    }

    getData(id: string){
        this.detailsSubscription = this.membersService.getMemberDetails(id).subscribe((data) => {
            this.memberData = data;
            this.loading = false;
        });
    }

    ngOnDestroy(): void {
        this.detailsSubscription?.unsubscribe();
    }

    getAge(dateString: Date) {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age
    }

    closeModalAndGetData(){
        this.getData(this.id!);
        this.editMemberisOpen = false;
    }

    copyToClipboard(value: any){
        this.clipboard.copy(value);
    }

    toggleContactInfoIsOpen() {
        this.contactInfoIsOpen = !this.contactInfoIsOpen;
    }

    canEdit(): boolean {
        return this.navigationService.checkPrivilege('addNewMember')
    }
}