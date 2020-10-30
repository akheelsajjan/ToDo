import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from 'src/app/socket.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
  providers: [SocketService]
})
export class FriendsComponent implements OnInit {

  public users: any;
  public users1: any;
  public requests: any = []
  public listName1: String
  public isPrivate: Boolean = false
  public response: any = []
  public listName: String
  public listId: String


  //Cookie
  public token: String;
  public userId: String;
  public userName: String;

  //for undos
  public item: any
  public undoObj: any;
  public itemSave: any
  public subItem: any
  public subItemSave: any


  constructor(
    public socketService: SocketService,
    public appService: AppService,
    public toastr: ToastrService,
    public router: Router,
    private SpinnerService: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.SpinnerService.hide();

    this.token = Cookie.get('authtoken')
    this.userId = Cookie.get("receiverId");
    this.userName = Cookie.get("receiverName");

    this.checkStatus();

    this.verifyUserConfirmation();

    this.getOnlineUserList();

    this.getAllUsers();

    this.alreadySentResponse();

    this.alreadyFriendResponse();

    this.saveRequest();

    this.rejectResponse();

    this.acceptResponse();

    this.unfriendResponse();

    this.listenUpdate()

  }

  ngOnDestroy() {
    this.socketService.exitSocket()
  }


  public gotologin = () => {
    this.SpinnerService.show();
    this.router.navigate(['/login'])
  }

  todo = () => {
    this.SpinnerService.show();
    this.router.navigate(['my-todo-list'])
  }

  friends = () => {
    this.SpinnerService.show();
    this.router.navigate(['friends'])
  }

  multiTodo = () => {
    this.SpinnerService.show();
    this.router.navigate(['multi-todo'])
  }

  //user confirmation

  public verifyUserConfirmation = () => {

    this.socketService.verifyUser().subscribe((response) => {

      this.socketService.setUser(this.token);

    })
  }

  public checkStatus: any = () => {
    if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {
      this.SpinnerService.show();
      this.router.navigate(['login']);

      return false;

    } else {

      return true;

    }
  }


  //for getting all users
  public getAllUsers = () => {

    this.appService.getAllUsers().subscribe((apiResponse: any) => {

      if (apiResponse['data'] != null) {

        this.users1 = apiResponse.data;
      }

    })
  }






  public getOnlineUserList: any = () => {

    this.socketService.onlineUserList()

      .subscribe((userListfromdb) => {

        this.users = [];


        for (let x in userListfromdb) {

          let temp = { 'userId': x, 'fullName': userListfromdb[x] };

          this.users.push(temp);

        }

      });//end subscribe

  }//end getOnlineUserList










  //Logout:
  public logout = () => {

    this.SpinnerService.show();

    this.appService.logout().subscribe((apiResponse) => {

      if (apiResponse.status === 200) {

        Cookie.delete('authtoken');

        Cookie.delete('receiverId');

        Cookie.delete('receiverName');

        this.socketService.disconnectedSocket();//calling the method which emits the disconnect event.

        this.socketService.exitSocket()

        this.router.navigate(['/']);

      } else {
        this.SpinnerService.hide();
        this.toastr.error(apiResponse.message)
      } // end condition

    }, (err) => {
      this.SpinnerService.hide();
      this.toastr.error('some error occured')

    });

  }





  //----------------Request-------------------//

  //--send request--//

  public sendRequest = (id) => {

    let data = {
      receiverId: id,

      senderId: this.userId,

      senderName: this.userName

    }

    this.socketService.sendRequest(data)

  }

  public alreadySentResponse = () => {

    this.socketService.sendRequest_alreadySent().subscribe((apiResponse) => {

      this.toastr.error(apiResponse)

    })
  }

  public alreadyFriendResponse = () => {

    this.socketService.sendRequest_alreadySent_response().subscribe((apiResponse) => {

      this.toastr.error(apiResponse)

    })
  }

  public saveRequest = () => {

    this.socketService.saveRequest().subscribe((apiResponse) => {

      this.toastr.success(apiResponse);

      this.getAllUsers();

    })
  }

  //--send request--//

  //---Reject request ----//

  public rejectRequest = (id) => {

    let data = {

      receiverId: this.userId,

      senderId: id,

      receiverName: this.userName,

      action: "Reject"

    }

    this.socketService.rejectRequest(data)

  }

  public rejectResponse = () => {

    this.socketService.rejectRequest_response().subscribe((apiResponse) => {

      this.toastr.warning("Request Rejected");

      this.getAllUsers();

    })
  }

  //---END OF Reject request ----//


  //----Accept  request-----//

  public acceptRequest = (id, name) => {

    let data = {

      senderId: id,

      receiverId: this.userId,

      receiverName: this.userName,

      senderName: name

    }

    this.socketService.acceptRequest(data);
  }

  public acceptResponse = () => {

    this.socketService.acceptRequest_response().subscribe((apiResponse) => {

      this.toastr.info(apiResponse);

      this.getAllUsers();

    })
  }

  //----END OF Accept  request-----//

  //------Deleting A Friend-----------//:

  public deletefriend = (id) => {

    let data = {

      friendId: id,

      myId: this.userId,

      myName: this.userName,

      action: "Unfriend"

    }
    this.socketService.unfriend(data)

  }

  public unfriendResponse = () => {

    this.socketService.unfriend_response().subscribe((apiResponse) => {

      this.toastr.warning(apiResponse);

      this.getAllUsers();

    })
  }

  //------END Of Deleting A Friend-----------//:


  //---------Socket Messages-----------------// 

  public listenUpdate = () => {

    this.socketService.listenUpdate(this.userId).subscribe((apiResponse) => {

      //Use Switch 

      if (apiResponse.action == "Accept") {

        this.toastr.success(apiResponse.friendName + " has  accepted your friend request");

      } else if (apiResponse.action == "Request") {

        this.toastr.info(apiResponse.senderName + " has  sent you friend request");

        this.getAllUsers();

      } else if (apiResponse.action == "Unfriend") {

        this.toastr.error(apiResponse.myName + " has removed you from his  friends list")

      } else if (apiResponse.action == "Reject") {

        this.toastr.error(apiResponse.receiverName + " has rejected your friend request")

      } else { }


      this.getAllUsers();
      /*
          switch(apiResponse.action){
            case apiResponse.action=='Accept':{
              this.toastr.success(`${apiResponse.friendName} has accepted your friend request`);
            }
            case apiResponse.action=='Request':{
              this.toastr.success(`${apiResponse.friendName} sent you friend request-->`);
            }
            case apiResponse.action=='Unfriend':{
              this.toastr.success(`${apiResponse.friendName} removed you from friend list`);
            } 
            case apiResponse.action=='Reject':{
              this.toastr.success(`${apiResponse.friendName} rejected your friend request`);
            }
      
      
          }
      
          this.getAllUsers();
      */
    })
  }

  //----------End of socket messages--------//

}
