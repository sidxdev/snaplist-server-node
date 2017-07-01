var mongoose = require('mongoose');
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
});

var Item = mongoose.model('Item', schema);

module.exports = Item;
