var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Media = new Schema({
    url         : String,
    size        : Number,
    format      : String,
    created_at  : Date,
    updated_at  : Date
});

var Recipe = new Schema({
    title       : String,
    description : String,
    ingredients : [String],
    estimate    : Number,
    video       : [Media],
    pictures    : [Media],
    comments    : [String],
    likes       : [String],
    savours     : [String],
    labels      : [String],
    blacklist   : [String],
    country     : String,
    city        : String,
    created_by  : String,
    created_at  : Date,
    updated_at  : Date
});

/**
 * Public Method
 */

Recipe.methods.create = function(params, user_id) {
  error = exist_title(params.title)                            ||
          validate_title(params.title)                         ||
          validate_array(params.ingredients,  "ingredients")  ||
          validate_array(params.savours,      "savours")      ||
          validate_array(params.labels,       "labels")       ||
          validate_array(params.blacklist,    "blacklist");
  if (error) {
    return error
  }
  else {
    this.title        = params.title
    this.description  = params.description || ""
    this.ingredients  = params.ingredients || []
    this.estimate     = params.estimate || 0
    this.video        = []
    this.pictures     = []
    this.likes        = []
    this.comments     = []
    this.savours      = params.savours    || []
    this.labels       = params.labels     || []
    this.blacklist    = params.blacklist  || []
    this.country      = params.country    || ""
    this.city         = params.city       || ""
    this.created_by   = user_id
    this.created_at   = new Date
    this.updated_at   = new Date
    return null
  }
}

Recipe.methods.update = function(params) {
  error = validate_title(params.title)                         ||
          validate_array(params.ingredients,  "ingredients")  ||
          validate_array(params.savours,      "savours")      ||
          validate_array(params.labels,       "labels")       ||
          validate_array(params.blacklist,    "blacklist");
  if (error) {
    return error
  }
  else {
    this.title        = params.title        || this.title
    this.description  = params.description  || this.description
    this.ingredients  = params.ingredients  || this.ingredients
    this.estimate     = params.estimate     || this.estimate
    this.savours      = params.savour       || this.savours
    this.labels       = params.labels       || this.labels
    this.blacklist    = params.blacklist    || this.blacklist
    this.country      = params.country      || this.country
    this.city         = params.city         || this.city
    this.updated_at   = new Date
    return null
  }
}

/**
 * Comments Method
 */

Recipe.methods.add_comments = function(comment_id) {
  this.comments.push(comment_id)
  return null
}

Recipe.methods.remove_comments = function(comment_id) {
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

Recipe.methods.like = function(user_id) {
  if (this.likes.indexOf(user_id) != -1) {
    return "you already like this recipe"
  } else {
    this.likes.push(user_id)
    return null
  }
}

Recipe.methods.unlike = function(user_id) {
  index_tab = this.likes.indexOf(user_id)
  if (index_tab == -1) {
    return "you don't like this recipe"
  } else {
    this.likes.splice(index_tab, 1)
    return null
  }
}

/**
 * Get information
 */

Recipe.methods.information = function() {
  return {id:           this._id,
          title:        this.title,
          description:  this.description,
          estimate:     this.estimate,
          savours:      this.savours,
          labels:       this.labels,
          blacklist:    this.blacklist,
          country:      this.country,
          city:         this.city,
          likes:        this.likes.length,
          comments:     this.comments.length,
          created_at:   this.created_at,
          updated_at:   this.updated_at}
}

mongoose.model('Recipe', Recipe);

/**
 * Private Method
 */

var exist_title = function(title) {
  if (title == null || title == undefined) {
    return "title is undefined"
  }
  return null;
}

var validate_title = function(title) {
  if (title == null || title == undefined) {
    return null
  }
  else if (title.length < 2) {
    return "title contain at least 2 characters"
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