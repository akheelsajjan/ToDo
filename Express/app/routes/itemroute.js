const itemController = require("../controllers/itemController");
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');

let setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/item`;

    //----------------------------------POST METHODS----------------------------------------//

    app.post(baseUrl + '/createItem', auth.isAuthorized, itemController.createItem);
    /**
     * @apiGroup item
     * @apiVersion  1.0.0
     * @api {post} /api/v1/item/createItem To create a Item.
     *
     * @apiParam {string}  listId of the Item. (body params)
     * @apiParam {string}  Name of the itemName. (body params)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, data.
     * 
     * @apiSuccessExample {object} Success-Response:

            {
                "error": false,
                "message": "Item created successfully",
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
                "message": "Failed to create Item",
                "status": 500,
                "data": null
            }
    */


    app.post(baseUrl + '/:itemId/delete', auth.isAuthorized, itemController.deleteItem);
    /**
       * @apiGroup Items
       * @apiVersion  1.0.0
       * @api {post} /api/v1/items/:itemId/delete To delete single item.
       *
       * @apiParam {string}  Item-ID Item-ID of the item. (route params) (required)
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

    //----------------------------------GET METHODS----------------------------------------//

    app.get(baseUrl + '/:listId/getItemsoflist', auth.isAuthorized, itemController.getItembyList);

    /**
     * @apiGroup Items
     * @apiVersion  1.0.0
     * @api {post} /api/v1/items/:listId/getItemsoflist To get all Items of a list.
     *
     * @apiParam {string}  listId-ID listId-ID of the item. (route params) (required)
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
                            ]
                    }
                }
     * @apiErrorExample {json} Error-Response:
     *
            {
                "error": true,
                "message": "No Items Found",
                "status": 404,
                "data": null
            }

*/

    app.get(baseUrl + '/:itemId/getItembyID', auth.isAuthorized, itemController.getItembyId);

    /**
     * @apiGroup Items
     * @apiVersion  1.0.0
     * @api {post} /api/v1/items/:itemId/getItembyID To Item by ID.
     *
     * @apiParam {string}  itemId-ID  itemId-ID of the item. (route params) (required)
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
                            ]
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
    //----------------------------------PUT METHOD----------------------------------------//

    app.put(baseUrl + '/:itemId/edit', auth.isAuthorized, itemController.EditItem);
    /**
    * @apiGroup Items
    * @apiVersion  1.0.0
    * @api {put} /api/v1/items/:itemId/edit To edit details of item
    *
    *
    * @apiSuccess {object} myResponse shows error status, message, http status code, data.
    * 
    * @apiSuccessExample {object} Success-Response:
       {
           "error": false,
           "message": "Item details edited successfully",
           "status": 200,
           "data": {
               "n": 1,
               "nModified": 1,
               "ok": 1
           }
       }
    */

}


module.exports = {
    setRouter: setRouter
}