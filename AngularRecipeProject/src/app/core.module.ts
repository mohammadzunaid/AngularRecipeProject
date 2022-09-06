import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { ShoppingListService } from './shopping-list/shoppingL-list.service';

@NgModule({
    providers: [ShoppingListService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }]
})
export class CoreModule{}