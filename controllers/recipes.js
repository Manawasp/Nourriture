
/**
 * Static var
 */

var express     = require('express')
  , router      = express.Router()
  , mongoose    = require('mongoose')
  , User        = mongoose.model('User')
  , Ingredient  = mongoose.model('Ingredient')
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

router.get('/', function(req, res){
  console.log('[SEARCH] Recipes');
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [POST] Recipes
 */

router.post('/', function(req, res){
  console.log("[CREATE] Recipes");
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
  console.log('[GET] Recipes');
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
  console.log('[UPDATE] Recipes');
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
  console.log('[DELETE] Recipes');
  res.type('application/json');
  Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
    if (recipe) {
      if (auth.access_admin() || recipe._id == auth.user_id()) {
        Comment.find('_id': recipe.comments).remove()
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