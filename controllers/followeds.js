
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
        res.send(200, followeds_data)
      });
    }
    else {res.send(404, {error: "resource not found"})}
  });
})

module.exports = router
