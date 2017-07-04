var mongoose = require('./db.js');

var Schema = mongoose.Schema;


var schema = new Schema({
  name: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  lists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List'
  }]
}, { collection : "User"});

var User = mongoose.model('User', schema, 'User');
// For cast
User.ObjectId = mongoose.Types.ObjectId;

module.exports = User;
