import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';


import { AppService } from './app.service';

import { TodoListModule } from './todo-list/todo-list.module';
import { LoginComponent } from './user/login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { NgxSpinnerModule } from "ngx-spinner"; 
import { CountdownModule } from 'ngx-countdown';
import { DatePipe } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ServerErrorComponent

  ],
  imports: [
    BrowserModule,
    UserModule,
    TodoListModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    CountdownModule,
    Ng2SearchPipeModule,
    RouterModule.forRoot(
      [
        { path: "login", component: LoginComponent, pathMatch: 'full' },
        { path:'page-not-found', component: PageNotFoundComponent},
        { path:'server-error', component:ServerErrorComponent},
        { path: "", redirectTo: 'login', pathMatch: 'full' },
        { path: "*", component: LoginComponent },
        { path: "**", component: LoginComponent },


      ]
    ),

    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(
      {
        timeOut: 2000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      }
    ), // ToastrModule added

  ],
  exports: [RouterModule],
  providers: [AppService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
