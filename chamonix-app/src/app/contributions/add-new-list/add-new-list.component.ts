import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContributionsService } from '../contributions.service';

@Component({
  selector: 'app-add-new-list',
  templateUrl: './add-new-list.component.html',
  styleUrls: ['./add-new-list.component.scss']
})
export class AddNewListComponent implements OnInit, OnDestroy {

  @Output() onClose: EventEmitter<any> = new EventEmitter();
  $save?: Subscription;
  yearToSave = 0

  constructor(private constributionsService: ContributionsService) { }

  ngOnInit(): void {
    this.yearToSave = new Date().getFullYear();
  }

  ngOnDestroy(): void {
    this.$save?.unsubscribe();
  }

  addNewList(){
    this.$save = this.constributionsService.createNewList(this.yearToSave).subscribe({
      next: (res)=> {
        console.log(res)
        this.constributionsService.listToShow.next(res);
        this.closeModal();
      },
      error: (e) => {
        //TODO: Error Handler
      }
    })
  }

  closeModal(){
    this.onClose.emit();
  }

}
