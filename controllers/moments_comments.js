
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User');
 
/**
 * [SEARCH] Moments Comments Collection
 */

router.get('/', function(req, res){
  console.log('[SEARCH] Moments Comments');
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [POST] Moments Comments Collection
 */

router.post('/', function(req, res){
  console.log("[CREATE] Moments Comments");
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [GET] Moments Comments
 */

router.get('/:uid', function(req, res){
  console.log('[GET] Moments Comments');
  // res.type('application/json');
  // res.send(200, usersResponse);
  res.json({ message: 'hooray! welcome to our api!' }); 
})

/**
 * [UPDATE] Moments Comments
 */

router.patch('/:uid', function(req, res){
    console.log('[UPDATE] Moments Comments');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * [DELETE] Moments Comments
 */

router.delete('/:uid', function(req, res){
    console.log('[DELETE] Moments Comments');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * Export router
 */

module.exports = router