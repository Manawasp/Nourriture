
/**
 * Static var
 */

var express     = require('express')
  , router      = express.Router()
  , mongoose    = require('mongoose')
  , User        = mongoose.model('User')
  , Moment      = mongoose.model('Moment')
  , Recipe      = mongoose.model('Recipe')
  , Ingredient  = mongoose.model('Ingredient')
  , Comment     = mongoose.model('Comment')
  , auth        = require('./services/authentification');

/**
 * Router middleware
 */

router.use(function(req, res, next) {
  res.type('application/json');
  auth.verify(req.header('Auth-Token'), res, next)
})

/**
 * [SEARCH] Moments
 */

router.post('/search', function(req, res){
  res.type('application/json');
  params = req.body
  offset = 0
  limit = 5
  if (typeof params.user_id == 'string') {
    query = Moment.find({'created_by': params.user_id})
  }
  else {
    query = Moment.find({'created_by': auth.user_id()})
  }
  if (typeof params.offset == 'number' && params.offset > 0) {offset = params.offset}
  if (typeof params.limit == 'number' && params.limit > 0 && params.limit <= 10) {limit = params.limit}
  query.skip(offset).limit(limit)
  query.sort({created_at: 'desc'}).exec(function (err, moments) {
    var data_moment = []
    data_recipes = []
    if (err) {
      res.send(500, {error: "moment: f(router.post'/search')"})
    }
    else if (moments) {
      for (var i = 0; i < moments.length; i++) {
        data_moment.push(moments[i].information())
        if (moments[i].recipe) {
          try {
            console.log(mongoose.Types.ObjectId(moments[i].recipe))
            data_recipes.push(moments[i].recipe)
          }
          catch(err) {
          }
        }
      }
    }
    if (data_recipes.length == 0) {
      res.send(200, {moments: data_moment, limit: limit, offset: offset, size: data_moment.length})
    }
    else {
      Recipe.find({'_id': {$in: data_recipes}}, '', function(err, recipes) {
        if (err) {
          console.log(err)
        }
        else {
          for (var i = 0; i < recipes.length; i++) {
            for (var n = 0; n < data_moment.length; n++) {
              if (data_moment[n].recipe == recipes[i].id){
                data_moment[n].recipe = recipes[i].information()}
            }
          }
        }
        res.send(200, {moments: data_moment, limit: limit, offset: offset, size: data_moment.length})
      });
    }
  });
})

/**
 * [POST] Moments
 */

router.post('/', function(req, res){
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
  res.type('application/json');
  Moment.findOne({'_id': req.params.mid}, '', function(err, moment) {
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
  res.type('application/json');
  Moment.findOne({'_id': req.params.mid}, '', function(err, moment) {
    if (moment) {
      if (auth.user_id() == moment.created_by) {
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
  res.type('application/json');
  Moment.findOne({'_id': req.params.mid}, '', function(err, moment) {
    if (moment) {
      if (auth.user_id() == moment.created_by) {
        // Comment.find({'_id': moment.comments}).remove()
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
        res.send(200, {created_by: create_by,
                      ingredients: data_ingredient,
                      users: users_data,
                      moment: data_moment})
      });
    });
  });
}
