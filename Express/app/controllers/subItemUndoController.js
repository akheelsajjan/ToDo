const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib');
const SubItemUndoModel = mongoose.model('SubItemUndoModel');

//-----------Creating A createSubUndoItem---------------------//

let createSubUndoItem = (req, res) => {

    let validateSubUndoItem = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.itemId) || check.isEmpty(req.body.subItemName || check.isEmpty(req.body.subItemId))) {
                let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
                res.send(apiResponse);
                reject(apiResponse);
            } else {
                resolve(req)
            }
        })
    }

    let saveSubUndoItem = () => {
        return new Promise((resolve, reject) => {
            let newSubUndoItem = SubItemUndoModel({
                itemId: req.body.itemId,
                subItemId: req.body.subItemId,
                subItemName: req.body.subItemName,
                isDone: req.body.isDone,
                action: req.body.action,
                createdOn: time.now(),
                modifiedOn: time.now()
            })

            console.log(newSubUndoItem);

            newSubUndoItem.save((err, result) => {
                console.log(result)
                if (err) {
                    logger.error(err.message, 'subItemUndoController: createSubUndoItem: 2', 10);
                    let apiResponse = response.generate(true, 'Failed To save SubUndoItem', 500, null);

                    reject(apiResponse);
                    res.send(apiResponse);

                } else {

                    console.log(result);
                    resolve(result);
                }
            })
        })

    }

    validateSubUndoItem(req, res)
        .then(saveSubUndoItem)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'SubUndoItem created successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            logger.error(err.message, 'subUndoItemController: SubUndoItem create', 10);
            let apiResponse = response.generate(true, 'Failed to create SubUndoItem: 3', 500, null);
            res.send(apiResponse)
        })

}

//----------------------------End of SubUndoItem----------------------//



//-------------------------------GET Previous  SubItem------------------------------------------//

let getPreviousSubItem = (req, res) => {
    if (check.isEmpty(req.params.itemId)) {
        let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
        res.send(apiResponse);
    } else {
        SubItemUndoModel.find({ itemId: req.params.itemId })
            .lean()
            .sort({ '_id': -1 })
            .select(' -__v')
            .limit(1)
            //.sort([['_id', -1]])
            // .select(' -__v')
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'subUndoItemController: getPreviousSubItem', 10)
                    let apiResponse = response.generate(true, 'Failed To Find last SubItem', 500, null)
                    res.send(apiResponse)
                } else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, 'No SubItem Found', 404, null)
                    res.send(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'SubItem Details Found', 200, result)
                    res.send(apiResponse)
                }
            })
    }

}

//---------------------------------END OF GET getPreviousSubItem   --------------------------------//

//--------------------------------------DELETE SubUndoItem ITEM-------------------------------------------//
let deleteUndoSubItem = (req, res) => {
    if (check.isEmpty(req.params.subItemId)) {
        let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
        res.send(apiResponse);
    } else {
        SubItemUndoModel.deleteOne({ subItemId: req.params.subItemId, subItemName: req.body.subItemName })
            .exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'subUndoItemController: Delete SubUndoItem ', 10)
                    let apiResponse = response.generate(true, 'Failed to  Delete history of SubUndoItem', 500, null)
                    res.send(apiResponse)
                } else if (check.isEmpty(result)) {
                    console.log("empty")
                    let apiResponse = response.generate(true, 'No SubUndoItem Found', 404, null)
                    res.send(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'SubUndoItem Deleted from history successfully', 200, result)
                    res.send(apiResponse)
                }
            })
    }
}

//------------------------------------END OF SubUndoItem ITEM-------------------------------------------//

//--------------------------------------DELETE All SubUndoItem ITEMs-------------------------------------------//
let deleteAllSubUndoItems = (req, res) => {
    SubItemUndoModel.remove()
        .select('-__v -_id')
        .exec((err, result) => {
            if (err) {
                logger.error(err.message, 'subUndoItemController: Delete All SubUndoItems ', 10)
                let apiResponse = response.generate(true, 'Failed to  Delete All the history of SubUndoItems', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                let apiResponse = response.generate(true, 'No SubUndoItem Found to delete', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All SubUndoItem Deleted successfully', 200, result)
                res.send(apiResponse)
            }
        })

}

//------------------------------------END OF All SubUndoItem-------------------------------------------//


module.exports = {
    createSubUndoItem,
    getPreviousSubItem,
    deleteUndoSubItem,
    deleteAllSubUndoItems
}