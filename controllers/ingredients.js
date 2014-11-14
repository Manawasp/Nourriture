
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , auth      = require('./services/authentification');
  
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