import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { MembersService } from 'src/app/members/members.service';
import { User } from 'src/app/shared/models';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form!: FormGroup;
    errorMessage = '';
    local = localStorage;

    constructor(
        private fb: FormBuilder,
        private navigationService: NavigationService,
        private membersService: MembersService,
        private cookieService: CookieService
    ) { }

    ngOnInit(): void {
        const isUserLogged = this.cookieService.check('userLogged');
        if (isUserLogged) {
            this.readFromLocalStorage();
        } else {
            this.navigationService.isUserLogged.next(null);
        }
        this.form = this.fb.group({
            login : this.fb.control('', Validators.required),
            password: this.fb.control('', Validators.required)
        })
    }

    login(){
        if (this.isFormValid()) {
            this.membersService.loginUser(this.form.value).subscribe({
                next: (res: User) => {
                    this.navigationService.isUserLogged.next(res);                    
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

    readFromLocalStorage(){
        const user: any = {
            _id: this.local.getItem('_id'),
            login: this.local.getItem('login'),
            role: this.local.getItem('role'),
            name: this.local.getItem('name')
        } as User;
        if (user._id && user.login && user.role && user.name) {
            this.navigationService.isUserLogged.next(user);
        }
    }

}
