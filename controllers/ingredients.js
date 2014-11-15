
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , Ingredient= mongoose.model('Ingredient')
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
 * [SEARCH] Ingredients Collection
 */

router.post('/search', function(req, res){
  console.log('[SEARCH] Ingredients');
  res.type('application/json');
  res.send(404, {error: 'non implemete'})
})

/**
 * [POST] Ingredients Collection
 */

router.post('/', function(req, res){
  console.log("[CREATE] Ingredients");
  res.type('application/json');
  if (auth.access_supplier()) {
    ingredient = new Ingredient;
    error = ingredient.create(req.body, auth.user_id())
    if (error) {
      res.send(400, {error: error})
    }
    else {
      uniqueness_ingredient(ingredient, res, valid_create_ingredient)
    }
  }
  else {
    res.send(403, {error: "you don't have the permission"});
  }
})

/**
 * [GET] Ingredients
 */

router.get('/:uid', function(req, res){
  console.log('[GET] Ingredients');
  Ingredient.findOne({'_id': req.params.uid}, '', function(err, ingredient) {
    if (ingredient) {
      res.send(200, ingredient.information())
    }
    else {
      res.send(404, {error: 'resource not found'})
    }
  });
})

/**
 * [UPDATE] Ingredients
 */

router.patch('/:uid', function(req, res){
  console.log('[UPDATE] Ingredients');
  res.type('application/json');
  if (auth.access_supplier()) {
    Ingredient.findOne({'_id': req.params.uid}, '', function(err, ingredient) {
      if (ingredient) {
        error = ingredient.update(req.body)
        if (error) {
          res.send(400, {error: error})
        }
        else {
          valid_create_ingredient(ingredient, res)
        }
      }
      else {
        res.send(404, {error: 'resource not found'})
      }
    });
  }
  else {
    res.send(403, {error: "you don't have the permission"});
  }
})

/**
 * [DELETE] Ingredients
 */

router.delete('/:uid', function(req, res){
  console.log('[DELETE] Ingredients');
  res.type('application/json');
  if (auth.access_supplier()) {
    Ingredient.findOne({'_id': req.params.uid}, '', function(err, ingredient) {
      if (ingredient) {
        ingredient.remove()
        res.send(200, {success: 'ingredient removed'})
      }
      else {
        res.send(404, {error: 'resource not found'})
      }
    });
  }
  else {
    res.send(403, {error: "you don't have the permission"});
  }
})

/**
 * Export router
 */

module.exports = router

/**
 * Private method
 */

 var uniqueness_ingredient = function(ingredient, res, callback) {
  Ingredient.findOne({'name': ingredient.name}, '', function(err, ingredient_data) {
    if (ingredient_data) {
      res.send(400, {error: 'this ingredient already exist'})
    }
    else {
      callback(ingredient, res)
    }
  });
 }

var valid_create_ingredient = function(ingredient, res) {
  ingredient.save()
  res.send(200, ingredient.information())
}