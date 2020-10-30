const itemController = require("../controllers/subItemController");
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');

let setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/subItem`;

    //----------------------------------POST METHODS----------------------------------------//

    app.post(baseUrl + '/create', auth.isAuthorized, itemController.createSubItem);

    /**
     * @apiGroup subItem
     * @apiVersion  1.0.0
     * @api {post} /api/v1/subItem/create To create a subItem
     *
     * @apiParam {string}  ItemID ItemID of the subItem. (body params)
     * @apiParam {string}  Name Name of the subItem. (body params)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, data.
     * 
     * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "SubItem created successfully",
                "status": 200,
                "data": {
                    "__v": 0,
                    "_id": "5ebead1b3e96e1029493d14a",
                    "isDone": false,
                    "modifiedOn": "2020-05-15T14:54:19.000Z",
                    "createdOn": "2020-05-15T14:54:19.000Z",
                    "subItemName": "zzz",
                    "subItemId": "I8naBu1Y8",
                    "itemId": "FiR_vk1YS"
                }
            }


        * @apiErrorExample {json} Error-Response:
        *
            {
                "error": true,
                "message": "Failed to create SubItem",
                "status": 500,
                "data": null
            }
    */

    app.post(baseUrl + '/:subItemId/delete', auth.isAuthorized, itemController.deleteSubItem);
    /**
   * @apiGroup subItem
   * @apiVersion  1.0.0
   * @api {post} /api/v1/subItem/:subItemId/delete To delete single subItem.
   *
   * @apiParam {string}  subItemId subItemId of the subItem. (route params) (required)
   *
   * @apiSuccess {object} myResponse shows error status, message, http status code, data.
   * 
   * @apiSuccessExample {object} Success-Response:

              {
                  "error": false,
                  "message": "subItem Deleted successfully",
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


     */

    //----------------------------------GET METHODS----------------------------------------//

    app.get(baseUrl + '/:itemId/getSubItemOfItem', auth.isAuthorized, itemController.getSubItemsOfItem);

    /**
 * @apiGroup subItem
 * @apiVersion  1.0.0
 * @api {post} /api/v1/subItem/:itemId/getSubItemOfItem To get  a subItem by ID
 *
 * @apiParam {string}  ItemID ItemID of the subItem. (body params)
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
                    "__v": 0,
                    "_id": "5ebead1b3e96e1029493d14a",
                    "isDone": false,
                    "modifiedOn": "2020-05-15T14:54:19.000Z",
                    "createdOn": "2020-05-15T14:54:19.000Z",
                    "subItemName": "zzz",
                    "subItemId": "I8naBu1Y8",
                    "itemId": "FiR_vk1YS"
                }
            ]
        }


    * @apiErrorExample {json} Error-Response:
    *
        {
            "error": true,
            "message": "Failed to create SubItem",
            "status": 500,
            "data": null
        }
*/

    // app.get(baseUrl + '/:itemId/getItembyID',auth.isAuthorized, itemController.getItembyId);


    //----------------------------------PUT METHOD----------------------------------------//

    app.put(baseUrl + '/:subItemId/edit', auth.isAuthorized, itemController.EditSubItem);
    /**
      * @apiGroup subItem
      * @apiVersion  1.0.0
      * @api {put} /api/v1/subItem/:subItemId/edit To edit details of SubItem
      *
      *
      * @apiSuccess {object} myResponse shows error status, message, http status code, data.
      * 
      * @apiSuccessExample {object} Success-Response:
         {
             "error": false,
             "message": "SubItem Edited successfully",
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