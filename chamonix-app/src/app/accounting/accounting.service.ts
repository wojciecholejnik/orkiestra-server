import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountingList } from '../shared/models';
import { ToastService } from '../shared/toast-service/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }),
  };
  private apiHost: string;

  $listToShow: BehaviorSubject<AccountingList | HttpErrorResponse > = new BehaviorSubject<AccountingList | HttpErrorResponse >({} as AccountingList)
  $openNewBudgetIsOpen:  BehaviorSubject<boolean> = new  BehaviorSubject<boolean>(false)
  $openNewBudgetLoading:  BehaviorSubject<boolean> = new  BehaviorSubject<boolean>(false)

  constructor(private http: HttpClient, private toastService: ToastService) {
    this.apiHost = environment.baseApiUrl;
  }

  getListForYear(year: number) {
    this.http.get<AccountingList | HttpErrorResponse >(`${this.apiHost}/accounting/${year}`).subscribe({
      next: list => {
        this.$listToShow.next(list)
      },
      error: (error) => {
        const e = error as HttpErrorResponse
        this.$listToShow.next(e)
        if (e.status === 404) {
          this.toastService.show('Brak budżetu dla wybranego roku', { classname: 'bg-danger text-light', delay: 3000 })
        } else {
          this.toastService.show('Wystąpił nieznany błąd.', { classname: 'bg-danger text-light', delay: 3000 })
        }
      }
    })
  }

  openNewBudgetModal(): void {
    this.$openNewBudgetIsOpen.next(true)
  }

  closeNewBudgetIsModal(): void {
    this.$openNewBudgetIsOpen.next(false)
  }

  sendRequestOpenNewBudget(year: number): void {
    this.$openNewBudgetLoading.next(true)
    this.http.post<AccountingList | HttpErrorResponse >(`${this.apiHost}/accounting`, {year: year}).subscribe({
      next: list => {
        this.$listToShow.next(list)
        this.$openNewBudgetLoading.next(false)
      },
      error: (error) => {
        const e = error as HttpErrorResponse
        this.$listToShow.next(e)
        this.$openNewBudgetLoading.next(false)
        if (e.status === 410) {
          this.toastService.show('Budżet dla tego roku już istnieje', { classname: 'bg-danger text-light', delay: 5000 })
        }
      }
    })
  }

  sendRequestAddNewHistoryItem(value: any): void {
    this.$openNewBudgetLoading.next(true)
    this.http.put<AccountingList | HttpErrorResponse >(`${this.apiHost}/accounting`, value).subscribe({
      next: list => {
        this.$listToShow.next(list)
        this.$openNewBudgetLoading.next(false)
        
      },
      error: (error) => {
        const e = error as HttpErrorResponse
        this.$openNewBudgetLoading.next(false)
        this.toastService.show('Nie udało się dodać wpisu.', { classname: 'bg-danger text-light', delay: 5000 })
      }
    })
  }

  getAllActiveBugetsNewerThan(year: number): Observable<AccountingList[] | HttpErrorResponse> {
    return this.http.get<AccountingList[] | HttpErrorResponse>(`${this.apiHost}/accounting/active/${year}`)
  }

  closeBudget(id: string, toId: string): Observable<AccountingList | HttpErrorResponse> {
    return this.http.post<AccountingList | HttpErrorResponse>(`${this.apiHost}/accounting/close`, {id, toId})
  }

  formatValue(value: number | string): string {
    if (typeof(value) === 'number' ) {
      return value.toFixed() + ' zł'
    } else {
      if (value.includes(',')) {
        return value + ' zł'
      } else {
        return value + ',00 zł'
      }
    }
  }

  
  
}