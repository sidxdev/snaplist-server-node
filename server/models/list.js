var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }],
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dateCreated: {
    type: Date,
    required: true
  }
});

var List = mongoose.model('List', schema);

module.exports = List;
