var express = require('express');
var bodyParser = require('body-parser');
var dotenv = require('dotenv')
var userEndpoint = require('./server/api/user.js');
var listEndpoint = require('./server/api/list.js');
// Load dotenv
dotenv.load();

var app = express();
const _SERVER_PORT = process.env.PORT || 3000;

// API is JSON only
app.use(bodyParser.json());
// Add API routes
app.use('/api/user', userEndpoint);
app.use('/api/list', listEndpoint);
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
