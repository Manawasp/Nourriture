
/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')
  , Moment    = mongoose.model('Moment')
  , auth      = require('./services/authentification');

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
        res.send(400, {error: error})
      }
      else {
        moment.save()
        res.send(200, {success: 'you like the moment'})
      }
    }
    else {
      res.send(404, {error: 'resource not found'})
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
        res.send(400, {error: error})
      }
      else {
        moment.save()
        res.send(200, {success: 'you unlike the moment'})
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
