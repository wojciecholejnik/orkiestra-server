import { DatePipe } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Instrument, InstrumentTranslation, Member, newMemberDTO } from 'src/app/shared/models';
import { MembersService } from '../members.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
  providers: [DatePipe]
})
export class AddMemberComponent implements OnInit, OnDestroy {
  @Input() memberToEdit?: Member;
  @Output() onEditClose = new EventEmitter();

  instrumentsSubscription?: Subscription;
  instruments: Instrument[] = [];
  todayDate: any;
  instrumentTranslation: typeof InstrumentTranslation = InstrumentTranslation;
  newMemberForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    isActive: new FormControl(true),
    phone: new FormControl(null),
    email: new FormControl(''),
    address1: new FormControl(''),
    address2: new FormControl(''),
    instrument: new FormControl('', [Validators.required]),
    isChild: new FormControl(false),
    parentPhone: new FormControl(null),
    parentName: new FormControl(''),
    birthDate: new FormControl('', [Validators.required]),
    joiningDate: new FormControl(this.datePipe.transform(Date.now(), 'yyyy-MM-dd'), [Validators.required]),
  });
  
  constructor(private membersService: MembersService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.instrumentsSubscription = this.membersService.getInstruments().subscribe(instruments => {
      this.instruments = instruments;
    });

    if (this.memberToEdit) {
      this.newMemberForm.controls.firstName.setValue(this.memberToEdit.firstName);
      this.newMemberForm.controls.lastName.setValue(this.memberToEdit.lastName);
      this.newMemberForm.controls.isActive.setValue(this.memberToEdit.isActive);
      this.newMemberForm.controls.phone.setValue(this.memberToEdit.phone);
      this.newMemberForm.controls.email.setValue(this.memberToEdit.email);
      this.newMemberForm.controls.address1.setValue(this.memberToEdit.address1);
      this.newMemberForm.controls.address2.setValue(this.memberToEdit.address2);
      this.newMemberForm.controls.instrument.setValue(this.memberToEdit.instrument._id);
      this.newMemberForm.controls.isChild.setValue(this.memberToEdit.isChild);
      this.newMemberForm.controls.parentPhone.setValue(this.memberToEdit.parentPhone);
      this.newMemberForm.controls.parentName.setValue(this.memberToEdit.parentName);
      this.newMemberForm.controls.birthDate.setValue(this.datePipe.transform(new Date(this.memberToEdit.birthDate), 'yyyy-MM-dd'));
      this.newMemberForm.controls.joiningDate.setValue(this.datePipe.transform(new Date(this.memberToEdit.joiningDate), 'yyyy-MM-dd'));
    }
  }

  ngOnDestroy(): void {
      this.instrumentsSubscription?.unsubscribe();
  }
  
  getAge() {
    const dateString: string = this.newMemberForm.controls.birthDate.value;
    if (dateString.length === 10 && dateString.charAt(0) !== '0') {
      const today = new Date();
      const birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
  
      if (age >= 18) {
        this.newMemberForm.controls.isChild.setValue(false);
      } else {
        this.newMemberForm.controls.isChild.setValue(true);
      }
    }

    
}

  closeModal(){
    if(this.memberToEdit) {
      this.onEditClose.emit();
    } else {
      this.membersService.addMembersIsOpen.next(false);
    }
  }

  addUser(){
    if (!this.memberToEdit && this.newMemberForm.status === 'VALID') {
      const newMemberDTO: newMemberDTO = {
        ...this.newMemberForm.value,
        joiningDate: new Date(),
      }
      this.membersService.addNewMember(newMemberDTO).subscribe(() => {
        this.membersService.getMembers.next(true);
        this.closeModal();
      })
    }

    if (this.memberToEdit && this.newMemberForm.status === 'VALID') {
      const newMemberDTO: newMemberDTO = {
        ...this.newMemberForm.value,
      }
      this.membersService.editMemberData(this.memberToEdit._id, newMemberDTO).subscribe(() => {
        this.membersService.getMembers.next(true);
        this.closeModal();
      })
    }
  }

}
