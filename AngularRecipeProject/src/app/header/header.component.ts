import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';


@Component({
    selector: 'app-header',
    templateUrl:'./header.component.html',
    styleUrls: []
})
export class HeaderComponent implements OnInit, OnDestroy{
    isAuthenticated=false;
    authSub = new Subscription()

    constructor(private dataStorageService:DataStorageService, private authService:AuthService){}
    
    ngOnInit(){
        this.authSub=this.authService.user.subscribe(user=>{
            this.isAuthenticated= !!user
            console.log(!user)
        })
    }

    onSaveRecipes(){
        this.dataStorageService.storeData()
    }

    onFetchRecipes(){
        this.dataStorageService.fetchRecipes().subscribe()
    }

    onLogout(){
        this.authService.logout();
    }

    ngOnDestroy(){
        this.authSub.unsubscribe();
    }
}