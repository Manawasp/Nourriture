var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema;

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
    icon        : String,
    labels      : [String],
    blacklist   : [String],
    color       : String,
    created_by  : String,
    created_at  : Date,
    updated_at  : Date
});

/**
 * Public Method
 */

Ingredient.methods.create = function(params, user_id) {
  error = exist_name(params.name)                       ||
          validate_name(params.name)                    ||
          validate_array(params.labels, "labels")       ||
          validate_array(params.blacklist, "blacklist");
  if (error) {
    return error
  }
  else {
    this.name       = params.name
    this.image      = []
    this.icon       = ""
    this.color      = params.color || ""
    this.labels     = params.labels || []
    this.blacklist  = params.blacklist || []
    this.created_by = user_id
    this.created_at = new Date
    this.updated_at = new Date
    return null
  }
}

Ingredient.methods.update = function(params) {
  error = validate_name(params.name)                    ||
          validate_array(params.labels, "labels")       ||
          validate_array(params.blacklist, "blacklist");
  if (error) {
    return error
  }
  else {
    this.color      = params.color || ""
    this.name       = params.name || this.name
    this.labels     = params.labels || this.labels
    this.blacklist  = params.blacklist || this.blacklist
    this.updated_at = new Date
    return null
  }
}

/**
 * Get information
 */

Ingredient.methods.information = function() {
  return {id:         this._id,
          name:       this.name,
          image:      this.image,
          icon:       this.icon,
          color:      this.color,
          labels:     this.labels,
          blacklist:  this.blacklist}
}


mongoose.model('Ingredient', Ingredient);

/**
 * Private Method
 */

var exist_name = function(name) {
  if (name == null || name == undefined) {
    return "name is undefined"
  }
  return null;
}

var validate_name = function(name) {
  if (name == null || name == undefined) {
    return null
  }
  else if (name.length < 2) {
    return "name contain at least 2 characters"
  }
  return null
}

var validate_array = function(array_value, valeur) {
  if (array_value == null) {
    return null
  }
  else if (Array.isArray(array_value)) {
    return null
  }
  else {
    return (valeur + " must be an array")
  }
}