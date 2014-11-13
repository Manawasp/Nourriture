
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User');
 
/**
 * [SEARCH] Ingredients Collection
 */

router.get('/', function(req, res){
  console.log('[SEARCH] Ingredients');
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [POST] Ingredients Collection
 */

router.post('/', function(req, res){
  console.log("[CREATE] Ingredients");
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [GET] Ingredients
 */

router.get('/:uid', function(req, res){
  console.log('[GET] Ingredients');
  // res.type('application/json');
  // res.send(200, usersResponse);
  res.json({ message: 'Non implemente' }); 
})

/**
 * [UPDATE] Ingredients
 */

router.patch('/:uid', function(req, res){
    console.log('[UPDATE] Ingredients');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * [DELETE] Ingredients
 */

router.delete('/:uid', function(req, res){
    console.log('[DELETE] Ingredients');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * Export router
 */

module.exports = router