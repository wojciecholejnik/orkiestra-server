import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Lesson } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }),
  };
  private apiHost: string;

  constructor(private http: HttpClient) {
    this.apiHost = environment.baseApiUrl;
  }

  readPresences(year: string): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.apiHost}/readPresences/${year}`)
  }

  readNearesetEvent(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiHost}/getNearestEvent`)
  }
}
