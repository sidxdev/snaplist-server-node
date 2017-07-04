var express = require('express');
var crypto = require('crypto');

var User = require('../models/user.js');
var reqHelper = require('../libs/request.js');

router = express.Router();


// Create Route
router.post('/', function(req, res, next) {
  if(!reqHelper.parametersExist(["name", "email", "password"], "Parameters are required: ", req, res)) {
    return next();
  }
  var newUser = new User({
    name: req.body.name,
    email: req.body.email,
    hash: crypto.createHash("md5").update(req.body.password).digest("hex")
  });
  // Attempt save in DB
  newUser.save(function(err) {
    if(err) {
      // Return error on DB error
      return res.json({"err" : err});
    }
  }).then(function(user){
    console.log("User created with id: " + user._id);
    return res.json({"id" : user._id});
  });
});

// All RUD routes
router.route('/:id')
  // Get User
  .get(function(req, res, next) {
    User.findOne({_id:req.params.id}, function(err, user) {
      if(err) {
        return res.json({"err" : err});
      } else {
        if(user === null) {
          return res.json({"err" : "User not found"});
        } else {
          return res.json({"user" : user});
        }
      }
      });
  })
  // Update User
  .put(function(req, res, next){
    var update = false;
    // Update individual properties
    if(req.body.hasOwnProperty("name") || req.body.hasOwnProperty("email")) {
      User.findOne({_id:req.params.id}, function(err, user) {
        if (err) {
          res.json({"err" : err});
          return next(err);
        } else {
          if(req.body.hasOwnProperty("name")) {
            user.name = req.body.name;
          }
          if(req.body.hasOwnProperty('email')) {
            user.email = req.body.email;
          }
          user.save(function(err) {
            if(err) {
              // Return error on DB error
              res.json({"err" : err});
              return next(err);
            }
          }).then(function(updatedUser) {
            console.log("User updated with id: " + updatedUser._id);
            res.json(updatedUser);
          });
        }
      });
    } else {
      return res.json({ 'err' : 'At least one parameter is required: [email, name]'});
    }
  })
  // Delete User
  .delete(function(req, res, next){
    User.findOneAndRemove({_id:req.params.id}, function(err, user) {
      if(err) {
        // Return error on DB error
        res.json({"err" : err});
        return next(err);
      } else {
        console.log("User deleted with id: " + user._id);
        res.json({"id" : user._id});
      }
    });
  });


module.exports = router;
