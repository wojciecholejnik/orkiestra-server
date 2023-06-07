import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NavigationService } from 'src/app/main-wrapper/navigation-service.service';
import { MembersService } from 'src/app/members/members.service';
import { NavOptions, User } from 'src/app/shared/models';
import { Location } from '@angular/common';

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
        private cookieService: CookieService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location
    ) { }

    ngOnInit(): void {
        const isUserLogged = this.cookieService.check('userLogged');
        if (isUserLogged) {
            this.readFromLocalStorage();
        } else {
            this.navigationService.isUserLogged.next(undefined);
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
                    const nav = this.location.getState() as any;
                    if (nav && nav.navigationId) {
                        if (window.location.pathname.split('/').length === 2) {
                            this.router.navigate([`/main/${NavOptions.dashboard}`])
                        }
                        if (window.location.pathname.split('/').length > 2) {
                            this.router.navigate([window.location.pathname])
                        }
                    }
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
            firstName: this.local.getItem('firstName'),
            lastName: this.local.getItem('lastName')
        } as User;
        if (user._id && user.login && user.role && user.firstName && user.lastName) {
            this.navigationService.isUserLogged.next(user);
        }
    }

}
