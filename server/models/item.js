var mongoose = require('./db.js');

var Schema = mongoose.Schema;


var schema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: String,
  dateCreated: {
    type: Date,
    required: true
  }
}, { collection : 'Item'});

var Item = mongoose.model('Item', schema, 'Item');


module.exports = Item;
