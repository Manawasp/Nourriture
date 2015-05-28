
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , fs        = require('fs')
  , User      = mongoose.model('User')
  , Redis     = require("ioredis")
  , redisClient = new Redis()
  , auth      = require('./services/authentification')
  , log         = require('./services/log');
  redisClient.setMaxListeners(0);

/**
 * Router middleware
 */

router.use(function(req, res, next) {
  if (req.path == '/') {
    next()
  } else {
    res.type('application/json');
    auth.verify(req.header('Auth-Token'), res, next)
  }
});

/**
 * [UPDATE] User
 */

router.patch('/:uid', function(req, res){
  res.type('application/json');
	params = req.body
  User.findOne({'_id': req.params.uid}, '', function (err, u) {
    if (u) {
      if (auth.access_admin() == true)
      {
				u.update_access(params)
				u.save()
			  rData = {token: user.auth_token(), user: user.personal_information()}
			  log.writeLog(req, "adminUser", 200, rData)
			  res.send(200, rData)
      }
      else {
        rData = {error: "you don't have the permission"}
        log.writeLog(req, "user", 403, rData)
        res.send(403, rData)
      }
    }
    else {
      rData = {error: "resource not found"}
      log.writeLog(req, "user", 404, rData)
      res.send(404, rData)
    }
  });
})

/**
 * [DELETE] User
 */

router.delete('/:uid', function(req, res){
  res.type('application/json');
  User.findOne({'_id': req.params.uid}, '', function (err, u) {
    if (u) {
      if (u._id == auth.user_id())
      {
        rData = {success: "non implemente"}
        log.writeLog(req, "user", 202, rData)
        res.send(202, rData)
      }
      else {
        rData = {error: "you don't have the permission"}
        log.writeLog(req, "user", 403, rData)
        res.send(403, rData)
      }
    }
    else {
      rData = {error: "resource not found"}
      log.writeLog(req, "user", 404, rData)
      res.send(404, rData)
    }
  });
})


/**
 * [UPLOAD] User avatar
 */

router.post('/:uid/pictures', function(req, res) {
  res.type('application/json');
  User.findOne({'_id': req.params.uid}, '', function (err, u) {
    if (u) {
      if (u._id == auth.user_id())
      {
        if (req.body.extend == "jpg" || req.body.extend == "png" && req.body.picture != undefined){
          fileName = u._id + (Math.floor((Math.random() * 10000) + 1)).toString() + "." +  req.body.extend
          fs.writeFile(__dirname + '/../public/pictures/avatars/' + fileName, new Buffer(req.body.picture, "base64"), function(err) {});
          u.avatar = "http://localhost:8080/pictures/avatars/"+ fileName
          valide_create(u, req, res)
        }
        else {
          rData = {error: "bad type, only png and jpg are supported"}
          log.writeLog(req, "user", 400, rData)
          res.send(400, rData)
        }
      }
      else {
        rData = {error: "you don't have the permission"}
        log.writeLog(req, "user", 403, rData)
        res.send(403, rData)
      }
    }
    else {
      rData = {error: "resource not found"}
      log.writeLog(req, "user", 404, rData)
      res.send(404, rData)
    }
  });
})


/**
 * Export router
 */

module.exports = router

/**
 * Private method
 */

var uniqueness_email = function(user, req, res, callback) {
  User.findOne({'email': user.email}, '', function (err, user_data) {
    if (user_data) {
      rData = {error: "this email is already taken"}
      log.writeLog(req, "user", 400, rData)
      res.send(400, rData)
    }
    else {
      callback(user, req, res)
    }
  });
}

var valide_create = function(user, req, res) {
  user.save()
  if (req.method == "POST" && req.path == '/') {
    user.new_salt();
    redisClient.lpush(["user:" + user._id + ":token", user.salt], function(err, result){
      // redisClient.quit();
    });
  }
  rData = {token: user.auth_token(), user: user.personal_information()}
  log.writeLog(req, "user", 200, rData)
  res.send(200, rData)
}
