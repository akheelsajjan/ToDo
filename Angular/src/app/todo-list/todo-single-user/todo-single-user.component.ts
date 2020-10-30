import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { NgxSpinnerService } from 'ngx-spinner';
import { CountdownComponent } from 'ngx-countdown';

import * as moment from 'moment'; 

@Component({
  selector: 'app-todo-single-user',
  templateUrl: './todo-single-user.component.html',
  styleUrls: ['./todo-single-user.component.css'],
  providers: [SocketService]
})
export class TodoSingleUserComponent implements OnInit {


  @ViewChild('scrollMe', { read: ElementRef })
  public scrollMe: ElementRef;

  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  

  public authToken: any;
  public userInfo: any;
  public userList: any = [];
  public disconnectedSocket: boolean;



  public receiverId: any;
  public receiverName: any;


  public pageValue: number = 0;




  public typingName: String = "";
  public temp;


  //--LIST INFO--//
  public listInfo: any = "";
  public listName: String;
  public listId: any;
  public listSelcted: boolean;
  public listPrivate: boolean;

  //--ITEM INFO--//
  public itemInfo: any;
  public itemName: any;
  public itemId: any;
  public itemSave: any;
  public itemIsDone:any;
  public dueDate: Boolean = false;
  public duePeriod: any = 1;
 
  //--SUB ITEM INFO--//
  public subItemInfo: any;
  public subItemName: any;
  public subItemId: any
  public isdone: Boolean;
  public subItem: any;

  term:any

  constructor(

    private router: Router,

    private appService: AppService,

    private toastr: ToastrService,

    public SocketService: SocketService,

    private cdRef: ChangeDetectorRef,

    private SpinnerService: NgxSpinnerService,

   

  ) {
    this.cdRef.detectChanges;

    this.receiverId = Cookie.get('receiverId');

    this.receiverName = Cookie.get('receiverName');

  }//chatBoxComponent constructor end

  ngOnInit() {
    this.SpinnerService.hide();

    this.authToken = Cookie.get('authtoken');

    this.userInfo = this.appService.getUserInfoFromLocalStorage();

    this.checkStatus();

    this.verifyUserConnection();

    this.getAllUsers();

    this.getAllList();

    //sockets
    this.listenUpdate();

  }// ngOnInit end here


  ngOnDestroy() {

  }

  //----------------------------ROUTE TO OTHER PAGE---------------------//

  multiTodo = () => {
    this.SpinnerService.show(); 

    this.router.navigate(['multi-todo'])

  }

  public logout = () => {

    this.SpinnerService.show(); 

    this.appService.deleteAllUndoItems().subscribe(

      (apiResponse) => {

        this.appService.logout().subscribe(

          (apiResponse) => {

            if (apiResponse.status === 200) {

              Cookie.delete('authtoken');

              Cookie.delete('receiverId');

              Cookie.delete('receiverName');

              this.SocketService.disconnectedSocket();

              this.SocketService.exitSocket()

              this.router.navigate(['/']);

            } else {

              this.toastr.error(apiResponse.message);

              this.SpinnerService.hide(); 


            }
          }


        )
      },

      (err) => {

        this.toastr.error('some error occured');

        this.SpinnerService.hide(); 


      });
  }

  //---------------------------- END OF ROUTE TO OTHER PAGE---------------------//



  //----------------------------VERIFY USER -----------------------------------//

  public checkStatus: any = () => {

    if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {
      
      this.SpinnerService.show(); 

      this.router.navigate(['login'])

      return false;

    } else {

      return true;

    }
  }

  public verifyUserConnection: any = () => {

    this.SocketService.verifyUser()

      .subscribe((data) => {

        this.disconnectedSocket = false;

      

        this.SocketService.setUser(this.authToken);

      });
  }//end verifyUserConnection


  public getOnlineUserList: any = () => {

    this.SocketService.onlineUserList()

      .subscribe((userList) => {

        this.userList = [];

        for (let x in userList) {

          let temp = { 'userId': x, 'name': userList[x], 'unread': 0, 'chatting': false };

          this.userList.push(temp);

        }
      });
  }//end getOnlineUserList

  //===================================END OF VERIFY USER===========================================//

  //==============================TO DO APPLICATION ======================================//

  public getAllUsers = () => {

    this.appService.getAllUsers().subscribe(

      (data) => {

        let Alluserdata = data['data']

        for (let user of Alluserdata) {

          if (this.receiverId == user.userId) {

          }

        }
      }
    )
  }

  //--------------------------------------List------------------------------------------//  

  public getAllList = () => {

    this.appService.getlistofuser(this.receiverId).subscribe(

      (data) => {
        if (data['data'] != null) {

          this.cdRef.markForCheck();

          let Lists = data['data']

          this.listInfo = Lists;

       

        }


      }
    )

  }

  public getListInfo = (listId, listName) => {

    this.listId = listId;

    this.listName = listName;

    this.listSelcted = true;

    this.toastr.show(this.listName + " selected");

    this.getAllItems(listId);


  }


  //------------------------------------create-list--------------------------------------//

  public createList = () => {

    if (!this.listName) {

      this.toastr.warning("List Name is required");

    } else {

      let data = {

        listName: this.listName,

        userId: this.receiverId,

        creator: this.receiverName,

        private: true

      }
      
    
      this.appService.createList(data).subscribe(

        (data) => {

          this.toastr.success("created list");

          this.getAllList();

        },
        (error) => {

          this.toastr.error("Failed to save the list")

        }
      )
    }


  }

  //-------------------------------------delete List----------------------------//

  public deleteList = () => {

    this.appService.deleteList(this.listId).subscribe(

      (data) => {

        this.listSelcted = false;

 

        this.getAllList();

        this.toastr.success("List delted successfully");

      }, (error) => {

        this.toastr.error("Failed to Delte the list")

      }
    )
  }


  //-----=================================-edit-list============================----------------//


  public editList = () => {

    if (!this.listName) {

      this.toastr.warning("List Name is required");

    } else {


      let data = {

        listName: this.listName,

        listId: this.listId



      }

      this.appService.editList(data).subscribe(

        (data) => {

          this.getAllList();

          setTimeout(() => {

            this.toastr.success("List Edited successfully");

          }, 1000)

          this.getListInfo(this.listId, this.listName);

          this.cdRef.detectChanges();

        }, (error) => {

          this.toastr.error("Failed to Edit the list")

        }
      )
    }
  }

  //--------------------Item------------------------------//

  public getAllItems = (listId) => {

    this.appService.getItemOfList(listId).subscribe(

      (data) => {



        this.itemInfo = data['data'];

        if (data['data'] != null) {

          let Items = data['data'];

          this.itemInfo = Items;



          for (let item of this.itemInfo) {
           
            setTimeout(()=>{

              let now = moment();

              var duration = moment.duration(now.diff(item.createdOn));
  
              var days = duration.asHours();

              item.days = days;
  
            
  
              if(item.isDone !== 'Due' ){
  
                if( item.isDone !=='Completed'){
  
         
  
                    if(days > item.duePeriod){
  
                    
      
                      this.getItemInfo(item);
    
                      
      
             
      
                        this.toastr.error(item.itemName + " Item Got DUE"," Please click on the list",{
                          timeOut: 10000
                        })
  
                        this.itemIsDone = 'Due';
                        
                        
                        this.editItem();
                      
                      
      
                    
      
                    }
  
  
  
                }
  
  
              }

            },1000)






          }



        }


      }
    )
  }






  //-----------------------------create-Item------------------------//


  

  public createItem = () => {

   
 
    if (!this.itemName) {

      this.toastr.warning("Item Name  is required");

    } else {

      let data = {

        listId: this.listId,

        itemName: this.itemName,

        duePeriod:  this.duePeriod

      }

     

      
      this.appService.createItem(data).subscribe(

        (data) => {

          this.getAllItems(this.listId);

          this.toastr.success("Item Name" + this.itemName, " Created Successfully");

         


        },
        (error) => {

          this.toastr.error("Failed to create the Item");

        }
      )

      
    }


  }


  public createPersonalItem = () =>{
    this.itemName = "Pesronal";
    this.createItem()
  }

  public createWorkItem = () =>{
    this.itemName = "Work"
    this.createItem()
  }

  public createShoppingItem = () =>{
    this.itemName = "Shopping"
    this.createItem()
  }

  //-timer--//






  //--tiemer--//

  //---------------------------------delete-Item--------------------------//

  public deleteItem = (item) => {

    this.itemSave = item;

    this.appService.deleteItem(item.itemId).subscribe(

      (data) => {

        this.getAllItems(this.listId);

        this.createUndoItem_delete();

        this.toastr.success("Item delted successfully");

      }, (error) => {

        this.toastr.error("Failed to Delte the Item")

      }
    )
  }


  //---------------------------------------Edit SubItem-------------------------------//


  
  public getItemInfo = (item) => {

    //console.log(item);

    this.itemSave = item;

    this.itemName = item.itemName;

    this.itemId = item.itemId;

    this.itemIsDone = item.isDone

   
   
  
  

    this.toastr.show(this.itemName + " selected",this.itemIsDone);

    this.getAllSubItems(this.itemId)

    

    if(item.isDone === "New"){

      this.itemIsDone = "In-Progress";
      
      this.editItem();

    }



  }






  public itemProgress = () =>{
    this.itemIsDone = "In-Progress";
    this.editItem();
  }

  public itemCompleted = () =>{

    this.itemIsDone = "Completed";
    this.editItem();

  }

  public editItem = (item?) => {

 

    if(this.itemIsDone == 'New' ){

      this.itemIsDone = 'In-Progress';

    }

    if (!this.itemName) {

      this.toastr.warning("Item Name is required");

    } else {

      let data = {

        itemName: this.itemName,

        itemId: this.itemId,

        isDone: this.itemIsDone

      }

  

      this.appService.editItem(data).subscribe(

        (data) => {
    
          this.getAllItems(this.itemId);

        

          setTimeout(() => {

            this.toastr.success("Item Edited successfully");

            //this.itemIsDone = "";

          }, 100)

          if( this.itemIsDone !== 'Due'){

            this.createUndoItem_update();

          }
         

        }, (error) => {

          this.toastr.error("Failed to Edit the Item")
        }
      )
    }
  }



  //----------------------------SubItems-------------------------------------//



  public getAllSubItems = (itemId) => {

    this.appService.getSubItem(itemId).subscribe(

      (data) => {

        if (data['data'] != null) {

          let SubItems = data['data'];

          this.subItemInfo = SubItems;

        } else {

          this.subItemInfo = "";
        }

      }
    )
  }


  public createSubItem = () => {
     
    if (!this.subItemName) {

      this.toastr.warning("sub-Item-Name  is required");

    } else {

      let data = {

        itemId: this.itemId,

        subItemName: this.subItemName

      }

      this.appService.createSubItem(data).subscribe(

        (data) => {

          this.getAllSubItems(this.itemId);

          this.toastr.success("subItem created");

        },
        (error) => {

          this.toastr.error("Failed to create the subItem");

        }
      )
    }
  }


  public deleteSubItem = (subItem) => {

    this.subItem = subItem

    this.appService.deleteSubItem(subItem.subItemId).subscribe(

      (data) => {

        this.getAllSubItems(this.itemId);

        this.createUndoSubItem_delete();


        this.toastr.success("subItem delted successfully");

      }, (error) => {

        this.toastr.error("Failed to Delte the subItem")

      }
    )
  }

  sendSubItemId = (subItem) => {

    this.subItemId = subItem.subItemId;

    this.subItem = subItem

    // console.log(this.subItem)
  }



  public markDone = (subItemId, subItemName) => {

    this.subItemId = subItemId;

    this.subItemName = subItemName;

    this.isdone = false;

    this.editSubItem();


  }


  public markUnDone = (subItemId, subItemName) => {

    this.subItemId = subItemId;

    this.subItemName = subItemName;

    this.isdone = true;

    this.editSubItem();
  }



  public nameValidate = () => {

    if (!this.subItemName) {

      this.toastr.warning("subItem Name is required");

    } else {

      this.editSubItem();

    }
  }

  public editSubItem = () => {

    let data = {

      subItemId: this.subItemId,

      subItemName: this.subItemName,

      isDone: this.isdone

    }


    this.appService.editSubItem(data).subscribe(

      (data) => {

        this.getAllSubItems(this.itemId);

        setTimeout(() => {

          this.toastr.success("SubItem Edited successfully");

        }, 1000)

        this.createUndoSubItem_update();

      }, (error) => {

        this.toastr.error("Failed to SubItem the Item")
      }
    )
  }


  subItemInformation = (subItem) => {

    this.subItemId = subItem.subItemId;

    this.subItem = subItem

  }

  //---------------------------------Undo Items-----------------------------//


  public createUndoItem_delete = () => {

    this.appService.createUndoItem(this.itemSave).subscribe(

      (data) => {

      //  console.log("deleted item saved in undoitem");


      }, (error) => {

        this.toastr.error(error.message)

      }
    )
  }


  public createUndoItem_update = () => {

    this.appService.createUndoItem_update(this.itemSave).subscribe(

      (data) => {

        //console.log("Edited item saved in undoitem");

      }, (error) => {

       // console.log(" Edited item failed to save in undo Item");
       this.toastr.error(error.message)

      }
    )
  }


  public getUndoItem = (listId) => {

    this.appService.getPreviousItem(listId).subscribe(

      (data) => {

        if (data['status'] == 200) {

          let undoItem = data['data'];

          if (undoItem[0].action == 'delete') {

            let data = {

              listId: undoItem[0].listId,

              itemName: undoItem[0].itemName

            }

            this.appService.createItem(data).subscribe(

              (data) => {

                this.getAllItems(this.listId);

                this.toastr.success("Item got back successfully");

                let delete_data = {

                  itemId: undoItem[0].itemId,

                  itemName: undoItem[0].itemName

                }

                this.deleteSingleItem_undo(delete_data)

              },
              (error) => {

                this.toastr.error(error);

              }
            )

          }

          else if (undoItem[0].action == 'update') {

            let data = {

              itemId: undoItem[0].itemId,

              itemName: undoItem[0].itemName

            }

            this.appService.editItem(data).subscribe(

              (data) => {

                this.getAllItems(this.listId);


                setTimeout(() => {

                  this.toastr.success("Item Edited successfully");

                }, 1000)

                let delete_data = {

                  itemId: undoItem[0].itemId,

                  itemName: undoItem[0].itemName
                }

                this.deleteSingleItem_undo(delete_data)


              }, (error) => {

                this.toastr.error("Failed to Edit the Item")

              }
            )


          }
        } else if (data['status'] == 404) {

          this.toastr.warning("Undo Not available")
        }

      }, (error) => {

        this.toastr.error(error.message)
      }
    )


  }


  public deleteSingleItem_undo = (data) => {

    this.appService.deleteUndoItem(data).subscribe(

      (data) => {

       // console.log(data);

      }, (error) => {

        this.toastr.error(error.message)
      }
    )
  }



  //----------------Undo SubItems----------------------//


  public createUndoSubItem_delete = () => {

    this.appService.createUndoSubItem(this.subItem).subscribe(

      (data) => {

        //console.log(data);


      }, (error) => {

        this.toastr.error(error.message)

      }
    )
  }


  public createUndoSubItem_update = () => {

    this.appService.createUndoSubItem_update(this.subItem).subscribe(

      (data) => {

      //  console.log(data);

      }, (error) => {

      //  console.log(error);


      }
    )
  }


  public getUndoSubItem = (itemId) => {

    this.appService.getPreviousSubItem(itemId).subscribe(

      (data) => {

        if (data['status'] == 200) {

          let undoSubItem = data['data'];


          if (undoSubItem[0].action == 'delete') {


            let data = {

              itemId: undoSubItem[0].itemId,

              subItemName: undoSubItem[0].subItemName

            }

            this.appService.createSubItem(data).subscribe(

              (data) => {

                this.getAllSubItems(this.itemId);

                this.toastr.success("subItem got back successfully");

                let delete_data = {

                  subItemId: undoSubItem[0].subItemId,

                  subItemName: undoSubItem[0].subItemName

                }

                this.deleteSingleSubItem_undo(delete_data)
              },
              (error) => {

                this.toastr.error(error);

              }

            )

          }

          else if (undoSubItem[0].action == 'update') {

            let data = {

              subItemId: undoSubItem[0].subItemId,

              subItemName: undoSubItem[0].subItemName,

              isDone: undoSubItem[0].isDone

            }




            this.appService.editSubItem(data).subscribe(

              (data) => {

                this.getAllSubItems(this.itemId);


                setTimeout(() => {

                  this.toastr.success("Item Edited successfully");

                }, 1000)

                let delete_data = {

                  subItemId: undoSubItem[0].subItemId,

                  subItemName: undoSubItem[0].subItemName

                }

                this.deleteSingleSubItem_undo(delete_data)


              }, (error) => {

                this.toastr.error("Failed to Edit the Item")
              }
            )


          }
        } else if (data['status'] == 404) {

          this.toastr.warning("Undo Not available")
        }

      }, (error) => {

        this.toastr.error(error.message)
      }
    )


  }


  public deleteSingleSubItem_undo = (data) => {

    this.appService.deleteUndoSubItem(data).subscribe(

      (data) => {

       /// console.log(data);

      }, (error) => {

       // console.log(error)

      }
    )
  }

  //---------------key-press-----------------------------//


  //creating list
  public addListKeyPress: any = (event: any) => {

    if (event.keyCode === 13) { // 13 is keycode of enter.

      this.createList();

    }

  }


  public addItemKeyPress: any = (event: any) => {

    if (event.keyCode === 13) { 

      this.createItem();

    }

  }


  public addSubItemKeyPress: any = (event: any) => {

    if (event.keyCode === 13) { 
    
      this.createSubItem();

    }

  }

  

  public editListKeyPress: any = (event: any) => {
   
    if (event.keyCode === 13) { 
      
      this.editList();
      
    }

  }

  

  public editItemKeyPress: any = (event: any) => {

    if (event.keyCode === 13) { // 13 is keycode of enter.

      this.editItem();

    }

  }

  
  public editSubItemKeyPress: any = (event: any) => {

    if (event.keyCode === 13) { // 13 is keycode of enter.

      this.editItem();

    }

  }


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 

  if(event.ctrlKey && event.key=='z' || event.metaKey && event.key=='z'){
   
    if(this.listId){

     this.getUndoItem(this.listId);

    }if(this.itemId){

      this.getUndoSubItem(this.itemId);
      
    }else {
      this.toastr.warning("Select either List/Item","To get previous item")
    }
   
  }
  
}

  //-----------------------------------SOCKETS----------------------------//

  
  public listenUpdate = () => {
    
    this.SocketService.listenUpdate(this.receiverId).subscribe((apiResponse) => {

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

    })
  }




}
