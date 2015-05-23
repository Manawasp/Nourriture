
/**
 * Static var
 */

var express     = require('express')
  , router      = express.Router()
  , fs          = require('fs')
  , mongoose    = require('mongoose')
  , User        = mongoose.model('User')
  , Ingredient  = mongoose.model('Ingredient')
  , Recipe      = mongoose.model('Recipe')
  , auth        = require('./services/authentification')
  , log         = require('./services/log')

/**
 * Super Var for label and denied in search request
 */

var epurArray = function(arr) {
  newArr = []
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].length > 2) {
      newArr.push(arr[i])
    }
  }
  return newArr
}

var matchBetweenArrays = function(arrays) {
  return arrays.shift().filter(function(v) {
    return arrays.every(function(a) {
        return a.indexOf(v) !== -1;
    });
  });
}

var  tabLabels = ['breakfast', 'brunch','diner','appetizer','dessert','healty','main','slow','quick', 'vegetarian','sauce','fruit','vegetable','sea','fish','spicy','meat']
var  tabDenied = ['arachide', 'egg','milk','halal','kascher']

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

var execAndAnswer = function(req, res, query) {
  console.log("Pas de requete ?")
  query.exec(function (err, recipes) {
    if (err) {
      console.log("Putian d'erruer ?")
      console.log(err)
      rData = {error: "recipes: f(router.post'/search')"}
      log.writeLog(req, "recipes", 500, rData)
      res.send(500, rData)
    } else {
      // Count the number of solution for this request (limit is deleted)
      query.count(function(err, c) {
        console.log("SEARCH NUMBER OF RESULTS : "+ c)
        data_recipes = []
        if (err) {
          rData = {error: "recipes: f(router.post'/search')"}
          log.writeLog(req, "recipes", 500, rData)
          res.send(500, rData)
        } else if (recipes) {
          for (var i = 0; i < recipes.length; i++) {
            data_recipes.push(recipes[i].information(auth.user_id()))
          }
        }
        rData = {recipes: data_recipes, limit: limit, offset: offset, size: data_recipes.length, max: c}
        log.writeLog(req, "recipes", 200, rData)
        res.send(200, rData)
      });
    }
  });
}

var searchCompleteQuery = function(req, res, params, query, elements) {
  offset = 0
  limit = 11
  console.log("search launched...")
  if (elements != undefined && elements.length > 0) {
    console.log("--BEFORE")
    console.log("ELEMENT: ")
    console.log(elements)
    console.log("LABELS DEF:")
    console.log(tabLabels)
    labels = matchBetweenArrays([elements, tabLabels])
    denied = matchBetweenArrays([elements, tabDenied])
    console.log("--AFTER")
    console.log("MATCH:")
    console.log(labels)
    console.log("ELEMENT: ")
    console.log(elements)
    console.log("LABELS DEF:")
    console.log(tabLabels)
  } else {
    denied = []
    labels = []
  }
  if (typeof params.offset == 'number' && params.offset > 0) {offset = params.offset}
  if (typeof params.limit == 'number' && params.limit > 0 && params.limit <= 31) {limit = params.limit}
  if (denied != undefined && denied.length > 0) {
    query.where('blacklist').nin(denied);
  }
  if (labels != undefined && labels.length > 0) {
    query.where('labels').in(labels);
  }
  // if (typeof params.country == 'string') {
  //   query.where('country').equals(params.country);
  // }
  if (typeof params.created_by == 'string') {
    query.where('created_by').equals(params.created_by);
  }
  query.skip(offset).limit(limit)
  execAndAnswer(req, res, query)
}

var searchInitQuery = function(req, res, params) {
  var r2query = undefined
  if (params.title) {
    elem = params.title.split(' ');
    elem = epurArray(elem);
    query = Recipe.find({});
    // .where('title').in(elem)
    // Search ingredient
    r2query = Ingredient.find({}).where('name').in(elem)
    r2query.exec(function (err, ingredients) {
      if (err) {
        searchCompleteQuery(req, res, params, query, elem)
      } else {
        console.log("Succes ingredients search :")
        console.log(ingredients)
        var ingr = []
        for (var i = 0; i < ingredients.length; i++) {
          ingr.push(ingredients[i]._id.toString())
        }
        console.log("ingr")
        console.log(ingr)
        if (ingr.length > 0) {

          query.where('ingredients').in(ingr);
        }
        searchCompleteQuery(req, res, params, query, elem)
      }
    });
  } else {
    query = Recipe.find({})
    searchCompleteQuery(req, res, params, query)
  }
}

router.post('/search', function(req, res){
  res.type('application/json');
  console.log("search init...")
  searchInitQuery(req, res, req.body)
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
      log.writeLog(req, "recipes", 400, rData)
      res.send(400, rData)
    }
    else {
      valid_create_recipe(recipe, req, res)
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
      show_recipe(recipe, req, res)
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "recipes", 404, rData)
      res.send(404, rData)
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
      if (auth.access_admin() || recipe.created_by == auth.user_id()) {
        error = recipe.update(req.body)
        if (error) {
          rData = {error: error}
          log.writeLog(req, "recipes", 400, rData)
          res.send(400, rData)
        }
        else {
          valid_create_recipe(recipe, req, res)
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
          fileName = recipe._id + (Math.floor((Math.random() * 10000) + 1)).toString() + "." +  req.body.extend
          fs.writeFile(__dirname + '/../public/pictures/recipes/' + fileName, new Buffer(req.body.picture, "base64"), function(err) {});
            recipe.image = "http://localhost:8080/pictures/recipes/" + fileName
            valid_create_recipe(recipe, req, res)
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

var valid_create_recipe = function(recipe, req, res) {
  recipe.save()
  show_recipe(recipe, req, res)
}

var show_recipe = function(recipe, req, res) {
  data_recipe = recipe.information(auth.user_id())
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
