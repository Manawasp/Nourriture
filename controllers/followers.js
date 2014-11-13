
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User');

/**
 * [POST] Follow an user
 */

router.post('/', function(req, res){
	console.log('create !');
    res.type('application/json');
    res.send(200, followersResponse);
})


/**
 * [GET] Retrieve Follower list
 */

router.get('/:uid', function(req, res){
	console.log('retrieve !');
    res.type('application/json');
    res.send(200, followersResponse);
})

/**
 * [DELETE] Delete an User follower
 */

router.post('/:uid', function(req, res){
	console.log('remove !');
    res.type('application/json');
    res.send(200, followersResponse);
})

module.exports = router