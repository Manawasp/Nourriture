
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
  console.log("[CREATE] Recipe Like");
  res.type('application/json');
  Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
    if (recipe) {
      error = recipe.like(auth_user_id())
      if (error) {
        res.send(400, {error: error})
      }
      else {
        res.send(200, {success: 'you like the recipe'})
      }
    }
    else {
      res.send(404, {error: 'resource not found'})
    }
  });
})

/**
 * [DELETE] Unlike Moment
 */

router.delete('/', function(req, res){
  console.log('[DELETE] Recipe Like');
  res.type('application/json');
  Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
    if (recipe) {
      error = recipe.unlike(auth_user_id())
      if (error) {
        res.send(400, {error: error})
      }
      else {
        res.send(200, {success: 'you unlike the recipe'})
      }
    }
    else {
      res.send(404, {error: 'resource not found'})
    }
  });
})

/**
 * Export router
 */

module.exports = router