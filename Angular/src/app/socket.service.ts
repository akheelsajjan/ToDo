import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class SocketService {


 // private url = 'http://api.mytodolist.techblogs.live';

 private url = 'http://localhost:3000';

  private socket;

  constructor(public http: HttpClient) {

    this.socket = io(this.url)

  }

  //----------------Authentication Section--------------------------//

  public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on("verify-user", (socketData) => {

        observer.next(socketData)

      })
    })
  }


  public setUser = (token) => {


    this.socket.emit("set-user", token)

  }


  //----------------End Of Authentication Section--------------------------//


  public onlineUserList = () => {

    return Observable.create((observer) => {

      this.socket.on("onlineUsersTodoList", (userList) => {

        observer.next(userList);

      });

    });

  }


  //---------Not--required----//
  public getOnlineUsers = () => {

    return Observable.create((observer) => {

      this.socket.on("onlineUsers", (socketData) => {

        observer.next(socketData)

      })
    })
  }
  //---------Not--required----//



  //---------------------------LIST----------------------------------------------//

  public createList = (userName) => {

    this.socket.emit("createList", userName)

  }

  public createList_response = () => {

    return Observable.create((observer) => {

      this.socket.on("createList-response", (data) => {

        observer.next(data);

      })

    })
  }



  public deleteList = (userName) => {

    this.socket.emit("deleteList", userName)

  }

  public deleteList_response = () => {

    return Observable.create((observer) => {

      this.socket.on("deleteList-response", (data) => {

        observer.next(data);
      })
    })
  }




  public updateList = (userName) => {

    this.socket.emit("updateList", userName)

  }



  public updateList_response = () => {

    return Observable.create((observer) => {

      this.socket.on("updateList-response", (data) => {

        observer.next(data);

      })
    })
  }

  //------------------------------ITEMS---------------------------------//



  public createItem = (userName) => {

    this.socket.emit("createItem", userName)

  }

  public createItem_response = () => {

    return Observable.create((observer) => {

      this.socket.on("createItem-response", (data) => {

        observer.next(data);

      })
    })
  }



  public deleteItem = (userName) => {

    this.socket.emit("deleteItem", userName)

  }

  public deleteItem_response = () => {

    return Observable.create((observer) => {

      this.socket.on("deleteItem-response", (data) => {

        observer.next(data);

      })
    })
  }



  public editeItem = (userName) => {

    this.socket.emit("updateItem", userName)

  }

  public editeItem_response = () => {

    return Observable.create((observer) => {

      this.socket.on("updateItem-response", (data) => {

        observer.next(data);

      })
    })
  }




  public markDoneItem = (userName) => {

    this.socket.emit("markDoneItem", userName)

  }

  public markDoneItem_response = () => {

    return Observable.create((observer) => {

      this.socket.on("markDoneItem-response", (data) => {

        observer.next(data);

      })
    })
  }


  public markUndoneItem = (userName) => {

    this.socket.emit("markOpenItem", userName)

  }



  public markUndoneItem_response = () => {

    return Observable.create((observer) => {

      this.socket.on("markOpenItem-response", (data) => {

        observer.next(data);

      })
    })
  }






  public undoItemMulti = (userName) => {
    this.socket.emit("undoItem", userName)
  }

  public itemUndoResponse = () => {
    return Observable.create((observer) => {
      this.socket.on("undoItem-response", (data) => {
        observer.next(data);
      })
    })
  }


  //---------------------------------SUBITEM------------------------------------------//




  public createSubItem = (userName) => {

    this.socket.emit("createSubItem", (userName))

  }

  public createSubItem_response = () => {

    return Observable.create((observer) => {

      this.socket.on("createSubItem-response", (data) => {

        observer.next(data);

      })
    })
  }



  public deleteSubItem = (userName) => {

    this.socket.emit("deleteSubItem", (userName))

  }

  public deleteSubItem_response = () => {

    return Observable.create((observer) => {

      this.socket.on("deleteSubItem-response", (data) => {

        observer.next(data);

      })
    })
  }



  public editSubItem = (userName) => {

    this.socket.emit("updateSubItem", (userName))

  }

  public editSubItem_response = () => {

    return Observable.create((observer) => {

      this.socket.on("updateSubItem-response", (data) => {

        observer.next(data);

      })
    })
  }




  public markDoneSubItemMulti = (userName) => {
    this.socket.emit("markDoneSubItem", userName)
  }

  public subItemMarkedDoneResponse = () => {
    return Observable.create((observer) => {
      this.socket.on("markDoneSubItem-response", (data) => {
        observer.next(data);
      })
    })
  }



  public markOpenSubItemMulti = (userName) => {
    this.socket.emit("markOpenSubItem", userName)
  }


  public subItemMarkedOpenResponse = () => {
    return Observable.create((observer) => {
      this.socket.on("markOpenSubItem-response", (data) => {
        observer.next(data);
      })
    })
  }




  public undoSubItemMulti = (userName) => {
    this.socket.emit("undoSubItem", userName)
  }

  public subItemUndoResponse = () => {
    return Observable.create((observer) => {
      this.socket.on("undoSubItem-response", (data) => {
        observer.next(data);
      })
    })
  }





  public clearUndos = (userName) => {
    this.socket.emit("clearUndos", userName)
  }

  public clearUndosResponse = () => {
    return Observable.create((observer) => {
      this.socket.on("clearUndos-response", (data) => {
        observer.next(data);
      })
    })
  }


  //----------------------------END of TodDo ----------------------------------------//


  public exitSocket = () => {

    this.socket.disconnect();

  }// end exit socket

//-------------------------FRIEND REQUEST--------------------------------------------//

  public sendRequest = (data) => {

    this.socket.emit("request", data);
  }

  public sendRequest_alreadySent = () => {

    return Observable.create((observer) => {

      this.socket.on("requestAlreadySent", (data) => {

        observer.next(data);

      })
    })
  }
  public sendRequest_alreadySent_response = () => {

    return Observable.create((observer) => {

      this.socket.on("alreadyFriend", (data) => {

        observer.next(data);
      })
    })
  }

  public saveRequest = () => {

    return Observable.create((observer) => {

      this.socket.on("saveRequest", (data) => {

        console.log("save req inside socket ")

        observer.next(data);

      })
    })
  }

  

  public rejectRequest = (data) => {

    this.socket.emit("reject", data);

  }

  public rejectRequest_response = () => {
    return Observable.create((observer) => {
      this.socket.on("rejecting", (data) => {
        observer.next(data);
      })
    })
  }



  public acceptRequest = (data) => {

    this.socket.emit("accept", data);

  }


  public acceptRequest_response = () => {

    return Observable.create((observer) => {

      this.socket.on("accepting", (data) => {

        observer.next(data)
      })
    })
  }



  public unfriend = (data) => {

    this.socket.emit("unfriend", data);

  }

  public unfriend_response = () => {

    return Observable.create((observer) => {

      this.socket.on("removed", (data) => {

        observer.next(data);
      })
    })
  }



  public listenUpdate = (userId) => {

    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      })
    })
  }


  //-------------------------DISCONNECT------------//


  public disconnect = () => {
    return Observable.create((observer) => {

      this.socket.on('disconnect', () => {

        observer.next();
        
      });//end On method
    });//end observable

  }//end disconnect


  public disconnectedSocket = () => {

    this.socket.emit("disconnect", "");//end Socket

  }//end disconnectedSocket



}
