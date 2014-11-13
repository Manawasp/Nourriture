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

var Moment = new Schema({
    title       : String,
    description : String,
    typemoment  : String,
    share       : [Schema.Types.ObjectId],
    ingredients : [Schema.Types.ObjectId],
    recipes     : [Schema.Types.ObjectId],
    users       : [Schema.Types.ObjectId],
    comments    : [Comments],
    likes       : [Schema.Types.ObjectId],
    created_by  : [Schema.Types.ObjectId],
    created_at  : Date,
    updated_at  : Date
});

mongoose.model('Moment', Moment);