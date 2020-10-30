const mongoose = require('mongoose');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib');

const ItemUndoModel = mongoose.model('ItemUndoModel');

//----------------------------CREATE Undo ITEM -----------------------------------//

let createUndoItem = (req, res) => {
    let validateList = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.listId) || check.isEmpty(req.body.itemName)) {
                let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
                res.send(apiResponse);
                reject(apiResponse);
            } else {
                resolve(req)
            }
        })
    }//end of validatelist

    let saveItem = () => {
        return new Promise((resolve, reject) => {

            let newItemUndoModel = ItemUndoModel({
                listId: req.body.listId,
                itemId: req.body.itemId,
                itemName: req.body.itemName,
                isDone: req.body.isDone,
                duePeriod : req.body.duePeriod,
                action: req.body.action,
                createdOn: time.now(),
                modifiedOn: time.now()

            })
            newItemUndoModel.save((err, newItem) => {

                if (err) {
                    logger.error(err.message, 'ItemUndoController: createUndoItem', 10);
                    let apiResponse = response.generate(true, 'Failed To Save Item History', 500, null);
                    res.send(apiResponse);
                    reject(apiResponse);
                } else {
                    console.log(newItem);
                    resolve(newItem);
                }
            })
        })




    }

    validateList(req, res)
        .then(saveItem)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Item history  saved successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            logger.error(err.message, 'ItemUndoController: createUndoItem', 10);
            let apiResponse = response.generate(true, 'Failed To Save Item History', 500, null);
            res.send(apiResponse)
        })

}


//----------------------------End OF CREATE Undo ITEM -----------------------------------//

//-------------------------------GET Previous  ITEM------------------------------------------//

let getPreviousItem = (req, res) => {
    if (check.isEmpty(req.params.listId)) {
        let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
        res.send(apiResponse);
    } else {
        ItemUndoModel.find({ listId: req.params.listId })
            .lean()
            .sort({ '_id': -1 })
            .select(' -__v')
            .limit(1)
            //.sort([['_id', -1]])
            // .select(' -__v')
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'ItemUndoController: getPreviousItem', 10)
                    let apiResponse = response.generate(true, 'Failed To Find last Item', 500, null)
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

//---------------------------------END OF GET Previous ITEM  --------------------------------//


//--------------------------------------DELETE Undo ITEM-------------------------------------------//
let deleteUndoItem = (req, res) => {
    if (check.isEmpty(req.params.itemId)) {
        let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
        res.send(apiResponse);
    } else {
        ItemUndoModel.deleteOne({ itemId: req.params.itemId, itemName: req.body.itemName })
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'ItemUndoController: Delete item ', 10)
                    let apiResponse = response.generate(true, 'Failed to  Delete history of Item', 500, null)
                    res.send(apiResponse)
                } else if (check.isEmpty(result)) {
                    console.log("empty")
                    let apiResponse = response.generate(true, 'No item Found', 404, null)
                    res.send(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'item Deleted from history successfully', 200, result)
                    res.send(apiResponse)
                }
            })
    }
}

//------------------------------------END OF DELETE ITEM-------------------------------------------//

//--------------------------------------DELETE All Undo ITEMs-------------------------------------------//
let deleteAllUndoItems = (req, res) => {
    ItemUndoModel.remove()
        .select('-__v -_id')
        .exec((err, result) => {
            if (err) {
                logger.error(err.message, 'ItemUndoController: Delete All undo items ', 10)
                let apiResponse = response.generate(true, 'Failed to  Delete All the history of Items', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                let apiResponse = response.generate(true, 'No item Found to delete', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All undo items Deleted successfully', 200, result)
                res.send(apiResponse)
            }
        })

}

//------------------------------------END OF All Undo ITEMs-------------------------------------------//

module.exports = {
    createUndoItem,
    getPreviousItem,
    deleteUndoItem,
    deleteAllUndoItems

}