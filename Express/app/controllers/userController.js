const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const passwordLib = require('./../libs/generatePasswordLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')
const mailer = require('../libs/nodemailer');

//Models
const AuthModel = mongoose.model('Auth')
const UserModel = mongoose.model('User')


//-----------------------GET ALL USER DETAILS--------------------//
let getAllUser = (req, res) => {
    UserModel.find()
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log("--->" + err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: getAllUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}

//-----------------------END OF GET ALL USER DETAILS--------------------//


//-----------------------GET SINGEL USER DETAILS--------------------//

let getSingleUser = (req, res) => {
    UserModel.findOne({ 'userId': req.params.userId })
        .select('-password -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log("--->" + err)
                logger.error(err.message, 'User Controller: getSingleUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller:getSingleUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}

//-----------------------END OF  GET ALL USER DETAILS--------------------//

//-----------------------DELETE USER DETAILS--------------------//
let deleteUser = (req, res) => {

    UserModel.findOneAndRemove({ 'userId': req.params.userId }).exec((err, result) => {
        if (err) {
            console.log("---------------->" + err)
            logger.error(err.message, 'User Controller: deleteUser', 10)
            let apiResponse = response.generate(true, 'Failed To delete user', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: deleteUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Deleted the user successfully', 200, result)
            res.send(apiResponse)
        }
    });


}
//-----------------------END OF DELETE USER DETAILS--------------------//

//----------------------- EDIT USER DETAILS--------------------//
let editUser = (req, res) => {

    let options = req.body;
    UserModel.update({ 'userId': req.params.userId }, options).exec((err, result) => {
        if (err) {
            console.log("--->" + err)
            logger.error(err.message, 'User Controller:editUser', 10)
            let apiResponse = response.generate(true, 'Failed To edit user details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: editUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'User details edited', 200, result)
            res.send(apiResponse)
        }
    });


}
//-----------------------END OF EDIT USER DETAILS--------------------//

//-----------------------SIGN UP --------------------//

let signUpFunction = (req, res) => {

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, 'Email Does not met the requirement', 400, null)
                    reject(apiResponse)
                } else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, '"password" parameter is missing"', 400, null)
                    reject(apiResponse)
                } else {
                    resolve(req)
                }
            } else {
                logger.error('Field Missing During User Creation', 'userController: createUser()', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: req.body.email })
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'userController: createUser', 10)
                        let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {

                        let newUser = new UserModel({
                            userId: shortid.generate(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName || '',
                            email: req.body.email.toLowerCase(),
                            mobileNumber: req.body.mobile,
                            password: passwordLib.hashpassword(req.body.password),
                            createdOn: time.now(),
                            //userVerificationStatus: req.body.userVerificationStatus,
                        })
                        console.log(newUser)

                        newUser.save((err, newUser) => {
                            if (err) {
                                console.log("--->" + err)
                                logger.error(err.message, 'userController: createUser', 10)
                                let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
                                reject(apiResponse)
                            } else {
                                let UserObj = newUser.toObject();
                       
                                // mailer.autoEmail(UserObj.email, `<h1> Welcome ${newUser.firstName} ${newUser.lastName}!!, To MY-TO-DO-LIST APP</h1><br>
                                // <a href='http://techblogs.live/email-verify/${newUser.userId}'>Click here to verify your email address</a><br>`, "Email Address Verification");
                                console.log("User Created")
                                resolve(UserObj)
                            }
                        })
                    } else {
                        logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4)
                        let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }


    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generate(false, 'User created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("--->" + err)
            res.send(err);
        })

}

//-----------------------END OF SIGN UP --------------------//

//---------------------UserVerification--------------------//
let userVerification = (req, res) => {

    if (check.isEmpty(req.params.userId)) {
        logger.error("UserId parameter missing", "UserController: userVerification", 10);
        let apiResponse = response.generate(true, "userId is missing", 500, null);
        res.send(apiResponse);
    } else {
        UserModel.update({ userId: req.params.userId }, { userVerificationStatus: true }, { multi: true }, (err, result) => {

            if (err) {
                logger.error("Failed to verify User ", "userController: userVerification", 10);
                let apiResponse = response.generate(true, "Failed to verify user", 500, null);
                res.send(apiResponse);
            }
            else if (check.isEmpty(result)) {
                logger.error("User Not found", "userController: userVerification", 10);
                let apiResponse = response.generate(true, "User not found", 500, null);
                res.send(apiResponse);
            }
            else {
                logger.info("User Verified", "userController: userVerification", 10);
                let apiResponse = response.generate(false, "user found & verified", 200, "User Verified Successfully");
                res.send(apiResponse);
            }
        });
    }
}

//---------------------END OF UserVerification--------------------//


//-----------------------LOGIN  --------------------//
let loginFunction = (req, res) => {

    let findUser = () => {

        return new Promise((resolve, reject) => {
            if (req.body.email) {
                UserModel.findOne({ email: req.body.email }, (err, userDetails) => {
                    if (err) {
                        console.log("--->" + err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(userDetails)) {
                        logger.error('No User Found', 'userController: findUser()', 5)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {

                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });

            } else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let isVerified = (userDetails) => {
        return new Promise((resolve, reject) => {
            if (userDetails.userVerificationStatus == false) {
                logger.error("User not Verified", "userController: isVerified()", 10);
                let apiResponse = response.generate(true, "User not Verified", 500, null);
                reject(apiResponse);
            }
            else {
                logger.info("User Verified", "userController: isVerified()", 10);
                resolve(userDetails);
            }
        });
    }



    let validatePassword = (retrievedUserDetails) => {

        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    console.log("--->" + err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }

    let generateToken = (userDetails) => {

        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log("--->" + err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }
    let saveToken = (tokenDetails) => {

        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    logger.error(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            console.log("--->" + err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log("--->" + err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }

    findUser(req, res)
        //.then(isVerified)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {

            console.log("--->" + err)
            res.status(err.status)
            res.send(err)
        })
}

//-----------------------END OF LOGIN --------------------//




//-----------------------LOGOUT --------------------//

let logout = (req, res) => {
    AuthModel.findOneAndRemove({ userId: req.user.userId }, (err, result) => {
        if (err) {
            console.log("--->" + err)
            logger.error(err.message, 'user Controller: logout', 10)
            let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
            res.send(apiResponse)
        }
    })
}
//-----------------------END OF LOGOUT --------------------//

//-----------------------FORGOT PASSWORD --------------------//

let forgotPassword = (req, res) =>{
    if(check.isEmpty(req.body.email)){
        logger.error("Email ID parameter missing", "UserController: forgotPassword", 10);
        let apiResponse = response.generate(true, "Email ID is missing", 500, null);
        res.send(apiResponse);
    }else{
        UserModel.findOne({'email': req.body.email})
        .lean()
        .exec((err, result) => {
            if (err) {
                logger.error(err.message, 'userController : forgotPassword', 10)
                let apiResponse = response.generate(true, 'Failed To Find Email ID', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                let apiResponse = response.generate(true, 'No Email ID Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Emai ID  Details Found', 200, result);
                mailer.autoEmail(req.body.email, `<h1>Greetings!! from  MY-TO-DO-LIST APP</h1><br>
                                                    <a href='http://techblogs.live/resetPassword/${result.userId}'> 
                                                    Click Here To Rest Your Password</a>`, 'Reset Password');
                res.send(apiResponse)
            }
        })
    }
}
//-----------------------END OF FORGOT PASSWORD --------------------//

let resetPassword = (req, res) =>{

    let findUser = () => {

        return new Promise((resolve, reject) => {
            if (req.body.userId) {
                UserModel.findOne({  userId: req.body.userId }, (err, userDetails) => {
                    if (err) {
                        console.log("--->" + err)
                        logger.error('Failed To Retrieve User Data', 'userController: resetPassword()', 10)
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(userDetails)) {
                        logger.error('No User Found', 'userController: resetPassword()', 5)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {

                        logger.info('User Found', 'userController: resetPassword()', 10)
                        resolve(userDetails)
                    }
                });

            } else {
                let apiResponse = response.generate(true, '"UserId" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }
/*
    let updatePassword = (req, res) => {
        let options = req.body;
        if (check.isEmpty(req.body.password)) {
            let apiResponse = response.generate(true, 'Password is missing', 403, null);
            reject(apiResponse)
        } else {
            UserModel.update({ userId: req.body.userId },{password:passwordLib.hashpassword(req.body.password), }, options, { multi: true })
                .exec((err, result) => {
                    if (err) {
                        logger.error(err.message, 'userController: updatePassword ', 10)
                        let apiResponse = response.generate(true, 'Failed To Update Password ', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(result)) {
                        let apiResponse = response.generate(true, 'No User Found', 404, null)
                        reject(apiResponse)
                    } else {
                        //let apiResponse = response.generate(false, 'Password Edited successfully', 200, result)
                        //res.send(apiResponse)
                        resolve(result);
                    } 
                })
        }
    }*/

        let updatePassword = (userDetails) => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.password)) {
                logger.error("password is missing", "UserController: updatePassword", 10);
                let apiResponse = response.generate(true, "Password is missing", 500, null);
                reject(apiResponse);
            } else {
                UserModel.update({ userId: req.body.userId }, { password: passwordLib.hashpassword(req.body.password) }, { multi: true }, (err, result) => {

                    if (err) {
                        logger.error("Failed to change Password ", "userController: updatePassword", 10);
                        let apiResponse = response.generate(true, "Failed to change Password", 500, null);
                        reject(apiResponse);
                    }
                    else if (check.isEmpty(result)) {
                        logger.error("User Not found", "userController: updatePassword", 10);
                        let apiResponse = response.generate(true, "User not found", 500, null);
                        reject(apiResponse);
                    }
                    else {
                        logger.info("Password updated", "userController: updatePassword", 10);
                       
                        resolve("Password reset successful");
                    }
                });
            }
        });
    }

    findUser(req, res)
        .then(updatePassword)
        .then((result)=>{
            let apiResponse = response.generate(false, 'Password updatePassword successfully', 200, result);
            res.send(apiResponse)
        })
        .catch(
            (err)=>{
               // console.log(err)
                res.send(err);
            }
        )
}


module.exports = {

    signUpFunction: signUpFunction,
    getAllUser: getAllUser,
    editUser: editUser,
    deleteUser: deleteUser,
    getSingleUser: getSingleUser,
    loginFunction: loginFunction,
    logout: logout,
   // userVerification: userVerification,
    forgotPassword: forgotPassword,
    resetPassword:resetPassword

}