const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib');

const SubItemModel = mongoose.model('SubItemModel');


//-----------Creating A createSubItem---------------------//

let createSubItem = (req, res) => {

    let validateSubItem = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.itemId) || check.isEmpty(req.body.subItemName)) {
                let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
                res.send(apiResponse);
                reject(apiResponse);
            } else {
                resolve(req)
            }
        })
    }

    let saveSubItem = () => {
        return new Promise((resolve, reject) => {
            let newSubItem = SubItemModel({

                itemId: req.body.itemId,
                subItemName: req.body.subItemName,
                subItemId: shortid.generate(),
                createdOn: time.now(),
                modifiedOn: time.now(),

            })
            newSubItem.save((err, newSubItem) => {
                if (err) {
                    logger.error(err.message, 'subItemController: createSubItem: 2', 10);
                    let apiResponse = response.generate(true, 'Failed To save SubItem', 500, null);
                    res.send(apiResponse);
                    reject(apiResponse);
                } else {
                    console.log(newSubItem);
                    resolve(newSubItem);
                }
            })
        })

    }

    validateSubItem(req, res)
        .then(saveSubItem)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'SubItem created successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            logger.error(err.message, 'subItemController: createSubItem', 10);
            let apiResponse = response.generate(true, 'Failed to create SubItem: 3', 500, null);
            res.send(apiResponse)
        })

}

//----------------------------End of createSubItem----------------------//



//------------ Get list By ID----------------------//

let getSubItemsOfItem = (req, res) => {
    if (check.isEmpty(req.params.itemId)) {
        let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
        res.send(apiResponse);
    } else {
        SubItemModel.find({ itemId: req.params.itemId })
            .lean()
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'subItemController : getSubItemsOfItem', 10)
                    let apiResponse = response.generate(true, 'Failed To Find subIteme', 500, null)
                    res.send(apiResponse)
                } else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, 'No Sub-Item Found', 404, null)
                    res.send(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Item Details Found', 200, result)
                    res.send(apiResponse)
                }
            })
    }

}//end of getlistbyUser


//------------ End of Get SubItem By ID--------------//


//--------------Get All SubItem --------------------//

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

//--------------END of Get All SubItem --------------------//

//--------------Delete -SubItem--------------------------//

let deleteSubItem = (req, res) => {
    if (check.isEmpty(req.params.subItemId)) {
        let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
        res.send(apiResponse);
    } else {
        SubItemModel.findOneAndRemove({ subItemId: req.params.subItemId })
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, ' SubItemController: Delete SubItem ', 10)
                    let apiResponse = response.generate(true, 'Failed to Delete SubItem', 500, null)
                    res.send(apiResponse)
                } else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, 'No SubItem Found', 404, null)
                    res.send(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'SubItem Deleted successfully', 200, result)
                    res.send(apiResponse)
                }
            })
    }
}

//--------------End of Delete -SubItem--------------------------//


//--------------Edit -SubItem--------------------------//

let EditSubItem = (req, res) => {
    options = req.body;
    if (check.isEmpty(req.params.subItemId)) {
        let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
        res.send(apiResponse);
    } else {
        SubItemModel.update({ subItemId: req.params.subItemId }, options, { multi: true })
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'SubItem Controller: Edit SubItem ', 10)
                    let apiResponse = response.generate(true, 'Failed to Edit SubItem', 500, null)
                    res.send(apiResponse)
                } else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, 'No SubItem Found', 404, null)
                    res.send(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'SubItem Edited successfully', 200, result)
                    res.send(apiResponse)
                }
            })
    }
}



let getSubItembyId = (req, res) => {
    if (check.isEmpty(req.params.itemId)) {
        let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
        res.send(apiResponse);
    } else {
        ItemModel.findOne({ itemId: req.params.itemId })
            .lean()
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Item Controller: getListByUser', 10)
                    let apiResponse = response.generate(true, 'Item To Find List', 500, null)
                    res.send(apiResponse)
                } else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, 'No Item Found', 404, null)
                    res.send(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Item Details Found', 200, result)
                    res.send(apiResponse)
                }
            })
    }

}

//--------------End of Edit -SubItem--------------------------//


//--------------Is Done -SubItem--------------------------//



module.exports = {
    createSubItem,
    getSubItemsOfItem,
    deleteSubItem,
    EditSubItem,

}