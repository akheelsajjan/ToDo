const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let subItemSchema = new Schema({

    itemId: {
        type: String,
    },

    subItemId: {
        type: String,
        default: '',
       // index: true,
       // unique: true
    },
    subItemName: {
        type: String,
        
    },

    createdOn: {
        type: Date,
      
    },

    modifiedOn: {
        type: Date,
       
    },

    isDone:{
        type : Boolean,
             
    },
    action:{
        type:String
    }

})

mongoose.model('SubItemUndoModel', subItemSchema);