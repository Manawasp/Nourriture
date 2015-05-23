
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , Recipe    = mongoose.model('Recipe')
  , Comment   = mongoose.model('Comment')
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
 * [SEARCH] Recipes Comments Collection
 */

router.post('/:rid/search', function(req, res){
  res.type('application/json');
  params = req.body
  Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
    if (recipe) {
      offset = 0
      limit = 21
      if (typeof params.offset == 'number' && params.offset > 0) {offset = params.offset}
      if (typeof params.limit == 'number' && params.limit > 0 && params.limit <= 40) {limit = params.limit}
      reviews = [];
      n = offset;
      while (n < recipe.reviews.length && reviews.length < limit) {
        reviews.push(recipe.reviews[n]);
        n++;
      }
      rData = {reviews: reviews, limit: limit, offset: offset, size: reviews.length, max: recipe.reviews.length}
      log.writeLog(req, "recipesReviews", 200, rData)
      res.send(200, rData)
    } else {
      rData = {error: "Recipe not found"}
      log.writeLog(req, "recipesReviews", 404, rData)
      res.send(404, rData)
    }
  });
})

/**
 * [POST] Recipes Comments Collection
 */

router.post('/:rid', function(req, res){
  res.type('application/json');
  params = req.body
  Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
    if (recipe) {
      if (params.mark == undefined || params.comment == undefined) {
        rData = {error: "bad parameter"}
        log.writeLog(req, "recipesComments", 400, rData)
        res.send(400, rData)
      } else if (params.mark < 0 || params.mark > 5) {
        rData = {error: "mark should be betweem 0 and 5"}
        log.writeLog(req, "recipesReviews", 400, rData)
        res.send(400, rData)
      } else {
        rData = recipe.addReview(auth.user_id(), params.mark, params.comment)
        recipe.calcMark()
        recipe.save()
        log.writeLog(req, "recipesReviews", 200, rData)
        res.send(200, rData)
      }
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "recipesComments", 404, rData)
      res.send(404, rData)
    }
  });
})

/**
 * [DELETE] Recipes Review
 */

router.delete('/:rid', function(req, res){
  res.type('application/json');
  params = res.body
  Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
    if (recipe) {
      if (params.userId != undefined) {
        rDara = recipe.removeReview(params.userId)
        if (rData.error == undefined) {
          recipe.save()
          log.writeLog(req, "recipesComments", 200, rData)
          res.send(200, rData)
        } else {
          log.writeLog(req, "recipesComments", 404, rData)
          res.send(404, rData)
        }
      } else {
        rData = {error: "bad parameters"}
        log.writeLog(req, "recipesReviews", 400, rData)
        res.send(400, rData)
      }
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "recipesComments", 200, rData)
      res.send(404, rData)
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

var show_comment = function(comment, req, res) {
  rData = comment.information()
  log.writeLog(req, "recipesComments", 200, rData)
  res.send(200, rData)
}
