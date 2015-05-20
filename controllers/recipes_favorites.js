
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , Recipe    = mongoose.model('Recipe')
  , auth      = require('./services/authentification')
  , log       = require('./services/log');

/**
 * Router middleware
 */

router.use(function(req, res, next) {
  res.type('application/json');
  auth.verify(req.header('Auth-Token'), res, next)
})

/**
 * [POST] Search favorites
 */

router.post('/search', function(req, res){
  res.type('application/json');
  params = req.body
  offset = 0
  limit = 11
  query = Recipe.find({})
  if (typeof params.offset == 'number' && params.offset > 0) {offset = params.offset}
  if (typeof params.limit == 'number' && params.limit > 0 && params.limit <= 31) {limit = params.limit}
  query.where('likes').in([auth.user_id()])
  query.skip(offset).limit(limit)
  query.exec(function (err, recipes) {
    if (err) {
      rData = {error: "recipes: f(router.post'/favorites')"}
      log.writeLog(req, "favorites", 500, rData)
      res.send(500, rData)
    } else {
      query.count(function (err, c) {
        data_recipes = []
        if (err) {
          rData = {error: "recipes: f(router.post'/favorites')"}
          log.writeLog(req, "favorites", 500, rData)
          res.send(500, rData)
        }
        else if (recipes) {
          for (var i = 0; i < recipes.length; i++) {
            data_recipes.push(recipes[i].information(auth.user_id()))
          }
        }
        rData = {recipes: data_recipes, limit: limit, offset: offset, size: data_recipes.length, max: c}
        log.writeLog(req, "favorites", 200, rData)
        res.send(200, rData)
      });
    }
  });
})

/**
 * [POST] favorites Recipe
 */

router.post('/recipes/:rid', function(req, res){
  res.type('application/json');
  Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
    if (recipe) {
      error = recipe.like(auth.user_id())
      if (error) {
        rData = {error: error}
        log.writeLog(req, "recipesfavorites", 400, rData)
        res.send(400, rData)
      }
      else {
        recipe.save()
        rData = {success: 'you favorites the recipe'}
        log.writeLog(req, "recipesfavorites", 200, rData)
        res.send(200, rData)
      }
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "recipesfavorites", 404, rData)
      res.send(404, rData)
    }
  });
})

/**
 * [DELETE] Unlfavorites Recipe
 */

router.delete('/recipes/:rid', function(req, res){
  res.type('application/json');
  Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
    if (recipe) {
      error = recipe.unlike(auth.user_id())
      if (error) {
        rData = {error: error}
        log.writeLog(req, "recipesfavorites", 400, rData)
        res.send(400, rData)
      }
      else {
        recipe.save()
        rData = {success: 'you unfavorites the recipe'}
        log.writeLog(req, "recipesfavorites", 200, rData)
        res.send(200, rData)
      }
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "recipesfavorites", 404, rData)
      res.send(404, rData)
    }
  });
})

/**
 * Export router
 */

module.exports = router
