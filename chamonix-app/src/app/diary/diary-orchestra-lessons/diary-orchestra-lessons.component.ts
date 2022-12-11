import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MembersService } from 'src/app/members/members.service';
import { Member } from 'src/app/shared/models';

@Component({
    selector: 'app-diary-orchestra-lessons',
    templateUrl: './diary-orchestra-lessons.component.html',
    styleUrls: ['./diary-orchestra-lessons.component.scss']
})
export class DiaryOrchestraLessonsComponent implements OnInit, OnDestroy {

    _musicians?: Subscription;
    musicians: Member[] = [];

    constructor(private membersService: MembersService) { }

    ngOnInit(): void {
        this.getMusicians();
    }
    
    getMusicians(): void {
        this._musicians = this.membersService.getMainStaffMembers().subscribe(musicians => {
            this.musicians = musicians;
        });
    }

    ngOnDestroy(): void {
        this._musicians?.unsubscribe();
    }

}
