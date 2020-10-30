import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.css']
})
export class EmailVerifyComponent implements OnInit {


  public userId;
  public success;
  public fail;

  constructor(public appService:AppService, public route:ActivatedRoute,public router:Router, public toaster:ToastrService) { }

  ngOnInit(): void {

    this.userId = this.route.snapshot.paramMap.get('userId');

    this.appService.verifyEmail(this.userId).subscribe(

      (data)=>{

        if(data.status === 200){

          this.success = 1;

        }else{

          this.success = -1;

        }

      },(error)=>{
          this.toaster.error("Some Error Occured")
      }
    )


  }


  public logIn = () =>{
    this.router.navigate(['login'])
  }

}
