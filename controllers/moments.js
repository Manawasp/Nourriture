
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
  // res.type('application/json');
  // res.send(200, usersResponse);
  res.json({ message: 'hooray! welcome to our api!' }); 
})

/**
 * [UPDATE] Moments
 */

router.patch('/:mid', function(req, res){
    console.log('[UPDATE] Moment');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
})

/**
 * [DELETE] Moments
 */

router.delete('/:mid', function(req, res){
    console.log('[DELETE] Moment');
    res.type('application/json');
    res.send(200, {message: "Non implemete"});
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
        res.send(200, {create_by: create_by, 
                      ingredients: data_ingredient,
                      users: users_data, 
                      moment: data_moment})
      });
    });
    //     res.send(200, {user: data_user, ingredients: data_ingredient, moment: data_recipe})
    // }
  });
}