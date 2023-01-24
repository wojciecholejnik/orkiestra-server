import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MembersService } from 'src/app/members/members.service';
import { ContributionListMember, MemberOnTheList, MemberToSend } from 'src/app/shared/models';
import { ToastService } from 'src/app/shared/toast-service/toast.service';
import { ContributionsService } from '../contributions.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {
  @Input() currentMembers!:  ContributionListMember[];
  @Input() listId!: string;
  @Input() year!: number;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  allMembers?: MemberOnTheList[];
  $allMembers?: Subscription;
  $addMembers?: Subscription;
  $save?: Subscription;
  saving = false;
  membersLoading = true;
  membersLoadingFailedMessage = '';

  constructor(
    private membersService: MembersService,
    private contributionsService: ContributionsService,
    private toastService: ToastService) { }

  ngOnInit(): void {
    this.$allMembers = this.membersService.getActiveMembers().subscribe({
      next: (res) => {
        this.allMembers = res.map(member => ({
          _id: member._id,
          firstName: member.firstName,
          lastName: member.lastName,
          onTheList: this.currentMembers.find(item => item.member._id === member._id) ? true : false
        }));
        this.membersLoading = false;
      },
      error: (e) => {
        this.membersLoading = false;
        this.membersLoadingFailedMessage = "Nie udało się pobrać listy użytkowników. Spróbuj ponownie."
      }
    })
  }

  ngOnDestroy(): void {
    this.$allMembers?.unsubscribe();
    this.$addMembers?.unsubscribe();
    this.$save?.unsubscribe();
  }

  closeModal() {
    this.onClose.next();
  }

  save() {
    this.saving = true;
    const DTO: MemberToSend[] = [];
    this.allMembers?.forEach(member => {
      if (member.onTheList) {
        const onListINdex = this.currentMembers.findIndex(item => item.member._id === member._id);
        DTO.push({
          member: member._id,
          months: onListINdex >= 0 ? this.currentMembers[onListINdex].months : this.addMonths()
        })
      } 
    })
    this.$save = this.contributionsService.editListMembers(DTO, this.listId).subscribe({
      next: (res) => {
        this.contributionsService.listToShow.next(res);
        this.closeModal();
        this.toastService.show('Zmiany zostały zapisane.', { classname: 'bg-success text-light', delay: 5000 })
      },
      error: () => {
        this.toastService.show('Nie udało się zapisać zmian. Spróbuj ponownie.', { classname: 'bg-danger text-light', delay: 5000 })
        this.saving = false;
      }
    })
  }

  togglePresentOnTheList(member: MemberOnTheList) {
    member.onTheList = !member.onTheList
  }

  addMonths() {
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push({
        monthNumber: i,
        paid: false
      })
    }
    return months
  }

  checkAll(type: "check" | "uncheck") {
    if (this.allMembers) {
      this.allMembers = this.allMembers.map(member => ({
        _id: member._id,
        firstName: member.firstName,
        lastName: member.lastName,
        onTheList: type === "check"
      }))
    }
  }

}


