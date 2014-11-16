
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , auth      = require('./services/authentification');
 
/**
 * Router middleware
 */

router.use(function(req, res, next) {
  error = auth.verify(req.header('Auth-Token'))
  if (error != null) {
    res.type('application/json');
    res.send(error.code, error.json_value);
  }
  else {
    next()
  }
})

/**
 * [POST] Follow an user
 */

router.post('/', function(req, res){
  // Retrieve Current User
  res.type('application/json');
  User.findOne({'_id': auth.user_id()}, '', function (err, current_user) {
    if (current_user) {
      // Retrieve user cible
      if (req.body.user_id != undefined) {
        User.findOne({'_id': req.body.user_id}, '', function (err, user_cible) {
          if (user_cible && user_cible._id != current_user._id) {
            error = current_user.follow(user_cible._id) || user_cible.followed_by(current_user._id)
            if (error == null) {
              current_user.save()
              user_cible.save()
              res.send(200, user_cible.information())
            }
            else {res.send(400, {error: error})}
          }
          else {res.send(404, {error: "resource not found"})}
        });
      }
      else {res.send(400, {error: "bad request"})}
    }
    else {res.send(404, {error: "account invalid"})}
  });
})

/**
 * [GET] Retrieve Follower list
 */

router.get('/:uid', function(req, res){
  res.type('application/json');
  User.findOne({'_id': req.params.uid}, '', function (err, user_cible) {
    if (user_cible) {
      followers_data = []
      User.find({'_id': user_cible.followers}, '', function (err, users) {
        if (users) {
          for (var i = 0; i < users.length; i++) {
            followers_data.push(users[i].information())
          }
        }
        res.send(200, followers_data)
      });
    }
    else {res.send(404, {error: "resource not found"})}
  });
})

/**
 * [DELETE] Delete an User follower
 */

router.delete('/:uid', function(req, res){
  // Retrieve Current User
  res.type('application/json');
  User.findOne({'_id': auth.user_id()}, '', function (err, current_user) {
    if (current_user) {
      // Retrieve user cible
      if (req.params.uid != undefined) {
        User.findOne({'_id': req.params.uid}, '', function (err, user_cible) {
          if (user_cible) {
            error = current_user.unfollow(user_cible._id) || user_cible.unfollowed_by(current_user._id)
            if (error == null) {
              current_user.save()
              user_cible.save()
              res.send(200, {success: 'user is removed to your follower'})
            }
            else {res.send(400, {error: error})}
          }
          else {res.send(404, {error: "resource not found"})}
        });
      }
      else {res.send(400, {error: "bad request"})}
    }
    else {res.send(404, {error: "account invalid"})}
  });
})

module.exports = router