var express = require('express');
var bodyParser = require('body-parser');
var dotenv = require('dotenv')
// Load dotenv
dotenv.load();

var userRoute = require('./server/api/user.js');
var listRoute = require('./server/api/list.js');

var app = express();

// API is JSON only
app.use(bodyParser.json());
// Add API routes
app.use('/api/user', userRoute);
app.use('/api/list', listRoute);

app.listen(process.env.SERVER_PORT || 3000, function () {
  console.log('Example app listening on port 3000 from the Mac!');
});
