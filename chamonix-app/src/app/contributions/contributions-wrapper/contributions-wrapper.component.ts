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
  $list: Subscription = new Subscription();
  listToShow: ContributionsList = {} as ContributionsList;
  addMemberToListIsOpen = false;
  newListOpen = false;
  removeListModalOpen = false;
  $removeList?: Subscription;


  constructor(private contribubtionsService: ContributionsService) { }

  ngOnInit(): void {

    this.$list = this.contribubtionsService.listToShow.subscribe(list => {
      this.listToShow = list;
      if (this.listToShow.year) {
        this.showingYear = new Date().getFullYear();
      }
    });
    this.contribubtionsService.getListForYear(this.currentYear);

  }

  ngOnDestroy(): void {
    this.$list?.unsubscribe();
    this.$removeList?.unsubscribe();
  }

  goNextYear(){
    this.showingYear += 1;
    this.contribubtionsService.getListForYear(this.showingYear);
  }

  goPreviousYear(){
    this.showingYear -= 1;
    this.contribubtionsService.getListForYear(this.showingYear);
  }

  toggleaddMemberToListIsOpen() {
    this.addMemberToListIsOpen = !this.addMemberToListIsOpen
  }

  toggleNewListOpen() {
    this.newListOpen = !this.newListOpen;
  }

  toggleRemoveListOpen() {
    this.removeListModalOpen = !this.removeListModalOpen;
  }

  removeList() {
    this.$removeList = this.contribubtionsService.removeList(this.listToShow._id).subscribe({
      next: () => {
        this.contribubtionsService.listToShow.next({} as ContributionsList);
        this.toggleRemoveListOpen();
      }
    })
  }
}
