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
// console.log('mongodb://'+ envDB +'/foodapi')
// mongoose.connect('mongodb://'+ envDB +'/foodapi');

var tryConnection = function(count) {
	console.log("Try...")
	setTimeout(function(count) {
		try {
			console.log("Connection...")
			mongoose.connect('mongodb://'+ envDB +'/foodapi', function(err) {
			   if (err) {
					console.log(err)
					if (count > 0) {
						count = count - 1
						console.log("Try aggain : "+ count)
						tryConnection(count)
					}
				}
			});
		} catch (err) {
			console.log("Connection mongo fail...")
			if (count > 0) {
				tryConnection(count--)
			}
		}
	}, 1000)
}

tryConnection(20)

var Ingredient 	= mongoose.model('Ingredient');
var Moment 	= mongoose.model('Moment');
var Recipe 	= mongoose.model('Recipe');
var User 	= mongoose.model('User');


// console.log(Ingredient);
// console.log(Moment);
// console.log(Recipe);
// console.log(User);
