import { Injectable } from '@angular/core';
@Injectable()
export class AuthService{

 constructor() { }

 getAuthToken():string {
    const tokenFromStorage = localStorage.getItem('token')
 return  tokenFromStorage ? tokenFromStorage: 'no-token'
 }
}
