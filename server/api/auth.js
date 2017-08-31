var express = require('express');
var crypto = require('crypto');

var User = require('../models/user.js');
var reqHelper = require('../libs/request.js');

router = express.Router();

router.post('/', function(req, res, next) {
  if(!reqHelper.parametersExist(["email", "password"], "Parameters are required: ", req, res)) {
    return next();
  }
  User.findOne({email:req.body.email}, function(err, user) {
    if(err) {
      res.json({'err':err});
    } else if (user === null) {
      res.json({'err':'User with email ' + req.body.email + ' not found'});
    } else {
      if(crypto.createHash("md5").update(req.body.password).digest("hex") === user.hash) {
        res.json({'id':user.id});
      } else {
        res.json({'err':'Incorrect password.'});
      }
    }
  });
});

module.exports = router;
