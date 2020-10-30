import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoSingleUserComponent } from './todo-single-user/todo-single-user.component';
import { TodoMultiUserComponent } from './todo-multi-user/todo-multi-user.component';
import { FriendsComponent } from './friends/friends.component';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner"; 
import { CountdownModule } from 'ngx-countdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';



@NgModule({
  declarations: [TodoSingleUserComponent, TodoMultiUserComponent, FriendsComponent],
  imports: [
    CommonModule,
    FormsModule,
    CountdownModule,
    BrowserAnimationsModule,
    Ng2SearchPipeModule,
    NgxSpinnerModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    RouterModule.forChild([
      {path:'my-todo-list', component:TodoSingleUserComponent},
      {path:'multi-todo',component:TodoMultiUserComponent},
      {path:'friends',component:FriendsComponent}
    ]),
  ]
})
export class TodoListModule { }
