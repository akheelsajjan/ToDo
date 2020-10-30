const listController = require("../controllers/listControler");
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');

let setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/lists`;



    //--------------------------POST METHODS----------------------------------------//
    app.post(baseUrl + '/createList', auth.isAuthorized, listController.createList);

    /**
     * @apiGroup Lists
     * @apiVersion  1.0.0
     * @api {post} /api/v1/lists/createList To create a list.
     *
     * @apiParam {string}  UserId UserId of the user. (body params)
     * @apiParam {string}  listName listName of the list. (body params)
     * @apiParam {string}  creatorName  creatorName of the list creator. (body params)
     * @apiParam {boolean} private-field private-field for Public or Private List. (body params)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, data.
     * 
     * @apiSuccessExample {object} Success-Response:

                {
                    "error": false,
                    "message": "To-Do-List created successfully",
                    "status": 200,
                    "data": {
                        "__v": 0,
                        "listId": "c0DRikLt_",
                        "listName": "2/5/2020 list",
                        "userId": "JxZxAKhEO",
                        "creator": "Akheel",
                        "private": true,
                        "_id": "5ebe9a5f3e96e1029493d146",
                        "modifiedOn": "2020-05-15T13:34:23.000Z",
                        "createdOn": "2020-05-15T13:34:23.000Z"
                    }
                }


        * @apiErrorExample {json} Error-Response:
        *
            {
                "error": true,
                "message": "Failed to create list",
                "status": 500,
                "data": null
            }
    */


    app.post(baseUrl + '/:listId/delete', auth.isAuthorized, listController.deleteList);
    /**
     * @apiGroup Lists
     * @apiVersion  1.0.0
     * @api {post} /api/v1/lists/:listId/delete To delete a single list.
     *
     * @apiParam {string}  List-ID List-ID of the list. (route params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, data.
     * 
     * @apiSuccessExample {object} Success-Response:

                {
                    "error": false,
                    "message": "list Deleted successfully",
                    "status": 200,
                    "data": {
                        "_id": "5ebe9a5f3e96e1029493d146",
                        "listId": "c0DRikLt_",
                        "listName": "2/5/2020 list",
                        "userId": "JxZxAKhEO",
                        "creator": "Akheel",
                        "private": true,
                        "__v": 0,
                        "modifiedOn": "2020-05-15T13:34:23.000Z",
                        "createdOn": "2020-05-15T13:34:23.000Z"
                    }
                }
     * @apiErrorExample {json} Error-Response:
     *
            {
                "error": true,
                "message": "No List Found",
                "status": 404,
                "data": null
            }

*/


    //--------------------------GET METHODS----------------------------------------//
    app.get(baseUrl + '/all', auth.isAuthorized, listController.getAllList);
    /**
     * @apiGroup Lists
     * @apiVersion  1.0.0
     * @api {get} /api/v1/lists/all To get all lists
     *
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, data.
     * 
     * @apiSuccessExample {object} Success-Response:

            {
                "error": false,
                "message": "list Details Found",
                "status": 200,
                "data": [
                 {
                    "listId": "D6migV2jO",
                    "listName": "2/5/2020 list",
                    "userId": "JxZxAKhEO",
                    "creator": "Akheel",
                    "private": true,
                    "modifiedOn": "2020-05-15T14:02:26.000Z",
                    "createdOn": "2020-05-15T14:02:26.000Z"
                },
                 {
                    "listId": "eu1R2p-f_",
                    "listName": "2/5/2020 listfdfsd",
                    "userId": "JxZxAKhEO",
                    "creator": "Akheel",
                    "private": true,
                    "modifiedOn": "2020-05-15T14:02:43.000Z",
                    "createdOn": "2020-05-15T14:02:43.000Z"
                 }
                ]
             }

*/

    app.get(baseUrl + '/:userId/getlistofuser', auth.isAuthorized, listController.getlistbyUser);

    /**
      * @apiGroup Lists
      * @apiVersion  1.0.0
      * @api {get} /api/v1/lists/:userId/getlistofuser To get all lists of a user
      *
      *
      * @apiSuccess {object} myResponse shows error status, message, http status code, data.
      * 
      * @apiSuccessExample {object} Success-Response:
                 {
                     "error": false,
                     "message": "list Details Found",
                     "status": 200,
                     "data": [
                         {
                             "_id": "5ebea0f23e96e1029493d147",
                             "listId": "D6migV2jO",
                             "listName": "2/5/2020 list",
                             "userId": "JxZxAKhEO",
                             "creator": "Akheel",
                             "private": true,
                             "modifiedOn": "2020-05-15T14:02:26.000Z",
                             "createdOn": "2020-05-15T14:02:26.000Z",
                             "__v": 0
                         },
                         {
                             "_id": "5ebea1033e96e1029493d148",
                             "listId": "eu1R2p-f_",
                             "listName": "2/5/2020 listfdfsd",
                             "userId": "JxZxAKhEO",
                             "creator": "Akheel",
                             "private": true,
                             "modifiedOn": "2020-05-15T14:02:43.000Z",
                             "createdOn": "2020-05-15T14:02:43.000Z",
                             "__v": 0
                         }
                     ],
                     "currentPage": 1
                 }

 */

    app.get(baseUrl + '/:listId/getlistbyID', auth.isAuthorized, listController.getlistbyId);

    /**
     * @apiGroup Lists
     * @apiVersion  1.0.0
     * @api {get} /api/v1/lists/allLists To get all lists
     *
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:

        {
            "error": false,
            "message": "list Details Found",
            "status": 200,
            "data": [
                        {
                            "_id": "5ebea0f23e96e1029493d147",
                            "listId": "D6migV2jO",
                            "listName": "2/5/2020 list",
                            "userId": "JxZxAKhEO",
                            "creator": "Akheel",
                            "private": true,
                            "modifiedOn": "2020-05-15T14:02:26.000Z",
                            "createdOn": "2020-05-15T14:02:26.000Z",
                            "__v": 0
                        },

            ]
        }

*/


    //--------------------------PUT METHODS----------------------------------------//
    app.put(baseUrl + '/:listId/edit', auth.isAuthorized, listController.EditList);
    /**
         * @apiGroup Lists
         * @apiVersion  1.0.0
         * @api {put} /api/v1/lists/:listId/edit To edit details of list
         *
         *
         * @apiSuccess {object} myResponse shows error status, message, http status code, data.
         * 
         * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "list Edited successfully",
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