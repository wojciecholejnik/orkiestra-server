import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContributionsList, EditContributionsList, MemberToSend } from '../shared/models';

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

  createNewList(year: number): Observable<ContributionsList> {
    return this.http.post<ContributionsList>(`${this.apiHost}/addContributionList`, {year: year}, this.httpOptions)
  }

  getListForYear(year: number) {
    this.http.get<ContributionsList>(`${this.apiHost}/getContributionListForYear/${year}`).subscribe({
      next: list => {
        this.listToShow.next(list)
      },
      error: (e) => {
        this.listToShow.next({} as ContributionsList)
      }
    })
  }

  editListForMember(DTO: EditContributionsList) {
    return this.http.post<ContributionsList>(`${this.apiHost}/editContributeListForMember`, DTO, this.httpOptions)
  }

  editListMembers(members: MemberToSend[], listId: string) {
    return this.http.post<ContributionsList>(`${this.apiHost}/editListMembers`, {members, listId}, this.httpOptions)
  }

  removeList(listId: string) {
    return this.http.post<any>(`${this.apiHost}/removeContributionsList`, {listId: listId}, this.httpOptions)
  }
  
}