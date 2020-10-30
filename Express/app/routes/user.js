const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;


    app.get(`${baseUrl}/view/all`, auth.isAuthorized, userController.getAllUser);
    /**
      * @apiGroup users
      * @apiVersion  1.0.0
      * @api {post} /api/v1/users/view/all api for getting All Users.
      *
      * @apiSuccess {object} myResponse shows error status, message, http status code, data.
      * 
      * @apiSuccessExample {object} Success-Response:
         {
             "error": false,
             "message": "Login Successful",
             "status": 200,
             "data": {
                 "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IlhuNnJOQ0xORyIsImlhdCI6MTU4OTU0MjUwNjE3MywiZXhwIjoxNTg5NjI4OTA2LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7ImZyaWVuZHMiOlt7ImZyaWVuZElkIjoiOFU2MnBQYXVZIiwiZnJpZW5kTmFtZSI6Ik5ldyBVc2VyIHVzZXIgU3VybmFtZSJ9XSwicmVxdWVzdHMiOltdLCJ1c2VyVmVyaWZpY2F0aW9uU3RhdHVzIjp0cnVlLCJtb2JpbGVOdW1iZXIiOiIwIiwiZW1haWwiOiJha3NhamphbjI4MkBnbWFpbC5jb20iLCJsYXN0TmFtZSI6IlNhamphbiIsImZpcnN0TmFtZSI6IkFraGVlbCIsInVzZXJJZCI6ImNxdTlaeTV1aSJ9fQ.qPkxyq7QjBWKZTwT2QmB8aJEVxW_j9yuXmIWcJBiToM",
                 "userDetails": {
                     "friends": [
                         {
                             "friendId": "8U62pPauY",
                             "friendName": "New User user Surname"
                         }
                     ],
                     "requests": [],
                     "userVerificationStatus": true,
                     "mobileNumber": "AU 618296731080",
                     "email": "aksajjan282@gmail.com",
                     "lastName": "Sajjan",
                     "firstName": "Akheel",
                     "userId": "cqu9Zy5ui"
                 }
             }
         }
     */


    app.get(`${baseUrl}/:userId/details`, auth.isAuthorized, userController.getSingleUser);
    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/userId/details api for  User Details.
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, data.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "User Details Found",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IlhuNnJOQ0xORyIsImlhdCI6MTU4OTU0MjUwNjE3MywiZXhwIjoxNTg5NjI4OTA2LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7ImZyaWVuZHMiOlt7ImZyaWVuZElkIjoiOFU2MnBQYXVZIiwiZnJpZW5kTmFtZSI6Ik5ldyBVc2VyIHVzZXIgU3VybmFtZSJ9XSwicmVxdWVzdHMiOltdLCJ1c2VyVmVyaWZpY2F0aW9uU3RhdHVzIjp0cnVlLCJtb2JpbGVOdW1iZXIiOiIwIiwiZW1haWwiOiJha3NhamphbjI4MkBnbWFpbC5jb20iLCJsYXN0TmFtZSI6IlNhamphbiIsImZpcnN0TmFtZSI6IkFraGVlbCIsInVzZXJJZCI6ImNxdTlaeTV1aSJ9fQ.qPkxyq7QjBWKZTwT2QmB8aJEVxW_j9yuXmIWcJBiToM",
                "userDetails": {
                    "friends": [
                        {
                            "friendId": "8U62pPauY",
                            "friendName": "New User user Surname"
                        }
                    ],
                    "requests": [],
                    "userVerificationStatus": true,
                    "mobileNumber": "AU 618296731080",
                    "email": "aksajjan282@gmail.com",
                    "lastName": "Sajjan",
                    "firstName": "Akheel",
                    "userId": "cqu9Zy5ui"
                }
            }
        }
    */



    //app.get(`${baseUrl}/:userId/userVerification`, userController.userVerification);




    app.post(`${baseUrl}/signup`, userController.signUpFunction);
    /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup To Signup user.
     *
     * @apiParam {string}  FirstName FirstName of the user. (body params)
     * @apiParam {string}  Lastname Lastname of the user. (body params)
     * @apiParam {string}  Password Password of MyToDo account. (body params)
     * @apiParam {string}  EmailID EmailID of the user. (body params)
     * @apiParam {number}  Mobile-number Mobile-number of the user. (body params)
     * @apiParam {boolean} userVerificationStatus  userVerificationStatus For email verification of the user.(Default : false) 
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, data.
     * 
     * @apiSuccessExample {object} Success-Response:

                    {
                        "error": false,
                        "message": "User created",
                        "status": 200,
                        "data": {
                            "userId": "String",
                            "firstName": "String",
                            "lastName": "String",
                            "password": "String"
                            "email": "String",
                            "mobileNumber": "String",
                            "userVerificationStatus": false,
                            "friends": [],
                            "createdOn": "Date",                                    
                            "_id": "5b8cqu9Zy5ui08c6660",
                            "__v": 0
                        }
                    }


        * @apiErrorExample {json} Error-Response:
        *
            {
                "error": true,
                "message": "Failed to create new User",
                "status": 500,
                "data": null
            }

        * @apiErrorExample {json} Error-Response:
        *
            {
                "error": true,
                "message": "User Already Present With this Email",
                "status": 403,
                "data": null
            }

    */

    app.post(`${baseUrl}/login`, userController.loginFunction);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api for  Sign-In.
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, data.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "Login Successful",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IlhuNnJOQ0xORyIsImlhdCI6MTU4OTU0MjUwNjE3MywiZXhwIjoxNTg5NjI4OTA2LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7ImZyaWVuZHMiOlt7ImZyaWVuZElkIjoiOFU2MnBQYXVZIiwiZnJpZW5kTmFtZSI6Ik5ldyBVc2VyIHVzZXIgU3VybmFtZSJ9XSwicmVxdWVzdHMiOltdLCJ1c2VyVmVyaWZpY2F0aW9uU3RhdHVzIjp0cnVlLCJtb2JpbGVOdW1iZXIiOiIwIiwiZW1haWwiOiJha3NhamphbjI4MkBnbWFpbC5jb20iLCJsYXN0TmFtZSI6IlNhamphbiIsImZpcnN0TmFtZSI6IkFraGVlbCIsInVzZXJJZCI6ImNxdTlaeTV1aSJ9fQ.qPkxyq7QjBWKZTwT2QmB8aJEVxW_j9yuXmIWcJBiToM",
                "userDetails": {
                    "friends": [
                        {
                            "friendId": "8U62pPauY",
                            "friendName": "New User user Surname"
                        }
                    ],
                    "requests": [],
                    "userVerificationStatus": true,
                    "mobileNumber": "AU 618296731080",
                    "email": "aksajjan282@gmail.com",
                    "lastName": "Sajjan",
                    "firstName": "Akheel",
                    "userId": "cqu9Zy5ui"
                }
            }
        }
      * @apiErrorExample {json} Error-Response:
      *
      *       
        {
            "error": true,
            "message": "Failed To Find User Details",
            "status": 500,
            "data": null
        }
      * @apiErrorExample {json} Error-Response:
      *
      *       
        {
            "error": true,
            "message": "No User Details Found",
            "status": 404,
            "data": null
        }

    */

    // app.put(`${baseUrl}/:userId/edit`, auth.isAuthorized, userController.editUser);

    //  app.post(`${baseUrl}/:userId/delete`, auth.isAuthorized, userController.deleteUser);



    app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logout);
    /**
       * @apiGroup Users
       * @apiVersion  1.0.0
       * @api {post} /api/v1/users/logout Logout.
       *
       *
       * @apiSuccess {object} myResponse shows error status, message, http status code, data.
       * 
       * @apiSuccessExample {object} Success-Response:

          {
              "error": false,
              "message": "Logged Out Successfully",
              "status": 200,
              "data": null
          }                 

  */


    app.post(`${baseUrl}/forgotPassword`, userController.forgotPassword);
    /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/forgotPassword Forgot Password.
     *
     * @apiParam {string} UserId UserId of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, data.
     * 
     * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "User Details Found",
            "status": 200,
            "data": "Password updatePassword successfully"
        }
        
    * @apiErrorExample {json} Error-Response:
    *
    *       
        {
            "error": true,
            "message": "Failed To Find User Details",
            "status": 500,
            "data": null
        }

    * @apiErrorExample {json} Error-Response:
    *
    *       
        {
            "error": true,
            "message": "No User Details Found",
            "status": 404,
            "data": null
        }                    
    * @apiErrorExample {json} Error-Response:
    *
    *       
        {
            "error": true,
            "message": "UserId" parameter is missing",
            "status": 400,
            "data": null
        }
*/

    app.post(`${baseUrl}/resetPassword`, userController.resetPassword);

    /**
       * @apiGroup Users
       * @apiVersion  1.0.0
       * @api {post} /api/v1/users/resetPassword Reset Password .
       *
       * @apiParam {string} Email ID  Email ID of the user. (body params) (required)
       *
       * @apiSuccess {object} myResponse shows error status, message, http status code, data.
       * 
       * @apiSuccessExample {object} Success-Response:
          {
              "error": false,
              "message": "Mail sent Successfully",
              "status": 200,
              "data": "Password reset successful"
          }
          
      * @apiErrorExample {json} Error-Response:
      *
      *       
          {
              "error": true,
              "message": "Failed To Find User Details",
              "status": 500,
              "data": null
          }

      * @apiErrorExample {json} Error-Response:
      *
      *       
          {
              "error": true,
              "message": "No User Details Found",
              "status": 404,
              "data": null
          }
      * @apiErrorExample {json} Error-Response:
      *
      *       
          {
              "error": true,
              "message": "UserId" parameter is missing",
              "status": 400,
              "data": null
          }
  */

}
