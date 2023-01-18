import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContributionsList } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ContributionsService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }),
  };
  private apiHost: string;

  listToShow: BehaviorSubject<ContributionsList> = new BehaviorSubject({} as ContributionsList)


  constructor(private http: HttpClient) {
    this.apiHost = environment.baseApiUrl;
  }

  createPresence(year: number): Observable<any> {
    return this.http.post<{number: number}>(`${this.apiHost}/addContributionList`, {year: year}, this.httpOptions)
  }

  getListForYear(year: number) {
    this.http.get<ContributionsList>(`${this.apiHost}/getContributionListForYear/${year}`).subscribe({
      next: list => {
        this.listToShow.next(list)
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

}
