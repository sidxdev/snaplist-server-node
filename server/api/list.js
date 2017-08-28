var express = require('express');
var crypto = require('crypto');

var List = require('../models/list.js');
var User = require('../models/user.js');
var Item = require('../models/item.js');
var reqHelper = require('../libs/request.js');
var appSocket = require('../libs/app-socket.js');

router = express.Router();


// Create List
router.post('/', function(req, res, next) {
  if(reqHelper.parametersExist(['title', 'userId'], "Parameters are required: ", req, res)) {
    // Check for user
    var doc = User.findOne({_id:req.body.userId}, function(err, user) {
      if(err) {
        return res.json({ 'err' : err });
      } else if (user === null) {
        return res.json({ 'err' : 'User not found.' });
      } else {
        // Create List
        var newList = new List({
          title: req.body.title,
          users: [req.body.userId]
        });
        newList.save(function(err, list) {
          if(err) {
            return res.json({ 'err' : err });
          } else {
            // Update list reference in user
            user.lists.push(list._id);
            user.save(function(err, updatedUser) {
              if(err) {
                return res.json({ 'err' : err });
              } else {
                console.log("List created with id: " + list._id);
                return res.json({ 'id' : list._id});
              }
            });
          }
        });
      }
    });
    if(!doc) {
      return res.json({'err':'User not found.'});
    }
  }
});

// Read/Update routes
router.route('/:id')
  .get(function(req, res, next) {
    List.findOne({_id:req.params.id}, function (err, list) {
      if (err) {
        return res.json({ 'err' : err });
      } else if (list === null) {
        return res.json({ 'err' : 'List not found.' });
      } else {
        return res.json({ 'list' : list });
      }
    });
  })
  .put(function(req, res, next) {
    if(req.body.hasOwnProperty('title')) {
      List.findOne({_id:req.params.id}, function(err, list) {
        list.title = req.body.title;
        list.save(function(err, updatedList){
          if(err) {
            return res.json({ 'err' : err});
          } else {
            console.log('List updated with id: ' + updatedList._id);
            return res.json(updatedList);
          }
        });
      });
    } else {
      res.json({ 'err' : 'At least one parameter is required: [title]'});
      return next();
    }
  });

// Adding user to list
router.post('/:id/user', function(req, res, next) {
  if(!reqHelper.parametersExist(["userId"], "Parameters are required: ", req, res)) {
    return next();
  }
  // Find list
  List.findOne({_id:req.params.id}, function(err, list) {
    if(err) {
      return res.json({ 'err' : err });
    } else if ( list === null) {
      return res.json({ 'err' : 'List not found.' });
    } else {
      // Find user
      User.findOne({ _id : req.body.userId}, function(err, user) {
        if(err) {
          return res.json({ 'err' : err });
        } else if (user === null){
          return res.json({ 'err' : 'User not found.' });
        } else {
          if(user.lists.indexOf(req.params.id) > -1 || list.users.indexOf(req.body.userId) > -1) {
            return res.json({'err' : 'User already in list.'});
          }
          user.lists.push(req.params.id);
          list.users.push(req.body.userId);
          // Attempt save list
          list.save(function(err, updatedList) {
            if(err) {
              return res.json({ 'err' : err });
            } else {
              // Attempt save user
              user.save(function(err, updatedUser) {
                if(err) {
                  return res.json({ 'err' : err });
                } else {
                  console.log('User: ' + user._id + ' added to List: ' + list._id);
                  return res.json(updatedList);
                }
              });
            }
          });
        }
      });
    }
  });
});

// Removing user from list
router.delete('/:listId/user/:userId', function(req, res, next) {
  // Find list
  List.findOne({_id:req.params.listId}, function(err, list) {
    if (err) {
      return res.json({ 'err' : err });
    } else if (list === null) {
      return res.json({ 'err' : 'List not found.' });
    } else {
      // Find user
      User.findOne({_id:req.params.userId}, function(err, user) {
        if (err) {
          return res.json({ 'err' : err });
        } else if (user === null ) {
          return res.json({ 'err' : 'User not found.' });
        } else {
          if(user.lists.indexOf(list._id) == -1 || list.users.indexOf(user._id) == -1) {
            return res.json({ 'err' : 'User not in this list.' });
          }
          user.lists.splice(user.lists.indexOf(list._id), 1);
          list.users.splice(list.users.indexOf(user._id), 1);
          // If list empty, delete it else save it
          if(list.users.length <= 0) {
            list.remove(function(err, delList) {
              if(err) {
                return res.json({'err':err});
              } else {
                console.log('List deleted: ' + list._id);
                user.save(function(err, updatedUser) {
                  if(err) {
                    return res.json({ 'err' : err });
                  } else {
                    console.log('User: ' + user._id + ' removed from List: ' + list._id);
                    return res.json({'id':delList._id});
                  }
                });
              }
            });
          } else {
            list.save(function(err, updatedList) {
              if(err) {
                return res.json({ 'err' : err });
              } else {
                // Attempt save user
                user.save(function(err, updatedUser) {
                  if(err) {
                    return res.json({ 'err' : err });
                  } else {
                    console.log('User: ' + user._id + ' removed from List: ' + list._id);
                    return res.json({'id':updatedList._id});
                  }
                });
              }
            });
          }
        }
      });
    }
  });
});

// Create item route
router.post('/:id/item', function(req, res, next) {
  if(!reqHelper.parametersExist(['title', 'content'], "Parameters required are: ", req, res)) {
    return next();
  }
  List.findOne({_id:req.params.id}, function(err, list) {
    if(err) {
      return res.json({ 'err' : err });
    } else if(list===null) {
      return res.json({ 'err' : 'List not found.'});
    } else {
      var item = new Item({
        title : req.body.title,
        content : req.body.content
      });
      list.items.push(item);
      list.save(function(err, updatedList) {
        if(err) {
          return res.json({ 'err' : err});
        } else {
          console.log('Create item in List: ' + list._id);
          appSocket.updateList(updatedList);
          return res.json(updatedList);
        }
      });
    }
  });
});

// RUD routes for items
router.route('/:listId/item/:itemId')
  .get(function(req, res, next) {
    List.findOne({_id:req.params.listId}, function(err,list) {
      if(err) {
        return res.json({ 'err' : err });
      } else if(list===null) {
        return res.json({ 'err' : 'List not found.'});
      } else {
        if(list.items.id(req.params.itemId) === null) {
          return res.json({'err':'Item not found.'});
        } else {
          return res.json(list.items.id(req.params.itemId));
        }
      }
    });
  })
  .put(function(req, res, next) {
    if(req.body.hasOwnProperty('content') || req.body.hasOwnProperty(('title'))) {
      List.findOne({_id:req.params.listId}, function(err,list) {
        if(err) {
          return res.json({ 'err' : err });
        } else if(list===null) {
          return res.json({ 'err' : 'List not found.'});
        } else {
          if(list.items.id(req.params.itemId) === null) {
            return res.json({'err':'Item not found.'});
          } else {
            if(req.body.hasOwnProperty('title')) {
              list.items.id(req.params.itemId).title = req.body.title;
            }
            if(req.body.hasOwnProperty('content')) {
              list.items.id(req.params.itemId).content = req.body.content;
            }
            list.save(function(err, updatedList) {
              if(err) {
                return res.json({'err':err});
              } else {
                console.log('Updated Item: ' + req.params.itemId + ' in List: ' + list._id);
                return res.json(updatedList.items.id(req.params.itemId));
              }
            });
          }
        }
      });
    } else {
      return res.json({ 'err' : 'At least one parameter is required: [contnet, title]'});
    }
  })
  .delete(function(req, res, next) {
    List.findOne({_id:req.params.listId}, function(err, list) {
      if(err) {
        return res.json({ 'err' : err });
      } else if(list===null) {
        return res.json({ 'err' : 'List not found.'});
      } else {
        if(list.items.id(req.params.itemId) === null) {
          return res.json({'err':'Item not found.'});
        }
        list.items.id(req.params.itemId).remove();
        list.save(function(err, updatedList) {
          if(err) {
            return res.json({ 'err' : err});
          } else {
            console.log('Deleted Item: ' + req.params.itemId + ' in List: ' + list._id);
            appSocket.updateList(updatedList);
            return res.json(updatedList);
          }
        });
      }
    });
  });

module.exports = router;
