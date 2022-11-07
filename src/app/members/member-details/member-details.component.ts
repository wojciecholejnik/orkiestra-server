import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@c8y/ngx-components';
import { Subscription } from 'rxjs';
import { Member } from 'src/app/shared/models';
import { MembersService } from '../members.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit, OnDestroy {

  @Input() id!: string;
  detailsSubscription?: Subscription;
  memberData: Member = {} as Member;
  

  constructor(private membersService: MembersService) { }

  ngOnInit(): void {
    this.detailsSubscription = this.membersService.getMemberDetails(this.id).subscribe((data) => {
      this.memberData = data;
    });
  }

  ngOnDestroy(): void {
      this.detailsSubscription?.unsubscribe;
  }

  getAge(dateString: Date) {
      const today = new Date();
      const birthDate = new Date(dateString);
      console.log(birthDate)
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
    return age
}

}
