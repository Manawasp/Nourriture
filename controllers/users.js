
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
  if (req.path == '/') {
    next()
  } else {
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

router.get('/', function(req, res){
  console.log('[SEARCH] User');
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [POST] User Collection
 */

router.post('/', function(req, res){
  console.log("[CREATE] User");
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
  console.log('[GET] User')
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
  console.log('[UPDATE] User');
  res.type('application/json');
  User.findOne({'_id': req.params.uid}, '', function (err, u) {
    if (u) {
      error = u.update_information(req.body)
      if (error == null) {
        u.save()
        res.send(200, u.information())
      }
      else {
        res.send(400, {error: error})
      }
    }
    else {
      res.send(404, {error: "account invalid"})
    }
  });
})

/**
 * [DELETE] User
 */

router.delete('/:uid', function(req, res){
    console.log('[DELETE] User');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
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