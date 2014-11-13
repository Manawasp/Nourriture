var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Media = new Schema({
    url         : String,
    size        : Number,
    format      : String,
    created_at  : Date,
    updated_at  : Date
});

var Ingredient = new Schema({
    name        : String,
    image       : [Media],
    icon        : [Media],
    labels      : [String],
    blacklist   : [String],
    created_by  : [Schema.Types.ObjectId],
    created_at  : Date,
    updated_at  : Date
});

mongoose.model('Ingredient', Ingredient);