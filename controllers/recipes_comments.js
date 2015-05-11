
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
  query = Comment.find({'ref_id': req.params.rid})
  offset = 0
  limit = 21
  if (typeof params.offset == 'number' && params.offset > 0) {offset = params.offset}
  if (typeof params.limit == 'number' && params.limit > 0 && params.limit <= 40) {limit = params.limit}
  query.skip(offset).limit(limit)
  query.exec(function (err, comments) {
    data_comment = []
    if (err) {
      rData = {error: "f(router.post'/search')"}
      log.writeLog(req, "recipesComments", 200, rData)
      res.send(500, rData)
    }
    else if (comments) {
      for (var i = 0; i < comments.length; i++) {
        data_comment.push(comments[i].information())
      }
    }
    rData = {comments: data_comment, limit: limit, offset: offset, size: data_comment.length}
    log.writeLog(req, "recipesComments", 200, rData)
    res.send(200, rData)
  });
})

/**
 * [POST] Recipes Comments Collection
 */

router.post('/:rid', function(req, res){
  res.type('application/json');
  Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
    if (recipe) {
      comment = new Comment;
      error = comment.create(req.body, auth.user_id(), recipe._id)
      if (error) {
        rData = {error: error}
        log.writeLog(req, "recipesComments", 200, rData)
        res.send(400, rData)
      }
      else {
        recipe.add_comment(comment._id)
        comment.save()
        show_comment(comment, res)
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
 * [GET] Recipes Comments
 */

router.get('/:rid/:mid', function(req, res){
  res.type('application/json');
  Comment.findOne({'_id': req.params.mid}, '', function(err, comment) {
    if (comment) {
      show_comment(comment, res)
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "recipesComments", 404, rData)
      res.send(404, rData)
    }
  });
})

/**
 * [UPDATE] Recipes Comments
 */

router.patch('/:rid/:mid', function(req, res){
  res.type('application/json');
  Comment.findOne({'_id': req.params.mid}, '', function(err, comment) {
    if (comment) {
      if (auth.user_id() == comment.created_by) {
        error = comment.update(req.body)
        if (error) {
          rData = {error: error}
          log.writeLog(req, "recipesComments", 400, rData)
          res.send(400, {error: error})
        } else {
          comment.save()
          show_comment(comment, res)
        }
      } else {
        rData = {error: "you don't have the permission"}
        log.writeLog(req, "recipesComments", 403, rData)
        res.send(403, rData)
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
 * [DELETE] Recipes Comments
 */

router.delete('/:rid/:mid', function(req, res){
  res.type('application/json');
  Comment.findOne({'_id': req.params.mid}, '', function(err, comment) {
    if (comment) {
      if (auth.user_id() == comment.created_by) {
        comment.remove()
        rData = {success: 'comment removed'}
        log.writeLog(req, "recipesComments", 200, rData)
        res.send(200, rData)
      } else {
        rData = {error: "you don't have the permission"}
        log.writeLog(req, "recipesComments", 403, rData)
        res.send(403, rData)
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

var show_comment = function(comment, res) {
  rData = comment.information()
  log.writeLog(req, "recipesComments", 200, rData)
  res.send(200, rData)
}
