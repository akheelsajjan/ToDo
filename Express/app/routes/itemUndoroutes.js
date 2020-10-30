const itemUndoController = require("../controllers/itemUndoController");
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');

let setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/Undoitem`;

        //----------------------------------GET METHODS----------------------------------------//

        app.get(baseUrl + '/:listId/getPreviousItem',auth.isAuthorized, itemUndoController.getPreviousItem);
          /**
         * @apiGroup Undoitem
         * @apiVersion  1.0.0
         * @api {get} /api/v1/Undoitem/:listId/getPreviousItem To get all Undoitem 
         *
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, data.
         * 
         * @apiSuccessExample {object} Success-Response:

            {
                "error": false,
                "message": "Item Details Found",
                "status": 200,
                "data": [
                            {
                                "_id": "5ebea56d3e96e1029493d149",
                                "__v": 0,
                                "isDone": false,
                                "modifiedOn": "2020-05-15T14:21:33.000Z",
                                "createdOn": "2020-05-15T14:21:33.000Z",
                                "itemName": "Fifth Item inside second list",
                                "itemId": "FiR_vk1YS",
                                "listId": "c0DRikLt_"
                             }    
                    
                    ................
                ]
            }

         */  


        //----------------------------------POST METHODS----------------------------------------//

        app.post(baseUrl+ '/createUndoItem', auth.isAuthorized  , itemUndoController.createUndoItem);
        /**
         * @apiGroup Undoitem
         * @apiVersion  1.0.0
         * @api {post} /api/v1/Undoitem/:listId/getPreviousItem To create a UndoItem.
         *
         * @apiParam {string} listId listId of the  of Item. (body params)
         * @apiParam {string} itemId  itemId of the Item. (body params)
         * @apiParam {string} itemName itemName  of the item. (body params)
         * @apiParam {string} operationName operationName To  performed on Item. (body params)
         * 
         * @apiSuccess {object} myResponse shows error status, message, http status code, data.
         * 
         * @apiSuccessExample {object} Success-Response:

                {
                    "error": false,
                    "message": "Item history  saved successfully",
                    "status": 200,
                    "data": {
                        "__v": 0,
                        "_id": "5ebea56d3e96e1029493d149",
                        "isDone": false,
                        "modifiedOn": "2020-05-15T14:21:33.000Z",
                        "createdOn": "2020-05-15T14:21:33.000Z",
                        "itemName": "Fifth Item inside second list",
                        "itemId": "FiR_vk1YS",
                        "listId": "c0DRikLt_"
                    }
                }


            * @apiErrorExample {json} Error-Response:
            *
                {
                    "error": true,
                    "message": "Failed To Save Item History",
                    "status": 500,
                    "data": null
                }
        */

        app.post(baseUrl+ '/:itemId/delete', auth.isAuthorized  , itemUndoController.deleteUndoItem);
     /**
       * @apiGroup Undoitem
       * @apiVersion  1.0.0
       * @api {post} /api/v1/Undoitem/:itemId/delete To delete single undo item.
       *
       * @apiParam {string}  Item-ID  Item-ID of the item. (route params) (required)
       *
       * @apiSuccess {object} myResponse shows error status, message, http status code, data.
       * 
       * @apiSuccessExample {object} Success-Response:

                  {
                      "error": false,
                      "message": "item Deleted successfully",
                      "status": 200,
                      "data": {
                          "_id": "5ebea56d3e96e1029493d149",
                          "__v": 0,
                          "isDone": false,
                          "modifiedOn": "2020-05-15T14:21:33.000Z",
                          "createdOn": "2020-05-15T14:21:33.000Z",
                          "itemName": "Fifth Item inside second list",
                          "itemId": "FiR_vk1YS",
                          "listId": "c0DRikLt_"
                      }
                  }
       * @apiErrorExample {json} Error-Response:
       *
              {
                  "error": true,
                  "message": "No Item Found",
                  "status": 404,
                  "data": null
              }

  */

        app.post(baseUrl+ '/deleteAllUndoItems', auth.isAuthorized  , itemUndoController.deleteAllUndoItems);
           /**
             * @apiGroup Undoitem
             * @apiVersion  1.0.0
             * @api {get} /api/v1/Undoitem/deleteAllUndoItems To delete  all undo items.
             *
             *
             * @apiSuccess {object} myResponse shows error status, message, http status code, result.
             * 
             * @apiSuccessExample {object} Success-Response:

                {
                    "error": false,
                    "message": "All undo items Deleted successfully",
                    "status": 200,
                    "data": {
                        "n": 0,
                        "ok": 1
                    }
                }


          */ 

}

module.exports = {
    setRouter:setRouter
}