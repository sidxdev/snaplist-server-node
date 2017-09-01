var express = require('express');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var cors = require('cors');
var io = require('socket.io');
var userEndpoint = require('./server/api/user.js');
var listEndpoint = require('./server/api/list.js');
var authModule = require('./server/api/auth.js');
// Load dotenv
dotenv.load();

var app = express();
const _SERVER_PORT = process.env.PORT || 3000;

// API is JSON only
app.use(bodyParser.json());
app.use(cors());
// Add API routes
app.use('/api/auth', authModule);
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

// Start server
var server = app.listen(_SERVER_PORT, function () {
  console.log('Server started on port ' + _SERVER_PORT);
});

// Setup socket.io
io = io(server);
var appSocket = require('./server/libs/app-socket.js').init(io);
