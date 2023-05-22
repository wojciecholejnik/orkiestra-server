import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContributionsList, DeviceType, Roles } from 'src/app/shared/models';
import { ContributionsService } from '../contributions.service';
import { NavigationService } from '../../main-wrapper/navigation-service.service';
import { ToastService } from 'src/app/shared/toast-service/toast.service';

@Component({
  selector: 'app-contributions-wrapper',
  templateUrl: './contributions-wrapper.component.html',
  styleUrls: ['./contributions-wrapper.component.scss']
})
export class ContributionsWrapperComponent implements OnInit, OnDestroy {

  currentYear: number = new Date().getFullYear();
  showingYear: number = new Date().getFullYear();
  $list: Subscription = new Subscription();
  $deviceType?: Subscription;
  listToShow: ContributionsList = {} as ContributionsList;
  addMemberToListIsOpen = false;
  newListOpen = false;
  removeListModalOpen = false;
  $removeList?: Subscription;
  loading = true;
  deviceType: DeviceType = DeviceType.laptop;
  canEdit = false;

  constructor(
    private contribubtionsService: ContributionsService,
    private navigationService: NavigationService,
    private toastService: ToastService) { }

  ngOnInit(): void {
    this.$deviceType = this.navigationService.deviceType.subscribe(type => this.deviceType = type);
    this.$list = this.contribubtionsService.listToShow.subscribe(list => {
      this.listToShow = list;
      if (list.year || list.error) {
        this.loading = false;
      }
      if (list.year) {
        this.showingYear = list.year
      }
    });
    this.contribubtionsService.getListForYear(this.currentYear);
    this.canEdit = this.navigationService.getUser()?.role === Roles.bandDirector || this.navigationService.getUser()?.role === Roles.paymaster

  }

  ngOnDestroy(): void {
    this.$list?.unsubscribe();
    this.$removeList?.unsubscribe();
    this.$deviceType?.unsubscribe();
  }

  goNextYear(){
    this.loading = true;
    this.showingYear += 1;
    this.contribubtionsService.getListForYear(this.showingYear);
  }

  goPreviousYear(){
    this.loading = true;
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
        this.toastService.show('Lista została usunięta.', { classname: 'bg-success text-light', delay: 5000 })
      },
      error: () => {
        this.toggleRemoveListOpen();
        this.toastService.show('Nie udało się usunąć tej listy. Spróbuj ponownie.', { classname: 'bg-danger text-light', delay: 5000 })
      }
    })
  }
}
