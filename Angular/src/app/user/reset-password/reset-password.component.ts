import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public password: string;
  public userId:string;

  constructor(
    public appService: AppService,
    public router: Router,
    public route:ActivatedRoute,
    private toastr: ToastrService,
    vcr: ViewContainerRef,
    private SpinnerService: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.SpinnerService.hide()
  }

  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);

  } // end goToSignUp


  public resetPassword = () =>{
    this.userId = this.route.snapshot.paramMap.get('userId');

    if(!this.password){
        this.toastr.warning("Enter Your New Password!!")
    } else{

     let  data = {
        password:this.password,
        userId:this.userId 
      }
      this.SpinnerService.show();

      this.appService.updateUser(data).subscribe(
        (data)=>{
        
          
          if(data['status'] === 200){
          
            setTimeout(()=>{
              this.toastr.success(data['message']);
              this.router.navigate(['login'])
            },1500)


          }else if(data['status'] === 500){

            setTimeout(()=>{

              this.toastr.error(data['message'])
              this.SpinnerService.hide()
            },1000)

          }


        },(error)=>{
          this.SpinnerService.hide()
          this.toastr.error(error.message)      

        }
      )
    }
   
  }
}
