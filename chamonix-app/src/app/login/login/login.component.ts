import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { MembersService } from 'src/app/members/members.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form!: FormGroup;
    errorMessage = '';

    constructor(private fb: FormBuilder, private navigationService: NavigationService, private membersService: MembersService) { }

    ngOnInit(): void {
        this.form = this.fb.group({
            login : this.fb.control('', Validators.required),
            password: this.fb.control('', Validators.required)
        })
    }

    login(){
        if (this.isFormValid()) {
            this.membersService.loginUser(this.form.value).subscribe({
                next: (res) => {
                    this.navigationService.isUserLogged.next(res)
                },
                error: () => this.errorMessage = 'niewłaściwe login lub hasło'
            })
        } else {
            this.errorMessage = 'wypełnij wszystkie pola'
        }
    }

    isFormValid() {
        return this.form.status === 'VALID'
    }

}
