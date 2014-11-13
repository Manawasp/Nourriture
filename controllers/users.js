
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User');
 
/**
 * [SEARCH] User Collection
 */

router.get('/', function(req, res){
  console.log('search !');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * [POST] User Collection
 */

router.post('/', function(req, res){
  console.log('create !');
  console.log("[POST] User");
  console.log(req.params);
  console.log(req.body.username);
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [GET] User
 */

router.get('/:uid', function(req, res){
  console.log('retrieve !');
    // res.type('application/json');
    // res.send(200, usersResponse);
  res.json({ message: 'hooray! welcome to our api!' }); 
})

/**
 * [UPDATE] User
 */

router.patch('/:uid', function(req, res){
  console.log('update !');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * [DELETE] User
 */

router.delete('/:uid', function(req, res){
  console.log('remove !');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * Export router
 */

module.exports = router