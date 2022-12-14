import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DiaryTabs, Lesson, LessonDTO } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }),
  };
  private apiHost: string;

  activeTab: BehaviorSubject<DiaryTabs> = new BehaviorSubject({
    orchestraLessons: true,
    performances: false
  } as DiaryTabs)

  constructor(private http: HttpClient) {
    this.apiHost = environment.baseApiUrl;
  }

  readPresences(): Observable<any> {
    return this.http.get<Lesson>(`${this.apiHost}/readPresences`)
  }

  createPresence(presence: LessonDTO): Observable<any> {
    return this.http.post<Lesson>(`${this.apiHost}/createPresence`, presence)
  }

  deletePresence(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiHost}/deletePresence/${id}`)
  }

  updatePresence(id: string, lesson: LessonDTO): Observable<any> {
    return this.http.put(`${this.apiHost}/updatePresence/${id}`, lesson)
  }
}
