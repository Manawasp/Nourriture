
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User');

/**
 * [POST] Like Moment
 */

router.post('/', function(req, res){
  console.log("[CREATE] Moments Like");
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [DELETE] Unlike Moment
 */

router.delete('/:uid', function(req, res){
    console.log('[DELETE] Moments Like');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * Export router
 */

module.exports = router