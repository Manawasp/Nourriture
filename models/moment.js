var mongoose  = require('mongoose')
  , Schema    = mongoose.Schema;

var Moment = new Schema({
    description : String,
    shared      : Boolean,
    share_id    : String,
    ingredients : [Schema.Types.ObjectId],
    recipe      : String,
    users       : [Schema.Types.ObjectId],
    comments    : [Schema.Types.ObjectId],
    likes       : [Schema.Types.ObjectId],
    created_by  : String,
    created_at  : Date,
    updated_at  : Date
});

/**
 * Public Method
 */

Moment.methods.create = function(params, user_id) {
  error = exist_description(params.description)             ||
          validate_description(params.description)          ||
          validate_array(params.ingredients, "ingredients") ||
          validate_array(params.users, "users");
  if (error) {
    return error
  }
  else {
    this.description = params.description
    this.shared = false
    this.share_id = ""
    this.ingredients = params.ingredients || []
    this.users = params.users || []
    this.recipe = params.recipe || ""
    this.comments = []
    this.likes = []
    this.created_by = user_id
    this.created_at = new Date
    this.updated_at = new Date
    return null
  }
}

Moment.methods.update = function(params) {
  error = validate_description(params.description)          ||
          validate_array(params.ingredients, "ingredients") ||
          validate_array(params.users, "users");
  if (error) {
    return error
  }
  else {
    this.description = params.description || this.description
    this.ingredients = params.ingredients || this.ingredients
    this.users = params.users || this.users
    this.recipe = params.recipe || this.recipe
    this.updated_at = new Date
    return null
  }
}

/**
 * Comments Method
 */

Moment.methods.add_comment = function(comment_id) {
  this.comments.push(comment_id)
  return null
}

Moment.methods.remove_comment = function(comment_id) {
  index_tab = this.comments.indexOf(comment_id)
  if (index_tab == -1) {
    return "not found comment"
  } else {
    this.comments.splice(index_tab, 1)
    return null
  }
}

/**
 * Like Method
 */

Moment.methods.like = function(user_id) {
  if (this.likes.indexOf(user_id) != -1) {
    return "you already like this moment"
  } else {
    this.likes.push(user_id)
    return null
  }
}

Moment.methods.unlike = function(user_id) {
  index_tab = this.likes.indexOf(user_id)
  if (index_tab == -1) {
    return "you don't like this moment"
  } else {
    this.likes.splice(index_tab, 1)
    return null
  }
}

/**
 * Get information
 */

Moment.methods.information = function() {
  return {id:           this._id,
          description:  this.description,
          likes:        this.likes.length,
          comments:     this.comments.length,
          recipe:       this.recipe,
          created_at:   this.created_at,
          updated_at:   this.updated_at}
}

mongoose.model('Moment', Moment);

/**
 * Private Method
 */

var exist_description = function(description) {
  if (description == null || description == undefined) {
    return "description is empty"
  }
  return null;
}

var validate_description = function(description) {
  if (description == null || description == undefined) {
    return null
  }
  else if (description.length < 3) {
    return "description contain at least 3 characters"
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