
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User');
  , redis     = require("redis")
  , redisClient = redis.createClient();

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
 * [POST] Connect an user
 */

router.post('/', function(req, res){
  res.type('application/json');
  client.on("error", function (err) {
    console.log("Error " + err);
  });
  if (req.body.email && req.body.password) {
    User.findOne({'email': req.body.email}, '', function (err, user_cible) {
      if (user_cible) {
        if (user_cible.check_password(req.body.password)) {
          res.send(200, {token: user_cible.auth_token(), user: user_cible.personal_information()})
          client.rpush(["users:" + user_cible._id, user_cible.salt], redis.print);
        }
        else {res.send(400, {error: "match email/password failed"})}
      }
      else {res.send(404, {error: "resource not found"})}
    });
  }
  else {res.send(400, {error: "bad request"})}
})

/**
 * [DELETE] Deconnect an user
 */

router.delete('/', function(req, res){
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * Export router
 */

module.exports = router