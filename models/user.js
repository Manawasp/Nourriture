var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Media = new Schema({
    url         : String,
    size        : Number,
    format      : String,
    created_at  : Date,
    updated_at  : Date
});

var User = new Schema({
    pseudo      : String,
    firstname   : String,
    lastname    : String,
    email       : String,
    password    : String,
    access      : [String],
    followers   : [Schema.Types.ObjectId],
    followeds   : [Schema.Types.ObjectId],
    avatar      : [Media],
    created_at  : Date,
    updated_at  : Date
});

mongoose.model('User', User);