var express = require('express');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var cors = require('cors');
var io = require('socket.io');
// Load dotenv
dotenv.load();

var app = express();
const _SERVER_PORT = process.env.PORT || 3000;

// API is JSON only
app.use(bodyParser.json());
app.use(cors());
// Add API routes
app.use('/api/auth', require('./server/api/auth.js'));
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

// Start server
var server = app.listen(_SERVER_PORT, function () {
  console.log('Server started on port ' + _SERVER_PORT);
});

// Setup socket.io
io = io(server);
var appSocket = require('./server/libs/app-socket.js').init(io);
