
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , Moment    = mongoose.model('Moment')
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
 * [SEARCH] Moments Comments Collection
 */

router.post('/:mid/search', function(req, res){
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
      rData = {error: "f(router.post'/search')"}
      log.writeLog(req, "momentsComments", 500, rData)
      res.send(500, rData)
    }
    else if (comments) {
      for (var i = 0; i < comments.length; i++) {
        data_comment.push(comments[i].information())
      }
    }
    rData = {comments: data_comment, limit: limit, offset: offset, size: data_comment.length}
    log.writeLog(req, "momentsComments", 200, rData)
    res.send(200, rData)
  });
})

/**
 * [POST] Moments Comments Collection
 */

router.post('/:mid', function(req, res){
  res.type('application/json');
  Moment.findOne({'_id': req.params.mid}, '', function(err, moment) {
    if (moment) {
      comment = new Comment;
      error = comment.create(req.body, auth.user_id(), moment._id)
      if (error) {
        rData = {error: error}
        log.writeLog(req, "momentsComments", 400, rData)
        res.send(400, rData)
      }
      else {
        moment.add_comment(comment._id)
        comment.save()
        show_comment(comment, req, res)
      }
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "momentsComments", 404, rData)
      res.send(404, rData)
    }
  });
})

/**
 * [GET] Moments Comments
 */

router.get('/:mid/:cid', function(req, res){
  res.type('application/json');
  Comment.findOne({'_id': req.params.cid}, '', function(err, comment) {
    if (comment) {
      show_comment(comment, req, res)
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "momentsComments", 404, rData)
      res.send(404, rData)
    }
  });
})

/**
 * [UPDATE] Moments Comments
 */

router.patch('/:mid/:cid', function(req, res){
  res.type('application/json');
  Comment.findOne({'_id': req.params.cid}, '', function(err, comment) {
    if (comment) {
      if (auth.user_id() == comment.created_by) {
        error = comment.update(req.body)
        if (error) {
          rData = {error: error}
          log.writeLog(req, "momentsComments", 400, rData)
          res.send(400, rData)
        } else {
          comment.save()
          show_comment(comment, req, res)
        }
      } else {
        rData = {error: "you don't have the permission"}
        log.writeLog(req, "momentsComments", 403, rData)
        res.send(403, rData)
      }
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "momentsComments", 404, rData)
      res.send(404, rData)
    }
  });
})

/**
 * [DELETE] Moments Comments
 */

router.delete('/:mid/:cid', function(req, res){
  res.type('application/json');
  Comment.findOne({'_id': req.params.cid}, '', function(err, comment) {
    if (comment) {
      if (auth.user_id() == comment.created_by) {
        comment.remove()
        rData = {success: 'comment removed'}
        log.writeLog(req, "momentsComments", 200, rData)
        res.send(200, rData)
      } else {
        rData = {error: "you don't have the permission"}
        log.writeLog(req, "momentsComments", 403, rData)
        res.send(403, rData)
      }
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "momentsComments", 404, rData)
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
  log.writeLog(req, "momentsComments", 200, rData)
  res.send(200, rData)
}
