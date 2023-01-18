import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContributionsList } from 'src/app/shared/models';
import { ContributionsService } from '../contributions.service';

@Component({
  selector: 'app-contributions-wrapper',
  templateUrl: './contributions-wrapper.component.html',
  styleUrls: ['./contributions-wrapper.component.scss']
})
export class ContributionsWrapperComponent implements OnInit, OnDestroy {

  currentYear: number = new Date().getFullYear();
  showingYear: number = new Date().getFullYear();
  list$: Subscription = new Subscription();
  listToShow: ContributionsList = {} as ContributionsList;

  constructor(private contribubtionsService: ContributionsService) { }

  ngOnInit(): void {

    this.list$ = this.contribubtionsService.listToShow.subscribe(list => this.listToShow = list);
    this.contribubtionsService.getListForYear(this.currentYear);

  }

  ngOnDestroy(): void {
    
  }

  createNewList() {
    this.contribubtionsService.createPresence(2023).subscribe();
  }

  goNextYear(){
    this.showingYear += 1;
    this.contribubtionsService.getListForYear(this.showingYear);
  }

  goPreviousYear(){
    this.showingYear -= 1;
    this.contribubtionsService.getListForYear(this.showingYear);
  }

}
