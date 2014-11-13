
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User');
 
/**
 * [SEARCH] Recipes
 */

router.get('/', function(req, res){
  console.log('[SEARCH] Recipes');
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [POST] Recipes
 */

router.post('/', function(req, res){
  console.log("[CREATE] Recipes");
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [GET] Recipes
 */

router.get('/:rid', function(req, res){
  console.log('[GET] Recipes');
  // res.type('application/json');
  // res.send(200, usersResponse);
  res.json({ message: 'hooray! welcome to our api!' }); 
})

/**
 * [UPDATE] Recipes
 */

router.patch('/:rid', function(req, res){
    console.log('[UPDATE] Recipes');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * [DELETE] Recipes
 */

router.delete('/:rid', function(req, res){
    console.log('[DELETE] Recipes');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * Export router
 */

module.exports = router