
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , Recipe    = mongoose.model('Recipe')
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
 * [POST] Like Moment
 */

router.post('/:rid', function(req, res){
  res.type('application/json');
  Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
    if (recipe) {
      error = recipe.like(auth.user_id())
      if (error) {
        res.send(400, {error: error})
      }
      else {
        recipe.save()
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

router.delete('/:rid', function(req, res){
  res.type('application/json');
  Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
    if (recipe) {
      error = recipe.unlike(auth.user_id())
      if (error) {
        res.send(400, {error: error})
      }
      else {
        recipe.save()
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
