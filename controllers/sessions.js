
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User');

/**
 * [POST] Connect an user
 */

router.post('/', function(req, res){
  res.type('application/json');
  if (req.body.email && req.body.password) {
    User.findOne({'email': req.body.email}, '', function (err, user_cible) {
      if (user_cible) {
        if (user_cible.check_password(req.body.password)) {
          res.send(200, {token: user_cible.auth_token(), user: user_cible.personal_information()})
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