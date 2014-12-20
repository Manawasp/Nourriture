
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
  console.log(req.headers)
  if (req.path == '/') {
    next()
  } else {
    console.log(req.header('Auth-Token'))
    console.log(req.header('Content-Type'))
    error = auth.verify(req.header('Auth-Token'))
    if (error != null) {
      res.type('application/json');
      res.send(error.code, error.json_value);
    }
    else {
      next()
    }
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
    uniqueness_email(user, res, valide_create)
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
        error = u.update_information(req.body)
        if (error == null) {
          uniqueness_email(u, res, valide_create)
        }
        else {
          res.send(400, {error: error})
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

var uniqueness_email = function(user, res, callback) {
  User.findOne({'email': user.email}, '', function (err, user_data) {
    if (user_data) {
      res.send(400, {error: "this email is already taken"})
    }
    else {
      callback(user, res)
    }
  });
}

var valide_create = function(user, res) {
  user.save()
  res.send(200, {token: user.auth_token(), user: user.personal_information()})
}