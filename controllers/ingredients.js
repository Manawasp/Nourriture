
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , fs        = require('fs')
  , User      = mongoose.model('User')
  , Ingredient= mongoose.model('Ingredient')
  , auth      = require('./services/authentification')
  , log         = require('./services/log');

/**
 * Router middleware
 */

router.use(function(req, res, next) {
  if (req.path == '/search') {
    next()
  } else {
    res.type('application/json');
    auth.verify(req.header('Auth-Token'), res, next)
  }
})


/**
 * [SEARCH] Ingredients Collection
 */

router.post('/search', function(req, res){
  res.type('application/json')
  params = req.body
  if (typeof params.name == 'string') {
    var re = new RegExp(params.name, 'i');
    query = Ingredient.find({'name': re})
  } else {
    query = Ingredient.find({})
  }
  offset = 0
  limit = 21
  if (typeof params.offset == 'number' && params.offset > 0) {offset = params.offset}
  if (typeof params.limit == 'number' && params.limit > 0 && params.limit <= 40) {limit = params.limit}
  if (params.blacklist && Array.isArray(params.blacklist)) {
    query.where('blacklist').nin(params.blacklist);
  }
  if (params.labels && Array.isArray(params.labels)) {
    query.where('labels').in(params.labels);
  }
  query.skip(offset).limit(limit)
  // Apply the request
  query.exec(function(err, ingredients) {
    if (err) {
      rData = {error: "f(router.post'/search'in count)"}
      log.writeLog(req, "ingredients", 500, rData)
      res.send(500, rData)
    } else {
      // Count the number of solution for this request (limit is deleted)
      query.count(function(err, c) {
        data_ingredient = []
        if (err) {
          rData = {error: "f(router.post'/search'in count)"}
          log.writeLog(req, "ingredients", 500, rData)
          res.send(500, rData)
        } else if (ingredients) {
          for (var i = 0; i < ingredients.length; i++) {
            data_ingredient.push(ingredients[i].information())
          }
        }
        rData = {ingredients: data_ingredient, limit: limit, offset: offset, size: data_ingredient.length, max: c}
        log.writeLog(req, "ingredients", 200, rData)
        res.send(200, rData)
      });
    }
  });
})

/**
 * [POST] Ingredients Collection
 */

router.post('/', function(req, res){
  res.type('application/json');
  if (auth.access_supplier() == true) {
    ingredient = new Ingredient;
    error = ingredient.create(req.body, auth.user_id())
    if (error) {
      rData = {error: error}
      log.writeLog(req, "ingredients", 400, rData)
      res.send(400, rData)
    }
    else {
      uniqueness_ingredient(ingredient, req, res, valid_create_ingredient)
    }
  }
  else {
    rData = {error: "you don't have the permission"}
    log.writeLog(req, "ingredients", 403, rData)
    res.send(403, rData);
  }
})

/**
 * [GET] Ingredients
 */

router.get('/:uid', function(req, res){
  Ingredient.findOne({'_id': req.params.uid}, '', function(err, ingredient) {
    if (ingredient) {
      rData = ingredient.information()
      log.writeLog(req, "ingredients", 200, rData)
      res.send(200, rData)
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "ingredients", 404, rData)
      res.send(404, rData)
    }
  });
})

/**
 * [UPDATE] Ingredients
 */

router.patch('/:uid', function(req, res){
  res.type('application/json');
  if (auth.access_supplier()) {
    Ingredient.findOne({'_id': req.params.uid}, '', function(err, ingredient) {
      if (ingredient) {
        error = ingredient.update(req.body)
        if (error) {
          rData = {error: error}
          log.writeLog(req, "ingredients", 400, rData)
          res.send(400, rData)
        }
        else {
          valid_create_ingredient(ingredient, req, res)
        }
      }
      else {
        rData = {error: 'resource not found'}
        log.writeLog(req, "ingredients", 404, rData)
        res.send(404, rData)
      }
    });
  }
  else {
    rData = {error: "you don't have the permission"}
    log.writeLog(req, "ingredients", 403, rData)
    res.send(403, rData);
  }
})

/**
 * [DELETE] Ingredients
 */

router.delete('/:uid', function(req, res){
  res.type('application/json');
  if (auth.access_supplier()) {
    Ingredient.findOne({'_id': req.params.uid}, '', function(err, ingredient) {
      if (ingredient) {
        ingredient.remove()
        rData = {success: 'ingredient removed'}
        log.writeLog(req, "ingredients", 200, rData)
        res.send(200, rData)
      }
      else {
        rData = {error: 'resource not found'}
        log.writeLog(req, "ingredients", 404, rData)
        res.send(404, rData)
      }
    });
  }
  else {
    rData = {error: "you don't have the permission"}
    log.writeLog(req, "ingredients", 403, rData)
    res.send(403, rData);
  }
})

/**
 * [POST] Upload picture
 */

router.post('/:uid/pictures', function(req, res){
  res.type('application/json');
  if (auth.access_supplier()) {
    Ingredient.findOne({'_id': req.params.uid}, '', function(err, ingredient) {
      if (ingredient) {
        if (req.body.extend == "jpg" || req.body.extend == "png" && req.body.picture != undefined) {
          fileName = ingredient._id + (Math.floor((Math.random() * 10000) + 1)).toString() + "." +  req.body.extend
          fs.writeFile(__dirname + '/../public/pictures/ingredients/' + fileName, new Buffer(req.body.picture, "base64"), function(err) {});
            ingredient.icon = "http://localhost:8080/pictures/ingredients/" + fileName
          valid_create_ingredient(ingredient, req, res)
        } else {
          rData = {error: "bad type, only png and jpg are supported"}
          log.writeLog(req, "ingredients", 400, rData)
          res.send(400, rData)
        }
      }
      else {
        rData = {error: 'resource not found'}
        log.writeLog(req, "ingredients", 400, rData)
        res.send(400, rData)
      }
    });
  }
  else {
    rData = {error: "you don't have the permission"}
    log.writeLog(req, "ingredients", 403, rData)
    res.send(403, rData);
  }
})

/**
 * Export router
 */

module.exports = router

/**
 * Private method
 */

 var uniqueness_ingredient = function(ingredient, req, res, callback) {
  Ingredient.findOne({'name': ingredient.name}, '', function(err, ingredient_data) {
    if (ingredient_data) {
      rData = {error: 'this ingredient already exist'}
      log.writeLog(req, "ingredients", 400, rData)
      res.send(400, rData)
    }
    else {
      callback(ingredient, req, res)
    }
  });
 }

var valid_create_ingredient = function(ingredient, req, res) {
  ingredient.save()
  rData = ingredient.information()
  log.writeLog(req, "ingredients", 200, rData)
  res.send(200, rData)
}
