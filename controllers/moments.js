
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , auth      = require('./services/authentification');
 
/**
 * [SEARCH] Moments
 */

router.get('/', function(req, res){
  console.log('[SEARCH] Moment');
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [POST] Moments
 */

router.post('/', function(req, res){
  console.log("[CREATE] Moment");
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [GET] Moments
 */

router.get('/:mid', function(req, res){
  console.log('[GET] Moment');
  // res.type('application/json');
  // res.send(200, usersResponse);
  res.json({ message: 'hooray! welcome to our api!' }); 
})

/**
 * [UPDATE] Moments
 */

router.patch('/:mid', function(req, res){
    console.log('[UPDATE] Moment');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * [DELETE] Moments
 */

router.delete('/:mid', function(req, res){
    console.log('[DELETE] Moment');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * Export router
 */

module.exports = router