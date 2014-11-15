
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , Recipe    = mongoose.model('Recipe');
 
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