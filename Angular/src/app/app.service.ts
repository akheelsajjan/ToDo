import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Injectable({
  providedIn: 'root'
})
export class AppService {


 //private url = 'http://api.mytodolist.techblogs.live/api/v1/users/';

   private url = 'http://localhost:3000/api/v1/users/';



  constructor(public http: HttpClient ) {
  }

  //-------------------SIGN-(IN-UP-OUT)-------------------//

  public getUserInfoFromLocalStorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  }// getUserInfoFromLocalStorage end here

  public setUserInfoInLocalStorage = (data) => {

    localStorage.setItem('userInfo', JSON.stringify(data));

  }// setUserInfoFromLocalStorage end here

  public signupFunction(data): Observable<any> {

    const params = new HttpParams()

      .set('firstName', data.firstName)

      .set('lastName', data.lastName)

      .set('mobile', data.mobile)

      .set('email', data.email)

      .set('password', data.password);

    return this.http.post(this.url + 'signup', params);


  }// signupFunction end 


  public signinFunction(data): Observable<any> {

    const params = new HttpParams()

      .set('email', data.email)

      .set('password', data.password);

    return this.http.post(this.url + 'login', params);

  }// signinFunction end 

  public logout(): Observable<any> {

    const params = new HttpParams()

      .set('authToken', Cookie.get('authtoken'))


    return this.http.post(this.url + 'logout', params);

  } // end logout function

  public verifyEmail = (userId): Observable<any> => {

    return this.http.get(this.url + userId +'/userVerification');

  }

  public forgotPassword = (email) => {

    const params = new HttpParams()

      .set('email', email)

     // .set('authToken', Cookie.get('authtoken'));

    return this.http.post(this.url + 'forgotPassword', params);

  }

  public updateUser = (data) => {

    const params = new HttpParams()

      .set('userId', data.userId)

      .set('password', data.password);

      return this.http.post(this.url + 'resetPassword', params);

  }

  public getAllUsers = () => {

    return this.http.get(this.url + 'view/all' + `?authToken=${Cookie.get('authtoken')}`)

  }


  public getUserDetails = (userId) => {

    return this.http.get(this.url + userId + '/details' + `?authToken=${Cookie.get('authtoken')}`);

  } 
  

  public getCountry = () =>{
    return this.http.get('../assets/country.json')
  }

  
  public getCountryCode = () =>{
    return this.http.get('../assets/countrycode.json')
  }


  

  //-------------------END OF SIGN-(IN-UP-OUT)----------------------------------//

  //----------------------------------TO-DO-SERVICE---------------------------------------------//


  //----------------list-service------------------------------------------------//

  //private url_list = 'http://api.mytodolist.techblogs.live/api/v1/lists/';

 private url_list = 'http://localhost:3000/api/v1/lists/';

  public createList = (data) => {

    const params = new HttpParams()

      .set("listName", data.listName)

      .set("userId", data.userId)

      .set("creator", data.creator)

      .set("private", data.private)

      .set("authToken", Cookie.get('authtoken'))

    return this.http.post(this.url_list + 'createList', params);

  }

  public getlistofuser = (userId) => {

    return this.http.get(this.url_list + userId + '/getlistofuser' + `?authToken=${Cookie.get('authtoken')}`);

  }

  public getAllList = () => {

    return this.http.get(this.url_list + 'all' + `?authToken=${Cookie.get('authtoken')}`)

  }

  public deleteList = (listId) => {

    return this.http.post(this.url_list + listId + '/delete' + `?authToken=${Cookie.get('authtoken')}`, listId);

  }


  public editList = (data) => {

    const params = new HttpParams()

      .set("listName", data.listName)

    return this.http.put(this.url_list + data.listId + '/edit' + `?authToken=${Cookie.get('authtoken')}`, params);

  }



  //----------------------Item-service-----------------------------------//

  //private url_Item = 'http://api.mytodolist.techblogs.live/api/v1/item/';

  private url_Item = 'http://localhost:3000/api/v1/item/';

  public createItem = (data) => {

    const params = new HttpParams()

      .set("listId", data.listId)

      .set("itemName", data.itemName) 

      .set("duePeriod", data.duePeriod)

      .set("authToken", Cookie.get('authtoken'))

    return this.http.post(this.url_Item + 'createItem', params);

  }

  public getItemOfList = (listId) => {

    return this.http.get(this.url_Item + listId + '/getItemsoflist' + `?authToken=${Cookie.get('authtoken')}`);

  }

  public deleteItem = (itemId) => {

    return this.http.post(this.url_Item + itemId + '/delete' + `?authToken=${Cookie.get('authtoken')}`, itemId);

  }

  public editItem = (data) => {

    const params = new HttpParams()

      .set("itemName", data.itemName)

      .set("isDone", data.isDone)
      

    return this.http.put(this.url_Item + data.itemId + '/edit' + `?authToken=${Cookie.get('authtoken')}`, params);

  }


  //----------------------Sub-Item-service-----------------------------------//


//  private url_Sub_Item = 'http://api.mytodolist.techblogs.live/api/v1/subItem/';

   private url_Sub_Item = 'http://localhost:3000/api/v1/subItem/';

  public createSubItem = (data) => {

    const params = new HttpParams()

      .set("itemId", data.itemId)

      .set("subItemName", data.subItemName)

      .set("authToken", Cookie.get('authtoken'))

    return this.http.post(this.url_Sub_Item + 'create', params);

  }

  public getSubItem = (itemId) => {

    return this.http.get(this.url_Sub_Item + itemId + '/getSubItemOfItem' + `?authToken=${Cookie.get('authtoken')}`);

  }

  public deleteSubItem = (subItemId) => {

    return this.http.post(this.url_Sub_Item + subItemId + '/delete' + `?authToken=${Cookie.get('authtoken')}`, subItemId);

  }

  public editSubItem = (data) => {

    const params = new HttpParams()

      .set("subItemName", data.subItemName)

      .set("isDone", data.isDone)

      .set("authToken", Cookie.get('authtoken'))

    return this.http.put(this.url_Sub_Item + data.subItemId + '/edit', params);
  }



  //----------------------Undo-Item-service-----------------------------------//

// private url_Undo_Item = 'http://api.mytodolist.techblogs.live/api/v1/Undoitem/';

   private url_Undo_Item = 'http://localhost:3000/api/v1/Undoitem/';

  public createUndoItem = (data) => {

    const params = new HttpParams()

      .set("itemId", data.itemId)

      .set("listId", data.listId)

      .set("itemName", data.itemName)

      .set("isDone", data.isDone)

      .set("action", "delete")

      .set("authToken", Cookie.get('authtoken'))

    return this.http.post(this.url_Undo_Item + 'createUndoItem', params);

  }

  public createUndoItem_update = (data) => {

    const params = new HttpParams()

      .set("itemId", data.itemId)

      .set("listId", data.listId)

      .set("itemName", data.itemName)

      .set("isDone", data.isDone)

      .set("action", "update")

      .set("authToken", Cookie.get('authtoken'))

    return this.http.post(this.url_Undo_Item + 'createUndoItem', params);

  }

  public getPreviousItem = (listId) => {

    return this.http.get(this.url_Undo_Item + listId + '/getPreviousItem' + `?authToken=${Cookie.get('authtoken')}`);

  }


  public deleteUndoItem = (data) => {

    const params = new HttpParams()

      .set("itemName", data.itemName)

      .set("authToken", Cookie.get('authtoken'))

    return this.http.post(this.url_Undo_Item + data.itemId + '/delete', params);

  }

  public deleteAllUndoItems = () => {

    const params = new HttpParams()

      .set("authToken", Cookie.get('authtoken'))

    return this.http.post(this.url_Undo_Item + 'deleteAllUndoItems', params);

  }




  //----------------------Undo-SuItem-service-----------------------------------//

 // private url_Undo_SubItem = 'http://api.mytodolist.techblogs.live/api/v1/subUndoItem/';

private url_Undo_SubItem = 'http://localhost:3000/api/v1/subUndoItem/';

  public createUndoSubItem = (data) => {

    const params = new HttpParams()

      .set("itemId", data.itemId)

      .set("subItemId", data.subItemId)

      .set("subItemName", data.subItemName)

      .set("isDone", data.isDone)

      .set("action", "delete")

      .set("authToken", Cookie.get('authtoken'))

    return this.http.post(this.url_Undo_SubItem + 'createSubUndoItem', params);
  }

  public createUndoSubItem_update = (data) => {

    const params = new HttpParams()

      .set("itemId", data.itemId)

      .set("subItemId", data.subItemId)

      .set("subItemName", data.subItemName)

      .set("isDone", data.isDone)

      .set("action", "update")

      .set("authToken", Cookie.get('authtoken'))

    return this.http.post(this.url_Undo_SubItem + 'createSubUndoItem', params);

  }

  public getPreviousSubItem = (itemId) => {

    return this.http.get(this.url_Undo_SubItem + itemId + '/getPreviousSubUndoItem' + `?authToken=${Cookie.get('authtoken')}`);

  }

  public deleteUndoSubItem = (data) => {

    const params = new HttpParams()

      .set("subItemName", data.subItemName)

      .set("authToken", Cookie.get('authtoken'))

    return this.http.post(this.url_Undo_SubItem + data.subItemId + '/delete', params);

  }

  public deleteAllUndoSubItems = () => {

    const params = new HttpParams()

      .set("authToken", Cookie.get('authtoken'))

    return this.http.post(this.url_Undo_SubItem + 'deleteAllSubUndoItems', params);

  }





}
