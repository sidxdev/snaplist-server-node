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
    default: Date.now
  }
});

var Item = mongoose.model('Item', schema);
// For embedding
Item.schema = schema;
// For cast
Item.ObjectId = mongoose.Types.ObjectId;

module.exports = Item;
