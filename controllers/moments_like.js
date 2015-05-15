
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , Moment    = mongoose.model('Moment')
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
 * [POST] Like Moment
 */

router.post('/:mid', function(req, res){
  res.type('application/json');
  Moment.findOne({'_id': req.params.mid}, '', function(err, moment) {
    if (moment) {
      error = moment.like(auth.user_id())
      if (error) {
        rData = {error: error}
        log.writeLog(req, "momentsLike", 400, rData)
        res.send(400, rData)
      }
      else {
        moment.save()
        rData = {success: 'you like the moment'}
        log.writeLog(req, "momentsLike", 200, rData)
        res.send(200, rData)
      }
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "momentsLike", 404, rData)
      res.send(404, rData)
    }
  });
})

/**
 * [DELETE] Unlike Moment
 */

router.delete('/:mid', function(req, res){
  res.type('application/json');
  Moment.findOne({'_id': req.params.mid}, '', function(err, moment) {
    if (moment) {
      error = moment.unlike(auth.user_id())
      if (error) {
        rData = {error: error}
        log.writeLog(req, "momentsLike", 404, rData)
        res.send(400, rData)
      }
      else {
        moment.save()
        rData = {success: 'you unlike the moment'}
        log.writeLog(req, "momentsLike", 200, rData)
        res.send(200, rData)
      }
    }
    else {
      rData = {error: 'resource not found'}
      log.writeLog(req, "momentsLike", 404, rData)
      res.send(404, rData)
    }
  });
})

/**
 * Export router
 */

module.exports = router
