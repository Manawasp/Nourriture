
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , Redis     = require("ioredis")
  , redisClient = new Redis({host:  process.env.NOURRITURE_REDIS_1_PORT_6379_TCP_ADDR || '127.0.0.1'})
  , auth      = require('./services/authentification')
  , log         = require('./services/log');
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
  if (req.body.email && req.body.password) {
    User.findOne({'email': req.body.email}, '', function (err, user_cible) {
      if (user_cible) {
        if (user_cible.check_password(req.body.password)) {
          user_cible.new_salt()
          redisClient.on("error", function (err) {
            console.log("Error " + err);
          });
          redisClient.lpush(["user:"+user_cible._id+":token", user_cible.salt], function(err, result){
            rData = {token: user_cible.auth_token(),
                      user: user_cible.personal_information()}
            log.writeLog(req, "sessions", 200, rData)
            res.send(200, rData)
          });
        }
        else {
          rData = {error: "match email/password failed"}
          log.writeLog(req, "sessions", 200, rData)
          res.send(400, rData)}
      }
      else {
        rData = {error: "resource not found"}
        log.writeLog(req, "sessions", 200, rData)
        res.send(404, rData)}
    });
  }
  else {
    rData = {error: "bad request"}
    log.writeLog(req, "sessions", 200, rData)
    res.send(400, rData)}
})

/**
 * [DELETE] Deconnect an user
 */

router.delete('/', function(req, res){
  res.type('application/json');
  redisClient.lrem("user:" + auth.user_id() + ":token", 0, auth.user_hash(), function() {
  });
  rData = {success: "session deleted"}
  log.writeLog(req, "sessions", 200, rData)
  res.send(200, rData);
})

/**
 * Export router
 */

module.exports = router
