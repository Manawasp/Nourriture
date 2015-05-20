var mongoose = require('mongoose');

require('./models/user')
require('./models/comment')
require('./models/ingredient')
require('./models/moment')
require('./models/recipe')

// var Comment = new Schema({
// 	    username : String,
// 	    content  : String,
// 	    created  : Date
// 	});


var envDB       = (process.env.MONGO_1_PORT_27017_TCP_ADDR || 'localhost')
console.log('mongodb://'+ envDB +'/foodapi')
mongoose.connect('mongodb://'+ envDB +'/foodapi');

var Ingredient 	= mongoose.model('Ingredient');
var Moment 	= mongoose.model('Moment');
var Recipe 	= mongoose.model('Recipe');
var User 	= mongoose.model('User');


// console.log(Ingredient);
// console.log(Moment);
// console.log(Recipe);
// console.log(User);
