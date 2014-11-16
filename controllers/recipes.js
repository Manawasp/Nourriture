
/**
 * Static var
 */

var express     = require('express')
  , router      = express.Router()
  , mongoose    = require('mongoose')
  , User        = mongoose.model('User')
  , Ingredient  = mongoose.model('Ingredient')
  , Comment      = mongoose.model('Comment')
  , Recipe      = mongoose.model('Recipe')
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
 * [SEARCH] Recipes
 */

router.post('/search', function(req, res){
  res.type('application/json');
  res.type('application/json')
  params = req.body
  if (typeof params.title == 'string') {
    var re = new RegExp(params.title, 'i');
    query = Recipe.find({'title': re})
  } else {
    query = Recipe.find({})
  }
  offset = 0
  limit = 11
  if (typeof params.offset == 'number' && params.offset > 0) {offset = params.offset}
  if (typeof params.limit == 'number' && params.limit > 0 && params.limit <= 21) {limit = params.limit}
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
      res.send(500, {error: "recipes: f(router.post'/search')"})
    }
    else if (recipes) {
      for (var i = 0; i < recipes.length; i++) {
        data_recipes.push(recipes[i].information())
      }
    }
    res.send(200, {recipes: data_recipes, limit: limit, offset: offset, size: data_recipes.length})
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
      res.send(400, {error: error})
    }
    else {
      valid_create_recipe(recipe, res)
    }
  }
  else {
    res.send(403, {error: "you don't have the permission"});
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
      res.send(404, {error: 'resource not found'})
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
          res.send(400, {error: error})
        }
        else {
          valid_create_recipe(recipe, res)
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
 * [DELETE] Recipes
 */

router.delete('/:rid', function(req, res){
  res.type('application/json');
  Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
    if (recipe) {
      if (auth.access_admin() || recipe._id == auth.user_id()) {
        // Comment.find({'_id': recipe.comments}).remove()
        recipe.remove()
        res.send(200, {success: 'recipe removed'})
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
    Ingredient.find({'_id': recipe.ingredients}, '', function(err, ingredients) {
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