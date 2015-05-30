
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , fs        = require('fs')
  , User      = mongoose.model('User')
  , Redis     = require("ioredis")
  , redisClient = new Redis({host:  process.env.NOURRITURE_REDIS_1_PORT_6379_TCP_ADDR || '127.0.0.1'})
  , auth      = require('../services/authentification')
  , log         = require('../services/log');
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
			  rData = {token: u.auth_token(), user: u.personal_information()}
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
 * Export router
 */

module.exports = router
