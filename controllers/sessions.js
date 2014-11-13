
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

router.get('/', function(req, res){
  console.log('[CREATE] Session');
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [DELETE] Deconnect an user
 */

router.post('/', function(req, res){
  console.log("[POST] Sessions");
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * Export router
 */

module.exports = router