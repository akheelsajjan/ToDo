import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { async } from 'rxjs/internal/scheduler/async';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-todo-multi-user',
  templateUrl: './todo-multi-user.component.html',
  styleUrls: ['./todo-multi-user.component.css'],
  providers: [SocketService]
})

export class TodoMultiUserComponent implements OnInit {

  //--USER--//
  public authToken: any;
  public userInfo: any;
  public userInfo2: any;
  public userList: any = [];
  public receiverId: any;
  public receiverName: any;

  public disconnectedSocket: boolean;
  public pageValue: number = 0;



   //--LIST--//
  public listInfo: any = "";
  public listName: String;
  public listId: any;
  public listSelcted: boolean;
  public listPrivate: boolean;

  //-ITEMS-//
  public itemInfo: any;
  public itemName: any;
  public itemId: any;
  public itemSave: any;

  //--SUB-ITEMS--//
  public subItemInfo: any;
  public subItemName: any;
  public subItemId: any
  public isdone: Boolean;
  public subItem: any;
  public response: any[];

  //--FRIENDS---//
  public friendsList: any[] = [];
  public friendsdisplay: any[] = [];
  public friendsId: any[] = [];
  public index: string;
  public friendsName: any;
  public myFriendsId: any;
  public Alluserdata: any;

  constructor(

    private router: Router,

    private appService: AppService,

    private toastr: ToastrService,

    public SocketService: SocketService,

    private cdRef: ChangeDetectorRef,

    private SpinnerService: NgxSpinnerService

  ) {
    //  this.cdRef.detectChanges();
    this.receiverId = Cookie.get('receiverId');

    this.receiverName = Cookie.get('receiverName');

  }

  ngOnInit() {

    this.SpinnerService.hide();

    this.authToken = Cookie.get('authtoken');

    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.checkStatus();
    this.getAllUsers();
    this.getAllList();
    this.getList_currentUser();
    this.newListAddedResponse();
    this.deleteListResponse();
    this.listEditResponse();
    this.ItemCreateResponse();
    this.delteItemRespoonse();
    this.ItemEditedResponse();
    this.CreateSubItemResponse();
    this.deleteSubItemResponse();
    this.subItemEditResponse();

    //sockets
    this.listenUpdate();

  }


  //----------------------------ROUTE TO OTHER PAGE---------------------//

  public todo = () => {
    this.SpinnerService.show();
    this.router.navigate(['my-todo-list'])

  }

  public friends = () => {
   this.SpinnerService.show();
    this.router.navigate(['friends'])

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
        this.SpinnerService.hide();

        this.toastr.error('some error occured')

      });
  }

  //----------------------------END OF ROUTE TO OTHER PAGE---------------------//

  //----------------------------VERIFY USER -----------------------------------//

  public checkStatus: any = () => {
    if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {
      this.SpinnerService.show();
      this.router.navigate(['login']);

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
  }

  //--------------------------------END OF VERIFY USER------------------------------------//

  public getOnlineUserList: any = () => {

    this.SocketService.onlineUserList()

      .subscribe((userList) => {

        this.userList = [];

        for (let x in userList) {

          let temp = { 'userId': x, 'name': userList[x], 'unread': 0, 'chatting': false };

          this.userList.push(temp);

        }
      });
  }

  //==============================TO DO APPLICATION ======================================//



  public getAllUsers = () => {

    this.appService.getAllUsers().subscribe(

      (data) => {

        let Alluserdata = data['data']

        this.friendsName = Alluserdata

        for (let user of Alluserdata) {

          if (this.receiverId == user.userId) {

            this.userInfo2 = user;


            for (let friends of user.friends) {


              if (this.friendsId.indexOf(friends.friendId) === -1) {

                this.friendsId.push(friends.friendId)

              }

            }
          }

        }
      }
    )


  }


  public getAllFriendsList = (id) => {

    this.appService.getlistofuser(id).subscribe(

      (data) => {

        if (data['data'] != null) {

          setTimeout(() => {

            this.friendsList = [...data['data']]

            for (let list of this.friendsList) {

              if (this.friendsdisplay.indexOf(list) === -1) {

                this.friendsdisplay.push(list);

              }


            }


          }, 2000)

        }

      }
    )




  }



  //-----------------------------------List---------------------------------------//  


  public getList_currentUser = () => {

    this.appService.getlistofuser(this.receiverId).subscribe(

      (data) => {
        if (data['data'] != null) {

          let Lists = data['data'];

          this.listInfo = Lists;

        }

      }
    )

  }

  public getAllList = () => {

    this.appService.getAllList().subscribe(

      (data) => {

        if (data['data'] != null) {

          this.Alluserdata = data['data']

          for (let list of this.Alluserdata) {

            for (let id of this.friendsId) {

              if (id === list.userId) {

                if (list.private == false) {

                  //console.log(list)
                  //this.listInfo =list
                }

              }
            }
          }

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


  //-----------create-list-----------//

  public createList = () => {

    if (!this.listName) {

      this.toastr.warning("List Name is required");

    } else {

      let Listdata = {

        listName: this.listName,

        userId: this.receiverId,

        creator: this.receiverName,

        private: false

      }



      this.appService.createList(Listdata).subscribe(

        (data) => {

          this.toastr.success("Lst Created sucessfully");
          
          this.getAllList();

          this.getList_currentUser();

          this.SocketService.createList(this.receiverName);

        },
        (error) => {

          this.toastr.error("Failed to save the list");

        }
      )
    }


  }


  public newListAddedResponse = () => {

    this.SocketService.createList_response().subscribe((response) => {

      this.getAllList();

      this.getList_currentUser();

      this.toastr.success(response);

    })
  }

  //----------End of create-list-----------//


  //-------------------Delete List---------------------//

  public deleteList = () => {

    this.appService.deleteList(this.listId).subscribe(

      (data) => {

        this.listSelcted = false;

        this.getAllList();

        this.getList_currentUser();

        this.SocketService.deleteList(this.receiverName);

        this.toastr.success("List delted successfully");

      }, (error) => {

        this.toastr.error("Failed to Delte the list")

      }
    )
  }

  public deleteListResponse = () => {

    this.SocketService.deleteList_response().subscribe((response) => {

      this.getAllList();

      this.getList_currentUser();

      this.toastr.info(response);

    })
  }


  //-------------------End Of Delete List---------------------//

  //------------------------Edit-list------------------------//


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

          this.getList_currentUser();

          this.SocketService.updateList(this.receiverName);

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

  public listEditResponse = () => {

    this.SocketService.updateList_response().subscribe(

      (response) => {

        this.getAllList();

        this.getList_currentUser();

        this.toastr.info(response);

      }
    )
  }


  //------------------------Endo Of Edit-list------------------------//

  //--------------------------------End Of List---------------------------------------//  


  //--------------------------------------ITEMS----------------------------------------//  

  //---------GET Items-------//

  public getAllItems = (listId) => {

    this.appService.getItemOfList(listId).subscribe(

      (data) => {

        this.itemInfo = data['data'];

        if (data['data'] != null) {

          let Items = data['data'];

          this.itemInfo = Items;

        }


      }
    )
  }

  public getItemInfo = (item) => {

    //console.log(item)

    this.itemSave = item;

    this.itemName = item.itemName;

    this.itemId = item.itemId;


    this.toastr.show(this.itemName + " selected");

    this.cdRef.detectChanges();

    this.getAllSubItems(this.itemId)

  }

  //---------End Of GET Items-------//


  //----------Create-Items-----------//

  public createItem = () => {

    if (!this.itemName) {

      this.toastr.warning("Item Name  is required");

    } else {

      let data = {

        listId: this.listId,

        itemName: this.itemName,

        duePeriod:  0

      }

      console.log(data)

      this.appService.createItem(data).subscribe(

        (data) => {

          console.log(data)

          this.getAllItems(this.listId);

          this.SocketService.createItem(this.receiverName);

          this.toastr.success("Item Name: " + this.itemName, " Created Successfully");

        },
        (error) => {

          this.toastr.error("Failed to create the Item");

        }
      )
    }


  }

  public ItemCreateResponse = () => {

    this.SocketService.createItem_response().subscribe((response) => {

      this.toastr.success(response);

    })
  }
  //------End of Create-Items-----------//

  //------------Delete-Items-----------//

  public deleteItem = (item) => {

    this.itemSave = item;

    this.appService.deleteItem(item.itemId).subscribe(

      (data) => {

        this.getAllItems(this.listId);

        this.createUndoItem_delete();

        this.SocketService.deleteItem(this.receiverName);

        this.toastr.success("Item delted successfully");

      }, (error) => {

        this.toastr.error("Failed to Delte the Item");

      }
    )
  }

  public delteItemRespoonse = () => {

    this.SocketService.deleteItem_response().subscribe((response) => {

      this.toastr.warning(response);

    })
  }

  //----------Endo of delete-Items-----------//

  //---------------Edit Item--------------//
  

  public editItem = () => {

    if (!this.itemName) {

      this.toastr.warning("Item Name is required");

    } else {

      let data = {

        itemName: this.itemName,

        itemId: this.itemId,

        

        // isDone:true
      }

      this.appService.editItem(data).subscribe(

        (data) => {

          this.getAllItems(this.itemId);

          this.SocketService.editeItem(this.receiverName)

          setTimeout(() => {

            this.toastr.success("Item Name: " + this.itemName, "Edited successfully");

          }, 1000)


          this.createUndoItem_update();

        }, (error) => {

          this.toastr.error("Failed to Edit the Item")

        }
      )
    }
  }


  public ItemEditedResponse = () => {

    this.SocketService.editeItem_response().subscribe((response) => {

      this.toastr.info(response)

    })
  }

  //----------Endo of Edit-Items-----------//

  //--------------------------------END OF ITEMS---------------------------------//


  //--------------------------------SUB_ITEMS-------------------------------------//


  //---------------Get All SubItem--------------//

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

  //---------------Create SubItem--------------//

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

          this.SocketService.createSubItem(this.receiverName);

          this.toastr.success("SubItem Name: " + this.subItemName, "subItem created successfully");

        },
        (error) => {

          this.toastr.error("Failed to create the subItem");

        }
      )
    }
  }

  public CreateSubItemResponse = () => {

    this.SocketService.createSubItem_response().subscribe((response) => {

      this.toastr.success(response);

    })
  }

  //---------------End Of Create SubItem--------------//

  //--------------------Delete SubItem----------------//

  public deleteSubItem = (subItem) => {

    this.subItem = subItem

    this.appService.deleteSubItem(subItem.subItemId).subscribe(

      (data) => {

        this.getAllSubItems(this.itemId);

        this.SocketService.deleteSubItem(this.receiverName)

        this.createUndoSubItem_delete();

        this.toastr.success("subItem delted successfully");

      }, (error) => {

        this.toastr.error("Failed to Delte the subItem")

      }
    )
  }


  public deleteSubItemResponse = () => {

    this.SocketService.deleteSubItem_response().subscribe((response) => {

      this.toastr.warning(response);

    })
  }

  //--------------------END of Delete SubItem----------------//


  sendSubItemId = (subItem) => {
    this.subItemId = subItem.subItemId;
    this.subItem = subItem
    // console.log(this.subItem)
  }

  //----------------MARKING THE SUB ITEM------------------------//

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

  //-----------END OF MARKING THE SUB ITEM------------------------//

  //-----------------EDIT SUB ITEM ------------------------------//

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

          this.toastr.success("SubItemName: " + this.subItemName, "SubItem Edited successfully");

        }, 1000)

        this.SocketService.editSubItem(this.receiverName);

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



  public subItemEditResponse = () => {

    this.SocketService.editSubItem_response().subscribe((response) => {

      this.toastr.info(response);

    })
  }

  //----------------END OF EDIT SUB ITEM ------------------------------//

  //-----------------------------------END OF SUB ITEMS------------------------------------------------//

  //------------------------------------------UNDO-----------------------------------------------------//


  //----------------Undo Items----------------------//

  public createUndoItem_delete = () => {

    this.appService.createUndoItem(this.itemSave).subscribe(

      (data) => {

      //  console.log("deleted item saved in undoitem");

      }, (error) => {

        //.log(" deleted item failed to save  in undo Item");
        this.toastr.error(error.message)

      }
    )
  }


  public createUndoItem_update = () => {

    this.appService.createUndoItem_update(this.itemSave).subscribe(

      (data) => {

        //console.log("Edited item saved in undoitem");


      }, (error) => {

        //console.log(" Edited item failed to save in undo Item");
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

                this.toastr.error("Failed to Edit the Item");

              }
            )


          }
        } else if (data['status'] == 404) {

          this.toastr.warning("Undo Not available")

        }

      }, (error) => {

       // console.log(error);
       this.toastr.error(error.message)

      }
    )


  }


  public deleteSingleItem_undo = (data) => {

    this.appService.deleteUndoItem(data).subscribe(

      (data) => {

        //console.log(data);

      }, (error) => {

        //console.log(error)
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

        //console.log(" deleted subitem failed to save  in undo Item");
        this.toastr.error(error.message)


      }
    )
  }


  public createUndoSubItem_update = () => {

    this.appService.createUndoSubItem_update(this.subItem).subscribe(

      (data) => {

       // console.log(data);

      }, (error) => {

       // console.log(error);
       this.toastr.error(error.message)

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

        //console.log(error);
        this.toastr.error(error.message)

      }
    )


  }


  public deleteSingleSubItem_undo = (data) => {

    this.appService.deleteUndoSubItem(data).subscribe(

      (data) => {

       // console.log(data);

      }, (error) => {

       // console.log(error)
       this.toastr.error(error.message)

      }
    )
  }


//-----------------------------------END OF UNDO'S---------------------------------//

//-----key press------//

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
      
    }else{
      this.toastr.warning("Select either List/Item","To get previous item")
    }
   
  }
  
}


//--------------------socket messages---------------//


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
