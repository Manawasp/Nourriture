
/**
 * Static var
 */

var express     = require('express')
  , router      = express.Router()
  , fs          = require('fs')
  , mongoose    = require('mongoose')
  , User        = mongoose.model('User')
  , Ingredient  = mongoose.model('Ingredient')
  , Comment     = mongoose.model('Comment')
  , Recipe      = mongoose.model('Recipe')
  , auth        = require('./services/authentification')
  , log         = require('./services/log');

/**
 * Router middleware
 */

router.use(function(req, res, next) {
  res.type('application/json');
  auth.verify(req.header('Auth-Token'), res, next)
})

/**
 * [SEARCH] Recipes
 */

router.post('/search', function(req, res){
  res.type('application/json');
  res.type('application/json')
  params = req.body
  if (params.title) {
    var re = new RegExp(params.title, 'i');
    query = Recipe.find({'title': re})
  } else {
    query = Recipe.find({})
  }
  offset = 0
  limit = 11
  if (typeof params.offset == 'number' && params.offset > 0) {offset = params.offset}
  if (typeof params.limit == 'number' && params.limit > 0 && params.limit <= 31) {limit = params.limit}
  if (params.blacklist && Array.isArray(params.blacklist)) {
    query.where('blacklist').nin(params.blacklist);
  }
  if (params.labels && Array.isArray(params.labels)) {
    query.where('labels').in(params.labels);
  }
  if (params.ingredients && Array.isArray(params.ingredients)) {
    query.where('ingredients').in(params.ingredients);
  }
  if (params.savours && Array.isArray(params.savours)) {
    query.where('savours').in(params.savours);
  }
  if (typeof params.country == 'string') {
    query.where('country').equals(params.country);
  }
  if (typeof params.create_by == 'string') {
    query.where('create_by').equals(params.create_by);
  }
  query.skip(offset).limit(limit)
  query.exec(function (err, recipes) {
    data_recipes = []
    if (err) {
      rData = {error: "recipes: f(router.post'/search')"}
      log.writeLog(req, "recipes", 500, rData)
      res.send(500, rData)
    }
    else if (recipes) {
      for (var i = 0; i < recipes.length; i++) {
        data_recipes.push(recipes[i].information())
      }
    }
    rData = {recipes: data_recipes, limit: limit, offset: offset, size: data_recipes.length}
    log.writeLog(req, "recipes", 200, rData)
    res.send(200, rData)
  });
})

/**
 * [POST] Recipes
 */

router.post('/', function(req, res){
  res.type('application/json');
  if (auth.access_gastronomist()) {
    recipe = new Recipe;
    error = recipe.create(req.body, auth.user_id())
    if (error) {
      rData = {error: error}
      log.writeLog(req, "recipes", 200, rData)
      res.send(200, rData)
    }
    else {
      valid_create_recipe(recipe, res)
    }
  }
  else {
    rData = {error: "you don't have the permission"}
    log.writeLog(req, "recipes", 403, rData)
    res.send(403, rData);
  }
})

/**
 * [GET] Recipes
 */

router.get('/:rid', function(req, res){
  res.type('application/json');
  Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
    if (recipe) {
      show_recipe(recipe, res)
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "recipes", 200, rData)
      res.send(200, rData)
    }
  });
})

/**
 * [UPDATE] Recipes
 */

router.patch('/:rid', function(req, res){
  res.type('application/json');
  Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
    if (recipe) {
      if (auth.access_admin() || recipe.create_by == auth.user_id()) {
        error = recipe.update(req.body)
        if (error) {
          rData = {error: error}
          log.writeLog(req, "recipes", 400, rData)
          res.send(400, rData)
        }
        else {
          valid_create_recipe(recipe, res)
        }
      }
      else {
        rData = {error: "you don't have the permission"}
        log.writeLog(req, "recipes", 403, rData)
        res.send(403, rData);
      }
    }
    else {
      rData = {error: "you don't have the permission"}
      log.writeLog(req, "recipes", 404, rData)
      res.send(404, {error: 'resource not found'})
    }
  });
})

/**
 * [DELETE] Recipes
 */

router.delete('/:rid', function(req, res){
  res.type('application/json');
  Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
    if (recipe) {
      if (auth.access_admin() || recipe._id == auth.user_id()) {
        // Comment.find({'_id': recipe.comments}).remove()
        recipe.remove()
        rData = {success: 'recipe removed'}
        log.writeLog(req, "recipes", 200, rData)
        res.send(200, rData)
      }
      else {
        rData = {error: "you don't have the permission"}
        log.writeLog(req, "recipes", 403, rData)
        res.send(403, rData);
      }
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "recipes", 404, rData)
      res.send(404, rData)
    }
  });
})

/**
 * [POST] Upload Picture
 */

router.post('/:rid/pictures', function(req, res){
 res.type('application/json');
 Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
   if (recipe) {
     if (auth.access_admin() || recipe._id == auth.user_id()) {
        if (req.body.extend == "jpg" || req.body.extend == "png" && req.body.picture != undefined) {
          fs.writeFile(__dirname + '/../public/pictures/recipes/' + recipe._id + "." +  req.body.extend, new Buffer(req.body.picture, "base64"), function(err) {});
            recipe.image = "http://localhost:8080/pictures/recipes/" + recipe._id + "." +  req.body.extend
            valid_create_recipe(recipe, res)
        } else {
          res.send(400, {error: "bad type, only png and jpg are supported"})
        }
     }
     else {
       res.send(403, {error: "you don't have the permission"});
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

/**
 * Private method
 */

var valid_create_recipe = function(recipe, res) {
  recipe.save()
  show_recipe(recipe, res)
}

var show_recipe = function(recipe, res) {
  data_recipe = recipe.information()
  User.findOne({'_id': recipe.created_by}, '', function(err, user) {
    data_user = {}
    if (user) {
      data_user = user.information()
    }
    Ingredient.find({'_id': {$in: recipe.ingredients}}, '', function(err, ingredients) {
      data_ingredient = []
      if (ingredients) {
        for (var i = 0; i < ingredients.length; i++) {
          data_ingredient.push(ingredients[i].information())
        }
      }
      res.send(200, {user: data_user, ingredients: data_ingredient, recipe: data_recipe})
    });
  });
}
