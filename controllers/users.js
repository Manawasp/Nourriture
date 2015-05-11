
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
 * [SEARCH] User Collection
 */

router.post('/search', function(req, res){
  res.type('application/json');
  params = req.body
  if (typeof params.pseudo == 'string') {
    var re = new RegExp(params.pseudo, 'i');
    query = User.find({'pseudo': re})
  } else {
    query = User.find({})
  }
  offset = 0
  limit = 21
  if (typeof params.offset == 'number' && params.offset > 0) {offset = params.offset}
  if (typeof params.limit == 'number' && params.limit > 0 && params.limit <= 20) {limit = params.limit}
  query.skip(offset).limit(limit)
  query.exec(function (err, users) {
    data_user = []
    if (err) {
      rData = {error: "search fail"}
      log.writeLog(req, "user", 500, rData)
      res.send(500, rData)
    }
    else if (users) {
      for (var i = 0; i < users.length; i++) {
        data_user.push(users[i].information())
      }
    }
    rData = {users: data_user, limit: limit, offset: offset, size: data_user.length}
    log.writeLog(req, "user", 200, rData)
    res.send(200, rData)
  });
})

/**
 * [POST] User Collection
 */

router.post('/', function(req, res){
  res.type('application/json');
  user = new User;
  error = user.create_by_email(req.body)
  if (error) {
    rData = {error: error}
    log.writeLog(req, "user", 400, rData)
    res.send(400, rData);
  }
  else {
    uniqueness_email(user, req, res, valide_create)
  }
})

/**
 * [GET] User
 */

router.get('/:uid', function(req, res){
  res.type('application/json')
  User.findOne({'_id': req.params.uid}, '', function (err, u) {
    if (u) {
      if (u._id == auth.user_id()) {
        rData = u.personal_information()
        log.writeLog(req, "user", 200, rData)
        res.send(200, rData)
      }
      else {
        rData = u.information()
        log.writeLog(req, "user", 200, rData)
        res.send(200, rData)
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
 * [UPDATE] User
 */

router.patch('/:uid', function(req, res){
  res.type('application/json');
  User.findOne({'_id': req.params.uid}, '', function (err, u) {
    if (u) {
      if (u._id == auth.user_id())
      {
        if (!Object.keys(req.body).length) {
          rData = {error: "empty request"}
          log.writeLog(req, "user", 400, rData)
          res.send(400, rData)
        }
        else {
          error = u.update_information(req.body)
          if (error == null && req.body.email) {
            uniqueness_email(u, req, res, valide_create)
          }
          else if (error == null){
            valide_create(u, req, res)
          }
          else {
            rData = {error: error}
            log.writeLog(req, "user", 400, rData)
            res.send(400, rData)
          }
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
          fs.writeFile(__dirname + '/../public/pictures/avatars/' + u._id + "." +  req.body.extend, new Buffer(req.body.picture, "base64"), function(err) {});
          u.avatar = "http://localhost:8080/pictures/avatars/" + u._id + "." +  req.body.extend
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
