const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib');

const ListModel = mongoose.model('ListModel');


//-----------Creating A list---------------------//

let createList = (req, res) => {
    let validateList = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.userId) || check.isEmpty(req.body.listName) || check.isEmpty(req.body.creator) || check.isEmpty(req.body.private)) {
                let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
                res.send(apiResponse);
                reject(apiResponse);
            } else {
                resolve(req)
            }
        })
    }//end of validatelist

    let saveList = () => {
        return new Promise((resolve, reject) => {
            ListModel.findOne({ listName: req.body.listName })
                .exec((err, retrivedetails) => {
                    if (err) {
                        logger.error(err.message, 'listController: createlist : 1', 10);
                        let apiResponse = response.generate(true, 'Failed To Create List', 500, null);
                        res.send(apiResponse);
                        reject(apiResponse)
                    }
                    else if (check.isEmpty(retrivedetails)) {
                        console.log(req.body);
                        let newList = ListModel({
                            listId: shortid.generate(),
                            listName: req.body.listName,
                            userId: req.body.userId,
                            creator: req.body.creator,
                            createdOn: time.now(),
                            modifiedOn: time.now(),
                            private: req.body.private
                        })
                        newList.save((err, newList) => {
                            if (err) {
                                logger.error(err.message, 'listController: createlist: 2', 10);
                                let apiResponse = response.generate(true, 'Failed To save List', 500, null);
                                res.send(apiResponse);
                                reject(apiResponse);
                            } else {
                                console.log(newList);
                                resolve(newList);
                            }
                        })
                    } else {
                        let apiResponse = response.generate(true, 'list Already Present With Name', 403, null);
                        res.send(apiResponse);
                        reject(apiResponse)
                    }
                })
        })
    } 

    validateList(req, res)
        .then(saveList)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'To-Do-List created successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            logger.error(err.message, 'listController: createlist', 10);
            let apiResponse = response.generate(true, 'Failed to create list: 3', 500, null);
            res.send(apiResponse)
        })

}//end of create list

//----------------------------End of create list----------------------//

//------------------Getting A list--------------------//

let getlistbyUser = async (req, res) => {
    if (check.isEmpty(req.params.userId)) {
        let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
        res.send(apiResponse);
    } else {
        const { page = 1, limit = 10 } = req.query;

        const list = ListModel.find({ userId: req.params.userId })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean()
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'List Controller: getListByUser', 10)
                    let apiResponse = response.generate(true, 'Failed To Find List', 500, null)
                    res.send(apiResponse)
                } else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, 'No list Found', 404, null)
                    res.send(apiResponse)
                } else {
                    let response = {
                        error: false,
                        message: 'list Details Found',
                        status: 200,
                        data: result,
                        // totalPages: Math.ceil(count / limit),
                        currentPage: page
                    }


                    // let apiResponse = response.generate(false, 'list Details Found', 200, result)
                    res.send(response)
                }
            })
    }

}//end of getlistbyUser


//------------End of Get list By User--------------//

//------------ Get list By ID----------------------//

let getlistbyId = (req, res) => {
    if (check.isEmpty(req.params.listId)) {
        let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
        res.send(apiResponse);
    } else {
        ListModel.findOne({ listId: req.params.listId })
            .lean()
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'List Controller: getListByUser', 10)
                    let apiResponse = response.generate(true, 'Failed To Find List', 500, null)
                    res.send(apiResponse)
                } else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, 'No list Found', 404, null)
                    res.send(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'list Details Found', 200, result)
                    res.send(apiResponse)
                }
            })
    }

}//end of getlistbyUser


//------------ End of Get list By ID--------------//


//--------------Get All list --------------------//

let getAllList = (req, res) => {
    ListModel.find()
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                logger.error(err.message, 'List Controller: getAll-list', 10)
                let apiResponse = response.generate(true, 'Failed To Find List', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                let apiResponse = response.generate(true, 'No list Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'list Details Found', 200, result)
                res.send(apiResponse)
            }
        })

}

//--------------END of Get All list --------------------//

//--------------Delete -list--------------------------//

let deleteList = (req, res) => {
    if (check.isEmpty(req.params.listId)) {
        let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
        res.send(apiResponse);
    } else {
        ListModel.findOneAndRemove({ listId: req.params.listId })
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'List Controller: Delete list ', 10)
                    let apiResponse = response.generate(true, 'Failed Delete List', 500, null)
                    res.send(apiResponse)
                } else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, 'No list Found', 404, null)
                    res.send(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'list Deleted successfully', 200, result)
                    res.send(apiResponse)
                }
            })
    }
}

//--------------End of Delete -list--------------------------//


//--------------Edit -list--------------------------//

let EditList = (req, res) => {
    let options = req.body;
    if (check.isEmpty(req.params.listId)) {
        let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
        res.send(apiResponse);
    } else {
        ListModel.update({ listId: req.params.listId }, options, { multi: true })
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'List Controller: Edit list ', 10)
                    let apiResponse = response.generate(true, 'Failed Edit List', 500, null)
                    res.send(apiResponse)
                } else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, 'No list Found', 404, null)
                    res.send(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'list Edited successfully', 200, result)
                    res.send(apiResponse)
                }
            })
    }
}

//--------------End of Edit -list--------------------------//





module.exports = {
    createList,
    getlistbyUser,
    getlistbyId,
    getAllList,
    deleteList,
    EditList
}




