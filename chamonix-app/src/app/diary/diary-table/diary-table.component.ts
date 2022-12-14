import { DatePipe } from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {Lesson, Member} from "../../shared/models";

@Component({
  selector: 'app-diary-table',
  templateUrl: './diary-table.component.html',
  styleUrls: ['./diary-table.component.scss']
})
export class DiaryTableComponent implements OnInit {
  @Input() allMusicians: Member[] = [];
  @Input() dataToShow: Lesson[] = [];
  addingNewLessonMode = false;
  newLesson: Lesson = {} as Lesson;

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.dataToShow = this.dataToShow.sort((a,b) => a.date > b.date ? 1 : -1)
  }

  wasPresent(member: Member, date: Lesson): string {
    const memberStateToShow = date.members.find(memberToShowStatus => memberToShowStatus._id === member._id);
    return memberStateToShow ? memberStateToShow.status : ''
  }

  countMonthStats(member: Member) {
    const amountOfLessonsInMonth = this.dataToShow.length;
    let presentsAmount = 0;
    this.dataToShow.forEach(lesson => {
      const memberToCalculate = lesson.members.find(memberToShowStatus => memberToShowStatus._id === member._id);
      if (memberToCalculate && memberToCalculate.status === 'present' ||memberToCalculate && memberToCalculate.status === 'late') {
        presentsAmount ++
      }
    })
    return amountOfLessonsInMonth ? (presentsAmount / amountOfLessonsInMonth * 100).toFixed() + '%' : '--'
  }

  abortAddNewLesson() {
    this.addingNewLessonMode = false;
    this.newLesson = {} as Lesson;
  }

  addNewLesson(){
    const date = this.datePipe.transform(new Date(), 'YYYY-MM-dd') || new Date();
    this.newLesson = {
      date: date,
      type: 'normal-lesson',
      members: this.allMusicians.map(member => (
        {
          _id: member._id,
          status: ''
        }
      ))
    }
    this.addingNewLessonMode = true
  }

  setNewStatus(index: number, type: "" | "present" | "absent" | "late") {
    this.newLesson.members[index].status = type
  }

  areAllUserMatched() {
    let areAllUserMatched = true;
    this.newLesson.members.forEach((member: any) => {
      if (!member.status) {
        areAllUserMatched = false
      }
    });
    return areAllUserMatched
  }

  saveNewLesson(){
    if (true || this.areAllUserMatched()) {
      const DTO = {
        date: new Date(this.newLesson.date),
        type: this.newLesson.type,
        members: this.newLesson.members
      };
      this.newLesson = {} as Lesson;
  
      this.dataToShow.push(DTO);
      this.dataToShow.sort((a, b) => a.date > b.date ? 1 : -1);
      this.addingNewLessonMode = false;
    }
  }

}
