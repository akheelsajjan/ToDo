const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');

const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');

const check = require('../libs/checkLib');

const ItemModel = mongoose.model('ItemModel');

//----------------------------CREATE ITEM -----------------------------------//

let createItem = (req, res) =>{
    
    let validateList = () =>{
        return new Promise((resolve, reject)=>{
            if(check.isEmpty(req.body.listId) || check.isEmpty(req.body.itemName)) {
                let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
                res.send(apiResponse);
                reject(apiResponse);
            }else{
                resolve(req)
            }    
        })
    }//end of validatelist

    let saveItem = () =>{
        return new Promise( (resolve, reject)=>{
               
                    let newItem = ItemModel({
                        listId    : req.body.listId, 
                        itemId    : shortid.generate(),
                        itemName  : req.body.itemName,
                        duePeriod : req.body.duePeriod,
                        createdOn : time.now(),
                        modifiedOn: time.now()

                    })
                    newItem.save( (err, newItem)=>{
                        if(err){
                            logger.error(err.message, 'ItemController: createItem', 10);
                            let apiResponse = response.generate(true, 'Failed To Save Item', 500, null);
                            res.send(apiResponse);
                            reject(apiResponse);
                        }else{
                            console.log(newItem);
                            resolve(newItem);
                        }
                    }) 
        })


    } //end of save list

    validateList(req, res)
    .then(saveItem)
    .then( (resolve)=>{
        let apiResponse = response.generate(false, 'Item created successfully', 200, resolve)
        res.send(apiResponse)
    })
    .catch((err)=>{
        logger.error(err.message, 'ItemController: createItem', 10);
        let apiResponse = response.generate(true, 'Failed To Save Item', 500, null);
        res.send(apiResponse)
    })

}//end of create list

//---------------------------------END OF CREATE ITEM -------------------------------------//

//-------------------------------GET ITEM BY LIST------------------------------------------//

let getItembyList = (req, res) =>{
    if(check.isEmpty(req.params.listId)){
        let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
        res.send(apiResponse);
    }else{
        ItemModel.find({listId:req.params.listId})
        .lean()
        .sort({createdOn:-1}) 
        .exec((err,result)=>{
            if(err){
                logger.error(err.message, 'Item Controller: getListByUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find Item', 500, null)
                res.send(apiResponse)   
            }else if (check.isEmpty(result)){
                let apiResponse = response.generate(true, 'No Item Found', 404, null)
                res.send(apiResponse)
            }else{
                let apiResponse = response.generate(false, 'Item Details Found', 200, result)
                res.send(apiResponse)
            }
        })
    }

}//end of getlistbyUser

//---------------------------------END OF GET ITEM BY LIST --------------------------------//

//------------ ---------------------Get ITEM By ID----------------------------------------//

let getItembyId = (req, res) =>{
    if(check.isEmpty(req.params.itemId)){
        let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
        res.send(apiResponse);
    }else{
        ItemModel.findOne({itemId:req.params.itemId})
        .lean()
        .sort({createdOn:-1}) 
        .exec((err,result)=>{
            if(err){
                logger.error(err.message, 'Item Controller: getListByUser', 10)
                let apiResponse = response.generate(true, 'Item To Find List', 500, null)
                res.send(apiResponse)   
            }else if (check.isEmpty(result)){
                let apiResponse = response.generate(true, 'No Item Found', 404, null)
                res.send(apiResponse)
            }else{
                let apiResponse = response.generate(false, 'Item Details Found', 200, result)
                res.send(apiResponse)
            }
        })
    }

}//end of getlistbyUser


//----------------------------------------End of Get ITEM By ID-----------------------------//


//--------------------------------------GET ALL ITEMS---------------------------------------//

let getAllItems=(req, res)=>{
    ItemModel.find()
    .select('-__v -_id')
    .lean()
    .sort({createdOn:-1}) 
    .exec( (err, result)=>{
        if(err){
            logger.error(err.message, 'Item Controller: getAllItems', 10)
            let apiResponse = response.generate(true, 'Failed To Find Item', 500, null)
            res.send(apiResponse)   
        }else if (check.isEmpty(result)){
            let apiResponse = response.generate(true, 'No Item Found', 404, null)
            res.send(apiResponse)
        }else{
            let apiResponse = response.generate(false, 'Item Details Found', 200, result)
            res.send(apiResponse)
        }
    })

}
//---------------------------------END OF GET ALL ITEMS---------------------------------------//

//--------------------------------------DELETE ITEM-------------------------------------------//
let deleteItem=(req, res)=>{
    if(check.isEmpty(req.params.itemId)){
        let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
        res.send(apiResponse);
    }else{
        ItemModel.findOneAndRemove({itemId:req.params.itemId})
        .exec((err,result)=>{
            if(err){
                logger.error(err.message, 'item Controller: Delete item ', 10)
                let apiResponse = response.generate(true, 'Failed Delete List', 500, null)
                res.send(apiResponse)   
            }else if (check.isEmpty(result)){
                let apiResponse = response.generate(true, 'No item Found', 404, null)
                res.send(apiResponse)
            }else{
                let apiResponse = response.generate(false, 'item Deleted successfully', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

//------------------------------------END OF DELETE ITEM-------------------------------------------//

//----------------------------------------EDIT ITEM-----------------------------------------------//
let EditItem=(req, res)=>{
    options =  req.body;
    if(check.isEmpty(req.params.itemId)){
        let apiResponse = response.generate(true, 'Parameters are missing', 403, null);
        res.send(apiResponse);
    }else{
        ItemModel.update({itemId:req.params.itemId}, options, { multi: true })
        .exec((err,result)=>{
            if(err){
                logger.error(err.message, 'item Controller: Edit item ', 10)
                let apiResponse = response.generate(true, 'Failed Edit item', 500, null)
                res.send(apiResponse)   
            }else if (check.isEmpty(result)){
                let apiResponse = response.generate(true, 'No item Found', 404, null)
                res.send(apiResponse)
            }else{
                let apiResponse = response.generate(false, 'item Edited successfully', 200, result)
                res.send(apiResponse)
            }
        })
    }
}


//-------------------------------------END OF EDIT ITEM-----------------------------------------------//

module.exports = {
    createItem,
    getItembyList,
    getItembyId,
    getAllItems,
    deleteItem,
    EditItem
}




