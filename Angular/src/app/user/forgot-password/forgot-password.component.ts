import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public email: any;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrService,
    vcr: ViewContainerRef,
    private SpinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.SpinnerService.hide();
  }


  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);

  } // end goToSignUp

  

  public goToLogIn: any = () => {

    this.router.navigate(['login']);

  } // end goToSignUp


  public sendLink = () => {

    if (!this.email) {

      this.toastr.warning('enter email')

    }
    this.SpinnerService.show(); 

    this.appService.forgotPassword(this.email).subscribe(

      (response) => {

        
        if (response['status'] === 200) {

          this.toastr.success("Check Your Email Indbox", "Reset Link Sent Successfully");

          setTimeout(() => {

            this.router.navigate(['login'])

          }, 1000)
        }

        else if (response['status'] === 404) {
          this.SpinnerService.hide();
          this.toastr.error("Please Sign Up", "No Email ID Found")
        }
        else if (response['status'] === 500) {
          this.SpinnerService.hide();
          this.toastr.error("Failed To Find Your Email ID", "Please Try Again Later");

        } else {
          this.SpinnerService.hide();
          this.toastr.error("Some Error Occured");
        }

  
     },


   (error) => {
         this.SpinnerService.hide();
         this.toastr.error(error.message)
      }

    )

  }


}
