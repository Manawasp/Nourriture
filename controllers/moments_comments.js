
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , Moment    = mongoose.model('Moment')
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
 * [SEARCH] Moments Comments Collection
 */

router.post('/search', function(req, res){
  console.log('[SEARCH] Moments Comments');
  res.type('application/json');
  params = req.body
  query = Comment.find({'ref_id': req.params.mid})
  offset = 0
  limit = 21
  if (typeof params.offset == 'number' && params.offset > 0) {offset = params.offset}
  if (typeof params.limit == 'number' && params.limit > 0 && params.limit <= 40) {limit = params.limit}
  query.skip(offset).limit(limit)
  query.exec(function (err, comments) {
    data_comment = []
    if (err) {
      res.send(500, {error: "f(router.post'/search')"})
    }
    else if (comments) {
      for (var i = 0; i < comments.length; i++) {
        data_comment.push(comments[i].information())
      }
    }
    res.send(200, {comments: data_comment, limit: limit, offset: offset, size: data_comment.length})
  });
})

/**
 * [POST] Moments Comments Collection
 */

router.post('/', function(req, res){
  console.log("[CREATE] Moments Comments");
  res.type('application/json');
  Moment.findOne({'_id': req.params.mid}, '', function(err, moment) {
    if (moment) {
      comment = new Comment;
      error = comment.create(req.body, auth.user_id(), moment._id)
      if (error) {
        res.send(400, {error: error})
      }
      else {
        moment.add_comment(comment._id)
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
 * [GET] Moments Comments
 */

router.get('/:cid', function(req, res){
  console.log('[GET] Moments Comments');
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
 * [UPDATE] Moments Comments
 */

router.patch('/:cid', function(req, res){
  console.log('[UPDATE] Moments Comments');
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
 * [DELETE] Moments Comments
 */

router.delete('/:cid', function(req, res){
  console.log('[DELETE] Moments Comments');
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