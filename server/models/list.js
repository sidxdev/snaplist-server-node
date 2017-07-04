var mongoose = require('./db.js');
var Item = require('./item.js');
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
  items: [Item.schema],
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
// For cast
List.ObjectId = mongoose.Types.ObjectId;

module.exports = List;
