
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User');

/**
 * [POST] Like Comment
 */

router.post('/', function(req, res){
  console.log("[CREATE] Comments Like");
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [DELETE] Unlike Comment
 */

router.delete('/:uid', function(req, res){
    console.log('[DELETE] Comments Like');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * Export router
 */

module.exports = router