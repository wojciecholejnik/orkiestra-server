import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DiaryTabs } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {

  activeTab: BehaviorSubject<DiaryTabs> = new BehaviorSubject({
    orchestraLessons: true,
    performances: false
  } as DiaryTabs)

  constructor() { }
}
