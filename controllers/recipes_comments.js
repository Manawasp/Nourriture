
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User');
 
/**
 * [SEARCH] Recipes Comments Collection
 */

router.get('/', function(req, res){
  console.log('[SEARCH] Recipes Comments');
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [POST] Recipes Comments Collection
 */

router.post('/', function(req, res){
  console.log("[CREATE] Recipes Comments");
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [GET] Recipes Comments
 */

router.get('/:uid', function(req, res){
  console.log('[GET] Recipes Comments');
  // res.type('application/json');
  // res.send(200, usersResponse);
  res.json({ message: 'hooray! welcome to our api!' }); 
})

/**
 * [UPDATE] Recipes Comments
 */

router.patch('/:uid', function(req, res){
    console.log('[UPDATE] Recipes Comments');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * [DELETE] Recipes Comments
 */

router.delete('/:uid', function(req, res){
    console.log('[DELETE] Recipes Comments');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * Export router
 */

module.exports = router