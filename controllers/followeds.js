
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
 * [GET] Retrieve Followeds list
 */

router.get('/:uid', function(req, res){
  res.type('application/json');
  User.findOne({'_id': req.params.uid}, '', function (err, user_cible) {
    if (user_cible) {
      followeds_data = []
      User.find({'_id': {$in: user_cible.followeds}}, '', function (err, users) {
        if (users) {
          for (var i = 0; i < users.length; i++) {
            followeds_data.push(users[i].information())
          }
        }
        log.writeLog(req, "followeds", 200, followeds_data)
        res.send(200, followeds_data)
      });
    }
    else {
      rData = {error: "resource not found"}
      log.writeLog(req, "followeds", 404, rData)
      res.send(404, rData)}
  });
})

module.exports = router
