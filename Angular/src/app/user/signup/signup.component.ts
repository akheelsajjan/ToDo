import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  //User Info
  public firstName: any;
  public lastName: any;
  public mobile: any;
  public email: any;
  public password: any;
  public code:any = [];
  public countryCode:any
  

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

    this.appService.getCountryCode().subscribe(
      (data)=>{
        this.code = data;
       
      },(error)=>{
          this.toastr.error("Some error occured","Please try again later");
      }
    )
  }

  public goToSignIn: any = () => {

    this.router.navigate(['/']);

  } // end goToSignIn

  



  public signupFunction: any = () => {

    //validate info
    if (!this.firstName) {
      this.toastr.warning('enter first name')
     

    } else if (!this.lastName) {
      this.toastr.warning('enter last name')

    } else if (!this.mobile) {
      this.toastr.warning('enter mobile')

    } else if (!this.email) {
      this.toastr.warning('enter email')

    }else if(!this.countryCode){
      this.toastr.warning('Please Select Country code')
    }
     else if (!this.password) {
      this.toastr.warning('enter password')
     

    } 

     else {

      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobile: this.countryCode + this.mobile,
        email: this.email,
        password: this.password,
      
      }

       this.SpinnerService.show(); 

     // console.log(data);

      this.appService.signupFunction(data)
        .subscribe((apiResponse) => {

        //  console.log(apiResponse);

          if (apiResponse.status === 200) {

            this.toastr.success('Signup successfull');

            setTimeout(() => {

              this.router.navigate(['check-email'])

            }, 2000);

          } else if(apiResponse.status===404){
              setTimeout(() => {
                this.toastr.error(apiResponse.message)
                this.router.navigate(['/page-not-found']);
    
              },1000);
             
            }
            else if(apiResponse.status===500){
              setTimeout(()=>{
                this.toastr.error(apiResponse.message)
                this.router.navigate(['/server-error']);
              },1000)
              
            }

            else if(apiResponse.status===400){
              setTimeout(()=>{
                this.toastr.error(apiResponse.message)
                this.router.navigate(['/server-error']);
              },1000)
              
            }

            else if(apiResponse.status===403){
              setTimeout(()=>{
                this.toastr.error(apiResponse.message, 'Please Login');
                this.router.navigate(['/login']);
                //this.router.navigate(['/server-error']);
              },1000)
              
            }
            else {
              this.SpinnerService.hide();
              this.toastr.error(apiResponse.message,'error occured');
  
            }

          

        }, (err) => {

        //  console.log(err,)
        this.SpinnerService.hide();
          this.toastr.error('some error occured');

        });

        

    } // end condition

  } // end signupFunction

}
