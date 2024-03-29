import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/shared/toast-service/toast.service';
import { ContributionsService } from '../contributions.service';

@Component({
  selector: 'app-add-new-list',
  templateUrl: './add-new-list.component.html',
  styleUrls: ['./add-new-list.component.scss']
})
export class AddNewListComponent implements OnInit, OnDestroy {
  @Input() year!: number;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  $save?: Subscription;
  yearToSave = 0
  saving = false;

  constructor(private constributionsService: ContributionsService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.yearToSave = this.year || new Date().getFullYear();
  }

  ngOnDestroy(): void {
    this.$save?.unsubscribe();
  }

  addNewList(){
    this.saving = true;
    this.$save = this.constributionsService.createNewList(this.yearToSave).subscribe({
      next: (res)=> {
        this.constributionsService.listToShow.next(res);
        this.closeModal();
      },
      error: (e: any) => {
        if (e.status === 410 && e.error.message.includes('List for this year is created')) {
          this.toastService.show('Lista dla tego roku jest już utworzona.', { classname: 'bg-danger text-light', delay: 5000 })
        } else {
          this.toastService.show('Wystąpił nieznany błąd.', { classname: 'bg-danger text-light', delay: 5000 })
        }
        this.saving = false
      }
    })
  }

  closeModal(){
    this.onClose.emit();
  }

}
