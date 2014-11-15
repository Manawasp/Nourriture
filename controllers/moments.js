
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
 * [SEARCH] Moments
 */

router.get('/', function(req, res){
  console.log('[SEARCH] Moment');
  res.type('application/json');
  res.send(200, {message: "Non implemete"});
})

/**
 * [POST] Moments
 */

router.post('/', function(req, res){
  console.log("[CREATE] Moment");
  res.type('application/json');
  moment = new Moment;
  error = moment.create(req.body, auth.user_id())
  if (error) {
    res.send(400, {error: error})
  }
  else {
    valid_create_moment(moment, res)
  }
})

/**
 * [GET] Moments
 */

router.get('/:mid', function(req, res){
  console.log('[GET] Moment');
  res.type('application/json');
  Moment.findOne({'_id': body.params.mid}, '', function(err, moment) {
    if (moment) {
      show_moment(moment, res)
    }
    else {
      res.send(404, {error: 'resource not found'})
    }
  });
})

/**
 * [UPDATE] Moments
 */

router.patch('/:mid', function(req, res){
  console.log('[UPDATE] Moment');
  res.type('application/json');
  Moment.findOne({'_id': body.params.mid}, '', function(err, moment) {
    if (moment) {
      if (auth.user_id() == moment.create_by) {
        error = moment.update(req.body)
        if (error) {
          res.send(400, {error: error})
        }
        else {
          valid_create_moment(moment, res)
        }
      }
      else {
        res.send(403, {error: "you don't have the permission"})
      }
    }
    else {
      res.send(404, {error: 'resource not found'})
    }
  });
})

/**
 * [DELETE] Moments
 */

router.delete('/:mid', function(req, res){
  console.log('[DELETE] Moment');
  res.type('application/json');
  Moment.findOne({'_id': body.params.mid}, '', function(err, moment) {
    if (moment) {
      if (auth.user_id() == moment.create_by) {
        Comment.find({'_id': moment.comments}).remove()
        moment.remove()
        res.send(200, {success: 'moment removed'})
      }
      else {
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

var valid_create_moment = function(moment, res) {
  moment.save()
  show_moment(moment, res)
  params = req.body
  if (typeof params.name == 'string') {
    var re = new RegExp(params.name, 'i');
    query = Ingredient.find({'name': re})
  } else {
    query = Ingredient.find()
  }
  offset = 0
  limit = 21
  if (typeof params.offset == 'number' && params.offset > 0) {offset = params.offset}
  if (typeof params.limit == 'number' && params.limit > 0) {limit = params.limit}
  if (params.blacklist && Array.isArray(params.blacklist)) {
    query.where('blacklist').nin(params.blacklist);
  }
  if (params.labels && Array.isArray(params.labels)) {
    query.where('labels').in(params.labels);
  }
  query.skip(offset).limit(limit)
  query.exec(function (err, ingredients) {
    data_ingredient = []
    if (err) {
      res.send(500, {error: "f(router.post'/search')"})
    }
    else if (ingredients) {
      for (var i = 0; i < ingredients.length; i++) {
        data_ingredient.push(ingredients[i].information())
      }
      res.send(404, {ingredients: data_ingredient})
    }
  });
}

var show_moment = function(moment, res) {
  data_moment = moment.information()
  User.findOne({'_id': moment.created_by}, '', function(err, user) {
    create_by = {}
    if (user) {
      create_by = user.information()
    }
    Ingredient.find({'_id': moment.ingredients}, '', function(err, ingredients) {
      data_ingredient = []
      if (ingredients) {
        for (var i = 0; i < ingredients.length; i++) {
          data_ingredient.push(ingredients[i].information())
        }
      }
      User.find({'_id': moment.users}, '', function(err, users) {
        users_data = []
        if (users) {
          for (var i = 0; i < users.length; i++) {
            users_data.push(users[i].information())
          }
        }
        res.send(200, {create_by: create_by, 
                      ingredients: data_ingredient,
                      users: users_data, 
                      moment: data_moment})
      });
    });
  });
}