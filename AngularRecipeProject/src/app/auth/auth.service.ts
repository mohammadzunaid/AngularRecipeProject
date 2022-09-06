import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';
import { environment } from '../../environments/environment';


export interface AuthResponseData{
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered? : boolean
}

@Injectable({
    providedIn:'root'
})
export class AuthService{
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer : any;

    constructor(private http:HttpClient, private router: Router){}

    signUp(email:string, password:string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+ environment.firebaseAPIKey,{
            email:email,
            password:password,
            returnSecureToken: true
        }).pipe(catchError(this.errorHandle),tap(resData=>{
            this.handleAuthenntication(email,resData.localId,resData.idToken, +resData.expiresIn)
        }))
    }

    login(email: string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+ environment.firebaseAPIKey,{
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.errorHandle),tap(resData=>{
            this.handleAuthenntication(email,resData.localId,resData.idToken, +resData.expiresIn)
        }))
    }

    autoLogin(){
        const userData:{
            email : string,
            id: string,
            _token : string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        
        if(!userData){
            return
        }
        
        const loadedUser= new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate))
        if (loadedUser.token){
            this.user.next(loadedUser)
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
            console.log(expirationDuration)
            this.autoLogout(expirationDuration)
        }

    }

    logout(){
        this.user.next(null);
        localStorage.removeItem("userData")
        this.router.navigate(['/auth']);
        if(this.tokenExpirationTimer)
        {
            clearTimeout(this.tokenExpirationTimer)
        }      
        this.tokenExpirationTimer=null  
    }

    autoLogout(expirationDuration: number){
        this.tokenExpirationTimer=setTimeout(()=>{
            this.logout()
        }, expirationDuration)
    }

    private handleAuthenntication(email: string, id:string, idToken:string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
        const user=new User(email,id,idToken,expirationDate)        
        this.user.next(user);
        this.autoLogout(expiresIn * 1000)
        localStorage.setItem('userData',JSON.stringify(user));
    }


    private errorHandle(errorRes: HttpErrorResponse) {

        let errorMessage = "An UnKnown Error Occurred!"
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        } else {
            switch (errorRes.error.error.message) {
                case "EMAIL_EXISTS":
                    errorMessage = "This email already exists!";
                    break;
                case "EMAIL_NOT_FOUND":
                    errorMessage = "This email does not exists!";
                    break;
                case "INVALID_PASSWORD":
                    errorMessage = "This password is not correct!";
            }
            return throwError(errorMessage)
        }
        
    }
}