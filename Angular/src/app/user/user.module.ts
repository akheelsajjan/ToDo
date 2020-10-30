import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { EmailVerifyComponent } from './email-verify/email-verify.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CheckEmailComponent } from './check-email/check-email.component';
import { NgxSpinnerModule } from "ngx-spinner"; 
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([ 
      { path: 'sign-up', component: SignupComponent },
      { path:'email-verify/:userId' ,component: EmailVerifyComponent},
      { path: 'forgotPassword', component: ForgotPasswordComponent },
      { path: 'resetPassword/:userId', component: ResetPasswordComponent },
      { path: 'check-email', component: CheckEmailComponent },
    ])
  ],
  declarations: [LoginComponent, SignupComponent, EmailVerifyComponent, ForgotPasswordComponent, ResetPasswordComponent, CheckEmailComponent]
})
export class UserModule { }
