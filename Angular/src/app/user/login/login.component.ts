import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from './../../app.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //User Info
  public email: any;
  public password: any;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrService,
    vcr: ViewContainerRef,
    private SpinnerService: NgxSpinnerService
  ) {

    

  }

  ngOnInit() {
    this.SpinnerService.hide();
  }

  public goToSignUp: any = () => {

   
    this.SpinnerService.show(); 
    setTimeout(() => {
      this.router.navigate(['/sign-up']);
    },1000);

  } // end goToSignUp

  public forgotPassword = () =>{
    this.SpinnerService.show(); 
    setTimeout(() => {
      this.router.navigate(['forgotPassword'])
    },1000);
   
  }

  public signinFunction: any = () => {

    //validatation
    if (!this.email) {
      this.toastr.warning('enter email')


    } else if (!this.password) {

      this.toastr.warning('enter password')


    } else {

      let data = {
        email: this.email,
        password: this.password
      }

      this.SpinnerService.show(); 

      this.appService.signinFunction(data)
        .subscribe((apiResponse) => {
           
          if (apiResponse.status === 200) {
           // console.log(apiResponse)

             Cookie.set('authtoken', apiResponse.data.authToken);
          
             Cookie.set('receiverId', apiResponse.data.userDetails.userId);
            
             Cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
           
             this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
            
             setTimeout(()=>{
              this.toastr.success(apiResponse.message,'Login Sucessfull');
              this.SpinnerService.hide();
              this.router.navigate(['/my-todo-list']);

           //this.router.navigate([''])
             },1000)
            

          } else {
            this.SpinnerService.hide();
            this.toastr.error(apiResponse.message)
          

          }

        }, (err) => {
          if(err.status === 404){
            setTimeout(() => {
              this.toastr.error('No User Found','Create a Account to lgin'); 
            },1000);

            setTimeout(() => {
              this.router.navigate(['sign-up']);
            },2500);
          
          }
          else if(err.status === 500){
            setTimeout(()=>{
              this.toastr.error('Failed to find User','Login Fail')
              //this.router.navigate(['/server-error']);
            },1000)
            
          }
          else if(err.status === 400){
            setTimeout(()=>{
              this.toastr.error('Wrong Password','login failed')
              
            },1000)

          }

          else{
            setTimeout(()=>{
          
              this.router.navigate(['sign-up']);
              this.toastr.error('Create a Account','')
            },2000)
          }

        });

    } // end condition

  } // end signinFunction

  

  

}