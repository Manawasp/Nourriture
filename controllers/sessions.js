
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
  if (req.method == "DELETE") {
    res.type('application/json');
    auth.verify(req.header('Auth-Token'), res, next)
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
  redisClient.on("error", function (err) {
    console.log("Error " + err);
  });
  if (req.body.email && req.body.password) {
    User.findOne({'email': req.body.email}, '', function (err, user_cible) {
      if (user_cible) {
        if (user_cible.check_password(req.body.password)) {
          user.new_salt()
          redisClient.rpush(["user:" + user_cible._id + ":token", user_cible.salt], redis.print);
          res.send(200, {token: user_cible.auth_token(), user: user_cible.personal_information()})
        }
        else {
        redisClient.quit();res.send(400, {error: "match email/password failed"})}
      }
      else {
        redisClient.quit();res.send(404, {error: "resource not found"})}
    });
  }
  else {
    redisClient.quit();res.send(400, {error: "bad request"})}
})

/**
 * [DELETE] Deconnect an user
 */

router.delete('/', function(req, res){
  res.type('application/json');
  redisClient.lrem(["user:" + auth.user_id() + ":token", 0, auth.user_hash()], redis.print);
  redisClient.quit();
  res.send(200, {success: "session deleted"});
})

/**
 * Export router
 */

module.exports = router
