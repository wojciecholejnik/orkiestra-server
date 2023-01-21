import { Component, Input, OnInit } from '@angular/core';
import { ContributionListMember, ContributionsList } from 'src/app/shared/models';

@Component({
  selector: 'app-contributions-table',
  templateUrl: './contributions-table.component.html',
  styleUrls: ['./contributions-table.component.scss']
})
export class ContributionsTableComponent implements OnInit {
  @Input() list!: ContributionsList;
  modalIsOpen = false;
  memberToModal?: ContributionListMember;

  constructor() { }

  ngOnInit(): void {}

  toggleModal(member?: ContributionListMember) {
    this.modalIsOpen = !this.modalIsOpen;
    this.memberToModal = this.memberToModal ? undefined : member;
  }

}
