var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comments = new Schema({
    comment     : String,
    likes       : [Schema.Types.ObjectId],
    created_by  : String,
    created_at  : Date,
    updated_at  : Date
});

mongoose.model('Comment', Comment);