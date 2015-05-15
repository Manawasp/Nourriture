
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , Recipe    = mongoose.model('Recipe')
  , auth      = require('./services/authentification')
  , log         = require('./services/log');

/**
 * Router middleware
 */

router.use(function(req, res, next) {
  res.type('application/json');
  auth.verify(req.header('Auth-Token'), res, next)
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
        rData = {error: error}
        log.writeLog(req, "recipesLike", 400, rData)
        res.send(400, rData)
      }
      else {
        recipe.save()
        rData = {success: 'you like the recipe'}
        log.writeLog(req, "recipesLike", 200, rData)
        res.send(200, rData)
      }
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "recipesLike", 404, rData)
      res.send(404, rData)
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
        rData = {error: error}
        log.writeLog(req, "recipesLike", 400, rData)
        res.send(400, rData)
      }
      else {
        recipe.save()
        rData = {success: 'you unlike the recipe'}
        log.writeLog(req, "recipesLike", 200, rData)
        res.send(200, rData)
      }
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "recipesLike", 404, rData)
      res.send(404, rData)
    }
  });
})

/**
 * Export router
 */

module.exports = router
