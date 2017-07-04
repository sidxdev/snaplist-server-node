var express = require('express');
var bodyParser = require('body-parser');
var dotenv = require('dotenv')
// Load dotenv
dotenv.load();

var app = express();
const _SERVER_PORT = process.env.SERVER_PORT || 3000;

// API is JSON only
app.use(bodyParser.json());
// Add API routes
app.use('/api/user', require('./server/api/user.js'));
app.use('/api/list', require('./server/api/list.js'));
// Catch errors in event loop
app.use(function(err, req, res, next) {
  console.log(err);
  switch(err.constructor) {
    case SyntaxError:
      res.json({'err':'Malformed JSON Request body.'});
    default:
      res.json({'err':err.message});
  }
});

app.listen(_SERVER_PORT, function () {
  console.log('Server started on port ' + _SERVER_PORT);
});
