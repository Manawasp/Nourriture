var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Media = new Schema({
    url         : String,
    size        : Number,
    format      : String,
    created_at  : Date,
    updated_at  : Date
});

var Comments = new Schema({
    comment     : String,
    likes       : [Schema.Types.ObjectId],
    created_by  : [Schema.Types.ObjectId],
    created_at  : Date,
    updated_at  : Date
});

var Recipe = new Schema({
    title       : String,
    description : String,
    ingredients : [Schema.Types.ObjectId],
    time        : Number,
    video       : [Media],
    pictures    : [Media],
    comments    : [Comments],
    likes       : [Schema.Types.ObjectId],
    savours     : [String],
    country     : [String],
    created_by  : [Schema.Types.ObjectId],
    created_at  : Date,
    updated_at  : Date
});

mongoose.model('Recipe', Recipe);