var mongoose = require('mongoose')

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.DB_HOST);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'DB Connection Error : '));
db.once('open', function(){
  console.log('DB Connected');
});

module.exports = mongoose;
