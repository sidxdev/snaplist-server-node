var mongoose = require('./db.js');
var common = require('../libs/common.js');

var Schema = mongoose.Schema;


var schema = new Schema({
  title: {
    type: String,
    required: true
  },
  shareCode: {
    type: String,
    default: common.genUUIDv4
  },
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
    default: Date.now
  }
}, { collection : 'List'});

var List = mongoose.model('List', schema, 'List');


module.exports = List;
