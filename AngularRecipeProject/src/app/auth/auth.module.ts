import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthComponent } from './auth.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [AuthComponent],
    imports: [ReactiveFormsModule, SharedModule, RouterModule.forChild([
        { path: '', component: AuthComponent }
    ])],
    exports: [AuthComponent,RouterModule]
})
export class AuthModule{
    
}