
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , auth      = require('./services/authentification')
  , log         = require('./services/log');

/**
 * Router middleware
 */

router.use(function(req, res, next) {
  res.type('application/json');
  auth.verify(req.header('Auth-Token'), res, next)
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
              rData = user_cible.information()
              log.writeLog(req, "followers", 200, rData)
              res.send(200, rData)
            }
            else {
              rData = {error: error}
              log.writeLog(req, "followers", 400, rData)
              res.send(400, rData)}
          }
          else {
            rData = {error: "resource not found"}
            log.writeLog(req, "followers", 404, rData)
            res.send(404, rData)}
        });
      }
      else {
        rData = {error: "bad request"}
        log.writeLog(req, "followers", 400, rData)
        res.send(400, rData)}
    }
    else {
      rData = {error: "account invalid"}
      log.writeLog(req, "followers", 404, rData)
      res.send(404, rData)}
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
      User.find({'_id':  {$in: user_cible.followers}}, '', function (err, users) {
        if (users) {
          for (var i = 0; i < users.length; i++) {
            followers_data.push(users[i].information())
          }
        }
        log.writeLog(req, "followers", 200, followers_data)
        res.send(200, followers_data)
      });
    }
    else {
      rData = {error: "resource not found"}
      log.writeLog(req, "followers", 404, rData)
      res.send(404, rData)}
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
              rData = {success: 'user is removed to your follower'}
              log.writeLog(req, "followers", 200, rData)
              res.send(200, rData)
            }
            else {
              rData = {error: error}
              log.writeLog(req, "followers", 400, rData)
              res.send(400, {error: error})}
          }
          else {
            rData = {error: "resource not found"}
            log.writeLog(req, "followers", 404, rData)
            res.send(404, rData)}
        });
      }
      else {
        rData = {error: "bad request"}
        log.writeLog(req, "followers", 400, rData)
        res.send(400, rData)}
    }
    else {
      rData = {error: "account invalid"}
      log.writeLog(req, "followers", 404, rData)
      res.send(404, rData)}
  });
})

module.exports = router
