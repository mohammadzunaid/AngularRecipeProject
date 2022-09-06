import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';



@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode=true;
  loginForm : FormGroup;
  isLoading= false;
  error:string=null;
  @ViewChild(PlaceholderDirective, {'static': true}) alertHost: PlaceholderDirective;
  closeSub: Subscription;

  constructor(private authService:AuthService, private router: Router,private componentFactoryResolver: ComponentFactoryResolver) { }
  

  ngOnInit(): void {
    console.log(this.isLoginMode)
    this.loginForm=new FormGroup({
    email: new FormControl(null,[Validators.required,Validators.email]),
    password: new FormControl(null,[Validators.required,Validators.minLength(6)])
  })

  }

  onHandleError(){
    this.error=null;
  }

  private showErrorAlert(message : string){
    // const alertCmp= new AlertComponent();  // this will not work
    const alertCmpFactory=this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef=this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message=message;
    this.closeSub=componentRef.instance.close.subscribe(()=>{
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    })
  }
  
  onSwitchMode()
  {
    this.isLoginMode=!this.isLoginMode;
    console.log(this.isLoginMode)
  }
  
  onSubmit(){
    if (!this.loginForm.valid){
      return;
    }
    const email=this.loginForm.value.email;
    const password=this.loginForm.value.password;

    let authObservable: Observable <AuthResponseData>
    this.isLoading=true;

    if(this.isLoginMode){
      authObservable=this.authService.login(email,password)
    }else{
      authObservable=this.authService.signUp(email,password)
    }
    
    authObservable.subscribe(
      responseData => {
        this.isLoading = false;
        console.log(responseData);
        this.router.navigate(['/recipes']);
      },
      errorMsg => {
        this.isLoading = false;
        this.error = errorMsg;
        this.showErrorAlert(errorMsg);
        console.log(errorMsg)
      }
    )

    this.loginForm.reset()
    console.log(this.isLoginMode)
  }

  ngOnDestroy(){
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
  }
}
