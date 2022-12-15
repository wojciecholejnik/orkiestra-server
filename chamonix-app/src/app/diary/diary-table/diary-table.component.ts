import { DatePipe } from '@angular/common';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { Subscription } from 'rxjs';
import {Lesson, LessonDTO, Member} from "../../shared/models";
import { DiaryService } from '../diary.service';

@Component({
  selector: 'app-diary-table',
  templateUrl: './diary-table.component.html',
  styleUrls: ['./diary-table.component.scss']
})
export class DiaryTableComponent implements OnInit, OnDestroy {
  @Input() allMusicians: Member[] = [];
  @Input() dataToShow: Lesson[] = [];
  @Input() loading?: boolean;
  @Input() dateFrom: Date = new Date();
  @Input() dateTo: Date = new Date();
  @Output() onLessonSave: EventEmitter<any> = new EventEmitter();
  @Output() disableButtons: EventEmitter<boolean> = new EventEmitter();
  addingNewLessonMode = false;
  editingLessonMode = false;
  confirmDeleteIsOpen = false;
  lessonToDelete?: Lesson;
  newLesson: Lesson = {} as Lesson;
  _createPresence?: Subscription;
  _deletePresence?: Subscription;

  constructor(private datePipe: DatePipe, private diaryService: DiaryService) {}

  ngOnInit(): void {
    this.dataToShow = this.dataToShow.sort((a,b) => a.date > b.date ? 1 : -1);
  }

  ngOnDestroy(): void {
    this._createPresence?.unsubscribe();
    this._deletePresence?.unsubscribe();
  }

  wasPresent(member: Member, date: Lesson): string {
    const memberStateToShow = date.members.find(memberToShowStatus => memberToShowStatus._id === member._id);
    return memberStateToShow ? memberStateToShow.status : ''
  }

  countMonthStats(member: Member): string {
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

  abortAddNewLesson(): void {
    this.addingNewLessonMode = false;
    this.newLesson = {} as Lesson;
    this.disableButtons.emit(false);
  }

  addNewLesson(): void {
    this.disableButtons.emit(true);
    const dateToAdd = (): Date => {
      if (new Date() > this.dateFrom && new Date() < this.dateTo) {
        return new Date()
      } else {
        return this.dateFrom
      }
    }
    const dateTransformed = this.datePipe.transform(dateToAdd(), 'YYYY-MM-dd') || new Date();
    this.newLesson = {
      date: dateTransformed,
      type: 'normal-lesson',
      members: this.allMusicians.map(member => (
        {
          _id: member._id,
          status: ''
        }
      ))
    } as Lesson;
    this.addingNewLessonMode = true
  }

  setNewStatus(index: number, type: "" | "present" | "absent" | "late"): void {
    this.newLesson.members[index].status = type
  }

  areAllUserMatched(): boolean  {
    let areAllUserMatched = true;
    this.newLesson.members.forEach((member: any) => {
      if (!member.status) {
        areAllUserMatched = false
      }
    });
    return areAllUserMatched
  }

  saveNewLesson(): void {
    if (this.areAllUserMatched()) {
      const DTO = {
        date: new Date(this.newLesson.date),
        type: this.newLesson.type,
        members: this.newLesson.members
      };
      
      if (this.addingNewLessonMode && !this.editingLessonMode) {
        this._createPresence = this.diaryService.createPresence(DTO).subscribe(() => {
          this.onLessonSave.emit(true);
          this.addingNewLessonMode = false;
          this.newLesson = {} as Lesson;
          this.disableButtons.emit(false);
        })
      }
      if (this.editingLessonMode) {
        this._createPresence = this.diaryService.updatePresence(this.newLesson._id, DTO).subscribe(() => {
          this.onLessonSave.emit(true);
          this.addingNewLessonMode = false;
          this.editingLessonMode = false;
          this.newLesson = {} as Lesson;
          this.disableButtons.emit(false);
        })
      }
    }
  }

  deleteLesson(): void {
    if (this.lessonToDelete) {
      this._deletePresence = this.diaryService.deletePresence(this.lessonToDelete._id).subscribe(() => {
        this.onLessonSave.emit(true);
        this.lessonToDelete = undefined;
        this.confirmDeleteIsOpen = false;
      })
    }
  }

  checkAll(status: '' | 'present' | 'absent' | 'late'): void {
    this.newLesson.members = this.newLesson.members.map(member => ({...member, status: status}))
  }

  startEditLesson(lesson: Lesson): void {
    this.disableButtons.emit(true);
    this.newLesson = {
      _id: lesson._id,
      type: lesson.type, 
      date: this.datePipe.transform(new Date(lesson.date), 'YYYY-MM-dd') || new Date(),
      members: this.allMusicians.map(member => {
        const findStatus = (): string => {
          const finded = lesson.members.find(item => item._id === member._id);
          if (finded) {
            return finded.status
          } else {
            return ''
          }
        }
        return { _id: member._id,
        status: findStatus()
        }
      })
    } as Lesson;
    this.editingLessonMode = true;
    this.addingNewLessonMode = true;
  }

  countPresentMembers(lesson: Lesson): string {
    const allMembers = lesson.members.length;
    let presentMembers = 0;
    lesson.members.forEach(member => {
      if (member.status === 'present' || member.status === 'late') {
        presentMembers ++
      }
    })
    return presentMembers + ' / ' + allMembers
  }

  openDeleteConfirmation(lesson: Lesson): void {
    this.lessonToDelete = lesson;
    this.confirmDeleteIsOpen = true;
  }

  abortDeleteLesson() {
    this.lessonToDelete = undefined;
    this.confirmDeleteIsOpen = false;
  }

  setMin(): string {
    const newMin = new Date(this.dateFrom).setDate(this.dateFrom.getDate())
    const min = this.datePipe.transform(newMin, 'YYYY-MM-dd');
    if (min) {
      return min
    } else {
      return ''
    }
  }

  setMax(): string {
    const newMax = new Date(this.dateTo).setDate(this.dateTo.getDate()-1)
    const max = this.datePipe.transform(newMax, 'YYYY-MM-dd');
    if (max) {
      return max
    } else {
      return ''
    }
  }

}
