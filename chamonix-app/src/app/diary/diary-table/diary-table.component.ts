import {Component, Input, OnInit} from '@angular/core';
import {Member} from "../../shared/models";

@Component({
  selector: 'app-diary-table',
  templateUrl: './diary-table.component.html',
  styleUrls: ['./diary-table.component.scss']
})
export class DiaryTableComponent implements OnInit {
  @Input() allMusicians: Member[] = [];
  @Input() dataToShow: any[] = [];

  constructor() {

  }

  ngOnInit(): void {
    this.dataToShow = this.dataToShow.sort((a: any, b: any) => a.date > b.date ? 1 : -1)
  }

  wasPresent(member: Member, date: any) {
    const presentsMembers = date.members as string [];
    return presentsMembers.indexOf(member._id) >= 0;
  }

}
