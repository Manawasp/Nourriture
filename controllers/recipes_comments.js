
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , Recipe    = mongoose.model('Recipe')
  , Comment   = mongoose.model('Comment')
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
 * [SEARCH] Recipes Comments Collection
 */

router.get('/', function(req, res){
  console.log('[SEARCH] Recipes Comments');
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [POST] Recipes Comments Collection
 */

router.post('/', function(req, res){
  console.log("[CREATE] Recipes Comments");
  res.type('application/json');
  Recipe.findOne({'_id': req.params.rid}, '', function(err, recipe) {
    if (recipe) {
      comment = new Comment;
      error = comment.create(req.body, auth.user_id())
      if (error) {
        res.send(400, {error: error})
      }
      else {
        recipe.add_comment(comment._id)
        comment.save()
        show_comment(comment)
      }
    }
    else {
      res.send(404, {error: 'resource not found'})
    }
  });
})

/**
 * [GET] Recipes Comments
 */

router.get('/:cid', function(req, res){
  console.log('[GET] Recipes Comments');
  res.type('application/json');
  Comment.findOne({'_id': req.params.cid}, '', function(err, comment) {
    if (comment) {
      show_comment(comment)
    }
    else {
      res.send(404, {error: 'resource not found'})
    }
  });
})

/**
 * [UPDATE] Recipes Comments
 */

router.patch('/:cid', function(req, res){
  console.log('[UPDATE] Recipes Comments');
  res.type('application/json');
  Comment.findOne({'_id': req.params.cid}, '', function(err, comment) {
    if (comment) {
      if (auth.user_id() == comment.created_by) {
        error = comment.update(req.body)
        if (error) {
          res.send(400, {error: error})
        } else {
          comment.save()
          show_comment(comment)
        }
      } else {
        res.send(403, {error: "you don't have the permission"})
      }
    }
    else {
      res.send(404, {error: 'resource not found'})
    }
  });
})

/**
 * [DELETE] Recipes Comments
 */

router.delete('/:cid', function(req, res){
  console.log('[DELETE] Recipes Comments');
  res.type('application/json');
  Comment.findOne({'_id': req.params.cid}, '', function(err, comment) {
    if (comment) {
      if (auth.user_id() == comment.created_by) {
        comment.remove()
        res.send(200, {success: 'comment removed'})
      } else {
        res.send(403, {error: "you don't have the permission"})
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

var show_comment = function(comment, res) {
  res.send(200, comment.information())
}