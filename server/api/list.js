var express = require('express');
var crypto = require('crypto');

var List = require('../models/list.js');
var User = require('../models/user.js');
var reqHelper = require('../libs/request.js');

router = express.Router();


// Create List
router.post('/', function(req, res, next) {
  if(!reqHelper.parametersExist(['title', 'userId'], "Parameters are required: ", req, res)) {
    return next();
  } else {
    // Check for user
    User.findOne({_id : req.body.userId}, function(err, user) {
      if(err) {
        res.json({ 'err' : err });
      } else if (user === null) {
        res.json({ 'err' : 'User not found.' });
      } else {
        // Create List
        var newList = new List({
          title: req.body.title,
          users: [req.body.userId]
        });
        newList.save(function(err, list) {
          if(err) {
            res.json({ 'err' : err });
            return next(err);
          } else {
            // Update user list
            user.lists.push(list._id);
            user.save(function(err, updatedUser) {
              if(err) {
                res.json({ 'err' : err });
                return next(err);
              } else {
                console.log("List created with id: " + list._id);
              }
            });
          }
        });
      }
    });
  }
});


module.exports = router;
