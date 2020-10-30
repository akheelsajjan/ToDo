/**
 * modules dependencies.
 */
const socketio = require('socket.io');
const mongoose = require('mongoose');

const logger = require('./loggerLib.js');



const tokenLib = require("./tokenLib.js");

const UserModel = mongoose.model('User');

const redisLib = require("./redisLib.js");

//----------------------------SOCKET---------------------------------------------//


let setServer = (server) => {

    let io = socketio.listen(server);
    let myio = io.of('')
    let allOnlineUsers = [];

    myio.on('connection', function(socket){

        //------------VERIFY USER------------//

        socket.emit("verify-user", "Please Provide AuthToken For Verification")



         //------------SET USER------------//

        socket.on("set-user", (authToken)=>{

            tokenLib.verifyClaimWithoutSecret(authToken, (err, userdata)=>{

                if(err){

                    socket.emit('auth-error', "Please Provide Correct Details");

                }else{
                   
                    let currentUser = userdata.data;

                    socket.id=currentUser.userId;

                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`

                    let key = currentUser.userId;

                    let value = fullName;                 
                     
                    //---------------SET ONLINE USERS IN HASH-------------//
                    /*
                    let setUserOnline = redisLib.setANewOnlineUserInHash("onlineUsersDB2", key, value, (err, allOnlineUsers) => {

                        if (err) {

                            logger.error(err.message, "socketLib:SetANewOnlineUserInHash", 10);

                        }
                        else {

                            redisLib.getAllUsersInAHash('onlineUsersDB2', (err, result) => {
                                
                                if (err) {

                                    console.log(err);

                                }

                                else {

                                    
                                    socket.join("ROOM");

                                   
                                    socket.broadcast.emit('onlineUsersTodoList', result);
                                    
                                }
                            });

                        }
                    });

                    */
                    
                     //---------------END SET ONLINE USERS IN HASH-------------//

                   // socket.fullName = fullName;
                }
            })

        })

          //------------END OF SET USER------------//


        //--------------------DISCONNECT--------------------------//  

        socket.on("disconnect", ()=>{
           /*
            if (socket.id) {
                redisLib.deleteUserFromHash('onlineUsersDB2', socket.id);
                redisLib.getAllUsersInAHash('onlineUsersDB2', (err, result) => {
                    if (err) {
                        logger.error(err.message, "socketLib:getAllUsersInAHash", 10);
                    }
                    else {
                        socket.leave("ROOM");
                       
                        socket.broadcast.emit('onlineUsersTodoList', result);
                     

                    }
                });//end getAllUsersInAHash
            }

            */

        })

 //--------------------END OF DISCONNECT--------------------------//  



//=================================LIST==================================================//
      
        socket.on("createList", (Listdata) => {
           

            socket.broadcast.emit('createList-response', Listdata + " created A New List");

        })

        

        socket.on("deleteList",(userName)=>{
          
            socket.broadcast.emit('deleteList-response', userName + " deleted A List");
        })

      

        socket.on("updateList",(userName)=>{
           
            socket.broadcast.emit('updateList-response',userName + " updated A list")
        })

     //=================================ITEM==================================================//

        socket.on("createItem",(userName)=>{
         
            socket.broadcast.emit("createItem-response",userName + " added A Item")
        })


       

        socket.on("deleteItem",(userName)=>{
     
            socket.broadcast.emit("deleteItem-response",userName + " deleted A Item")
        })

       

        socket.on("updateItem",(userName)=>{
            socket.broadcast.emit("updateItem-response", userName + " updated A Item")
        })

       

        socket.on("markDoneItem",(userName)=>{
            socket.broadcast.emit("markDoneItem-response", userName+" Marked as Done A Item");
        })

      

        socket.on("markOpenItem",(userName)=>{
            socket.broadcast.emit("markOpenItem-response",userName+" Marked as Open A Item")
        })


        
        socket.on("undoItem",(userName)=>{
            socket.broadcast.emit("undoItem-response", userName + " Undo A Item")
        })
        

//=================================SUB ITEM==================================================//

       

        socket.on("createSubItem",(userName)=>{
            socket.broadcast.emit("createSubItem-response", userName+" added A Sub-Item")
        })

        
        socket.on("deleteSubItem",(userName)=>{
            socket.broadcast.emit("deleteSubItem-response", userName+" deleted A Sub-Item" )
        })

     
        socket.on("updateSubItem",(userName)=>{
            socket.broadcast.emit("updateSubItem-response", userName+" updated A Sub-Item")
        })

      
        socket.on("markDoneSubItem",(userName)=>{
            socket.broadcast.emit("markDoneSubItem-response",userName+" marked as done A Sub-Item")
        })

      
        socket.on("markOpenSubItem",(userName)=>{
            socket.broadcast.emit("markOpenSubItem-response",userName+" marked as done A Sub-Item")
        })
        

   
        socket.on("undoSubItem",(userName)=>{
            socket.broadcast.emit("undoSubItem-response", userName + " Undo A Sub-Item")
        })
        
        
   
        socket.on("clearUndos",(userName)=>{
            socket.broadcast.emit("clearUndos-response", userName + " cleared undos");
        })
        

//=================================FRIENDS==================================================//
       

         //------------REQUEST---------//

        socket.on('request', (data) => {

            UserModel.findOne({ "userId": data.receiverId }, (err, result) => {

                if (err) {

                    console.log(err);
                }

                else {

                    //-----CHECK IF THE SAME REQUEST EXIST----//

                    for (request of result.requests) {

                        if (request.senderId == data.senderId) {

                            return socket.emit("requestAlreadySent", "Request Sent Already");

                        }

                        else { }

                    }

                   //-----CHECK IF USER IS A FRIEND=======//

                    for (friend of result.friends) {

                        if (friend.friendId == data.senderId) {

                            return socket.emit("alreadyFriend", "User Already A Friend");

                        }
                    }

                 //-------SAVE REQUEST------------//

                    let userData = {

                        receiverId: data.receiverId,

                        senderId: data.senderId,

                        senderName: data.senderName,

                        action:"Request"

                    }

                    result.requests = result.requests.concat(userData)

                    socket.emit("saveRequest", "Request Sent");
                    
                  
                    socket.broadcast.emit(userData.receiverId, userData);

                    result.save((err, result) => {

                        if (err) {

                            console.log(err);

                        }

                        else {
                         
                        }
                    })
                }
            })
        })

        //------------REJECT---------//


        socket.on("reject", (data) => {
            
            UserModel.findOne({ "userId": data.receiverId }, (err, result) => {

                if (err) {

                    console.log(err)

                }

                else {

                    for (request of result.requests) {

                        if (request.senderId == data.senderId) {

                            let index = result.requests.indexOf(request);

                            result.requests.splice(index, 1)
                        }

                        else { }
                    }

                }
                result.save((err, result) => {

                    if (err) {

                        console.log(err)

                    }

                    else {
                        
                        socket.emit("rejecting", "Request Rejected");
                        
                        socket.broadcast.emit(data.senderId, data);
                    }
                })

            })


        })
        
        //------------ACCEPT---------//

        socket.on("accept", (data) => {
            
            
            UserModel.findOne({ "userId": data.receiverId }, (err, result) => {

                if (err) {

                    console.log(err)

                }
                else {

                    let usertdata = {
                        
                        friendName: data.senderName,

                        friendId: data.senderId

                    }

                    result.friends = result.friends.concat(usertdata);


                    for (request of result.requests) {

                        if (request.senderId == data.senderId) {

                            let index = result.requests.indexOf(request);

                            result.requests.splice(index, 1)

                        }

                        else { }
                    }
                    result.save((error, result) => {

                        if (error) {

                            console.log(error)

                        }
                        else {
                            
                        }
                    })

                }
            })

            UserModel.findOne({ "userId": data.senderId }, (err, result) => {

                if (err) {

                    console.log(err)

                }

                else {

                    let usertdata = {

                        friendId: data.receiverId,

                        friendName: data.receiverName,

                        action:'Accept'

                    }
               
                    result.friends = result.friends.concat([usertdata]);

                    result.save((error, result) => {

                        if (error) {

                            console.log(error)
                        }
                        else {
                         
                            socket.emit("accepting", "Request Accepted");
                           
                            socket.broadcast.emit(data.senderId, usertdata);
                        }
                    })
                }

            })
        })

        //------------UNFRIEND---------//

        socket.on("unfriend", (data) => {

            UserModel.findOne({ "userId": data.myId }, (err, result) => {

                if (err) {

                    console.log("Error Occured")

                    console.log(err)
                }
                else {

                    for (request of result.friends) {

                        if (request.friendId == data.friendId) {

                            let index = result.friends.indexOf(request);

                            result.friends.splice(index, 1)
                        }

                        result.save((err, result) => {

                            if (err) {

                                console.log(err)
                            }
                            else {
                               
                            }
                        })
                    }
                }
            })

            UserModel.findOne({ "userId": data.friendId }, (err, result) => {

                if (err) {

                    console.log("Error Occured")

                    console.log(err)

                }
                else {

                    for (friend of result.friends) {

                        if (friend.friendId == data.myId) {

                            let index = result.friends.indexOf(friend);

                            result.friends.splice(index, 1)

                        }

                    }
                    result.save((err, result) => {

                        if (err) {

                            console.log(err)
                        }
                        else {
                            console.log("Friend Removed")

                            socket.emit("removed", "Friend Removed");

                           
                            socket.broadcast.emit(data.friendId, data);

                        }
                    })
                }
            })
        })
        
    })

}

module.exports = {
    setServer : setServer
}