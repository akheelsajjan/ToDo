const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({

  userId: {
    type: String,
    required: true,
    index: true
  },
  listId: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  listName: {
    type: String,
    required: true
  },
  creator:{
    type:String
  },
  createdOn :{
    type:Date,
    default: new Date()
  },
  modifiedOn :{
    type:Date,
    default: new Date()
  },
  private: {
    type:Boolean
  }
});

module.exports = mongoose.model('ListModel', ListSchema);