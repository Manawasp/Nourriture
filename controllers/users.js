
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , redis     = require("redis")
  , redisClient = redis.createClient()
  , auth      = require('./services/authentification');
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
    // , function() {
    //   if () != null) {
    //     res.send(error.code, error.json_value);
    //   }
    //   else {
    //     console.log("user: no error" + req.method)
    //     next()
    //   }
    // });
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
      res.send(500, {error: "user: f(router.post'/search')"})
    }
    else if (users) {
      for (var i = 0; i < users.length; i++) {
        data_user.push(users[i].information())
      }
    }
    res.send(200, {users: data_user, limit: limit, offset: offset, size: data_user.length})
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
    res.send(400, {error: error});
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
        res.send(200, u.personal_information())
      }
      else {
        res.send(200, u.information())
      }
    }
    else {
      res.send(404, {error: "resource not found"})
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
          res.send(400, {error: "empty request"})
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
            res.send(400, {error: error})
          }
        }
      }
      else {
        res.send(403, {error: "you don't have the permission"})
      }
    }
    else {
      res.send(404, {error: "resource not found"})
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
        res.send(202, {success: "non implemente"})
      }
      else {
        res.send(403, {error: "you don't have the permission"})
      }
    }
    else {
      res.send(404, {error: "resource not found"})
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
      res.send(400, {error: "this email is already taken"})
    }
    else {
      callback(user, req, res)
    }
  });
}

var valide_create = function(user, req, res) {
  user.save()
  if (req.method == "POST") {
    redisClient.rpush(["user:" + user._id + ":token", user.salt], redis.print);
    redisClient.quit();
  }
  res.send(200, {token: user.auth_token(), user: user.personal_information()})
}
