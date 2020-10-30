const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let itemSchema = new Schema({

    listId: {
        type: String,
        default: '',
    },

    itemId: {
        type: String,
        default: '',
        index: true,
        unique: true
    },
    itemName: {
        type: String,
        default: ''
    },

    createdOn: {
        type: Date,
        default: new Date()
    },
    modifiedOn: {
        type: Date,
        default: new Date()
    },

    isDone:{
        type : String,
        default:"New"       
    },

    duePeriod:{
        type: Number,
        default: 1
    }


})


mongoose.model('ItemModel', itemSchema);