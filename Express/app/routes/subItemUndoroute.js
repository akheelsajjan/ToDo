const subItemUndoController = require("../controllers/subItemUndoController");
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');

let setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/subUndoItem`;

    //----------------------------------GET METHODS----------------------------------------//

    app.get(baseUrl + '/:itemId/getPreviousSubUndoItem', auth.isAuthorized, subItemUndoController.getPreviousSubItem);


    //----------------------------------POST METHODS----------------------------------------//

    app.post(baseUrl + '/createSubUndoItem', auth.isAuthorized, subItemUndoController.createSubUndoItem);
    /**
     * @apiGroup subUndoItem
     * @apiVersion  1.0.0
     * @api {post} /api/v1/subUndoItem/createSubUndoItem To create a subUndoItem
     *
     * @apiParam {string}  itemId  itemId of SubItem. (body params)
     * @apiParam {string} subItemId subItemId  of the SubItem. (body params)
     * @apiParam {string} subItemName subItemName  of the subitem. (body params)
     * @apiParam {boolean} isDone isDone of the subitem. (body params)
     * @apiParam {string} operationName operationName To identify action performed on SubItem. (body params)
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



        */

    app.post(baseUrl + '/:subItemId/delete', auth.isAuthorized, subItemUndoController.deleteUndoSubItem);
    /**
       * @apiGroup subUndoItem
       * @apiVersion  1.0.0
       * @api {post} /api/v1/subUndoItem/:subItemId/delete To delete single subitem from subUndoItem.
       *
       * @apiParam {string}  SubItem-ID SubItem-ID of the subitem. (route params) (required)
       *
       * @apiSuccess {object} myResponse shows error status, message, http status code, data.
       * 
       * @apiSuccessExample {object} Success-Response:

              {
                  "error": false,
                  "message": "SubUndoItem Deleted from history successfully",
                  "status": 200,
                  "data": {
                      "n": 1,
                      "ok": 1
                  }
              }
      
 

       */

    app.post(baseUrl + '/deleteAllSubUndoItems', auth.isAuthorized, subItemUndoController.deleteAllSubUndoItems);
    /**
 * @apiGroup subUndoItem
 * @apiVersion  1.0.0
 * @api {post} /api/v1/subUndoItem/:subItemId/delete To delete single subitem from subUndoItem.
 *
 *
 * @apiSuccess {object} myResponse shows error status, message, http status code, data.
 * 
 * @apiSuccessExample {object} Success-Response:

        {
            "error": false,
            "message": "All SubUndoItem Deleted successfully",
            "status": 200,
            "data": {
                "n": 1,
                "ok": 1
            }
        }
 
 

 */

}

module.exports = {
    setRouter: setRouter
}