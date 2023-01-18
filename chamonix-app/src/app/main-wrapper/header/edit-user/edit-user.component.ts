import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MembersService } from 'src/app/members/members.service';
import { User, UserDTO } from 'src/app/shared/models';
import { NavigationService } from '../../navigation-service.service';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {

    loggedUser?: User;
    form?: FormGroup;
    _editUser?: Subscription;
    error = false;

    constructor(
        private navigationService: NavigationService,
        private fb: FormBuilder,
        private membersService: MembersService
    ) { }

    @Output() onModalClose: EventEmitter<any> = new EventEmitter();

    ngOnInit(): void {

        this.loggedUser = this.navigationService.getUser();
        if (this.loggedUser) {
            this.form = this.fb.group({
                password: this.fb.control('', Validators.required),
                login: this.fb.control(this.loggedUser.login, Validators.required),
                newPassword1: this.fb.control(''),
                newPassword2: this.fb.control('')
            },
            {
                validators: [this.newPasswordsTheSame(), this.passwordIsFilled()],
                updateOn: 'change',
            }
            )
        }
    }

    ngOnDestroy(): void {
        this._editUser?.unsubscribe();
    }

    closeModal(): void {
        this.onModalClose.emit(true);
    }

    newPasswordsTheSame(): ValidatorFn {
        return () => {
            const password1 = this.form?.get('newPassword1')?.value;
            const password2 = this.form?.get('newPassword2')?.value;

            if (!password1 && !password2) {
                return null
            }
            else if ((password1 === password2)) {
                return null
            } else {
                return {newPasswordsNotTheSame: true}
            }

        }
    }

    passwordIsFilled(): ValidatorFn {
        return () => {
            const password = this.form?.get('password')?.value;
            const login = this.form?.get('login')?.value;
;           if (!password) {
                return {noPassword: true}
            }
            if (!login) {
                return {noLogin: true}
            }
            else {
                return null
            }

        }
    }

    disableSaveButton(){
        const areControlsTouched = () => !this.form?.controls.login.touched;
        return !this.form?.valid || areControlsTouched()
    }

    save(){
        const formValue = this.form?.value;
        if (this.loggedUser) {
            const DTO: UserDTO = {
                id: this.loggedUser?._id,
                password: formValue.password,
                name: formValue.name,
                login: formValue.login,
                password1: formValue.newPassword1,
                password2: formValue.newPassword2,
            };
            this._editUser = this.membersService.editUser(DTO).subscribe({
                next: () => {
                    this.navigationService.isUserLogged.next(false);
                },
                error: () => {
                    this.error = true;
                }
            })
        }
    }

}
