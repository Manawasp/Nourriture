
/**
 * Static var
 */

var express     = require('express')
  , router      = express.Router()
  , mongoose    = require('mongoose')
  , User        = mongoose.model('User')
  , Ingredient  = mongoose.model('Ingredient')
  , Comment     = mongoose.model('Comment')
  , Recipe      = mongoose.model('Recipe')
  , auth        = require('./services/authentification')
  , random    = require('mongoose-random');

/**
 * Router middleware
 */

 router.use(function(req, res, next) {
  res.type('application/json');
  auth.verify(req.header('Auth-Token'), res, next)
})


/**
 * [RANDOM] latest 4
 */

router.get('/latest', function(req, res){
  res.type('application/json');
  res.type('application/json')
  params = req.body
  Recipe.find().limit(4).exec(function (err, recipes) {
   data_recipes = []
    if (err) {
      res.send(500, {error: "recipes: f(router.post'/search')"})
    }
    else if (recipes) {
      for (var i = 0; i < recipes.length; i++) {
        data_recipes.push(recipes[i].information())
      }
    }
    res.send(200, {recipes: data_recipes, limit: 4, offset: 0, size: data_recipes.length})
  });
})

/**
 * [RANDOM] random 4
 */

router.get('/random', function(req, res){
  res.type('application/json');
  res.type('application/json')
  params = req.body
  Recipe.findRandom().limit(4).exec(function (err, recipes) {
   data_recipes = []
    if (err) {
      res.send(500, {error: "recipes: f(router.post'/search')"})
    }
    else if (recipes) {
      for (var i = 0; i < recipes.length; i++) {
        data_recipes.push(recipes[i].information())
      }
    }
    res.send(200, {recipes: data_recipes, limit: 4, offset: 0, size: data_recipes.length})
  });
})

/**
 * [RANDOM] month 4
 */

router.get('/month', function(req, res){
  res.type('application/json');
  res.type('application/json')
  params = req.body
  Recipe.findRandom().limit(4).exec(function (err, recipes) {
   data_recipes = []
    if (err) {
      res.send(500, {error: "recipes: f(router.post'/search')"})
    }
    else if (recipes) {
      for (var i = 0; i < recipes.length; i++) {
        data_recipes.push(recipes[i].information())
      }
    }
    res.send(200, {recipes: data_recipes, limit: 4, offset: 0, size: data_recipes.length})
  });
})

/**
 * [RANDOM] week 1
 */

router.get('/week', function(req, res){
  res.type('application/json');
  res.type('application/json')
  params = req.body
  Recipe.findRandom().limit(1).exec(function (err, recipes) {
   data_recipes = []
    if (err) {
      res.send(500, {error: "recipes: f(router.post'/search')"})
    }
    else if (recipes) {
      for (var i = 0; i < recipes.length; i++) {
        data_recipes.push(recipes[i].information())
      }
    }
    res.send(200, {recipes: data_recipes, limit: 1, offset: 0, size: data_recipes.length})
  });
})

/**
 * Export router
 */

module.exports = router
