var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var random = require('mongoose-random');

var Review = new Schema({
  mark          : Number,
  userId        : String,
  comment       : String
})

var Recipe = new Schema({
    title       : String,
    description : String,
    ingredients : [String],
    people      : Number,
    image       : String,
    reviews     : [Review],
    mark        : Number,
    hours       : Number,
    minutes     : Number,
    steps       : [String],
    parts       : String,
    comments    : [String],
    likes       : [String],
    labels      : [String],
    blacklist   : [String],
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
          validate_array(params.labels,       "labels")       ||
          validate_array(params.blacklist,    "blacklist");
  if (error) {
    return error
  }
  else {
    this.title        = params.title
    this.description  = params.description || ""
    this.image        = params.image || ""
    this.ingredients  = params.ingredients || []
    this.people       = params.people || 0
    this.likes        = []
    this.reviews      = []
    this.mark         = 0
    this.steps        = params.steps      || []
    this.labels       = params.labels     || []
    this.blacklist    = params.blacklist  || []
    this.created_by   = user_id
    this.created_at   = new Date
    this.updated_at   = new Date

    /* INIT OBJ TABLE */

    this.parts      = ""
    this.hours      = 0
    this.minutes    = 0

    /* RECIPE PARTS (currently 1 limited) */

    if (params.parts) {
      this.parts = params.parts
    }

    /* RECIPE DURATION : TOTAL */

    if (params.time_total != undefined) {
      if (params.time_total.m != undefined) {
        this.minutes = params.time_total.m
      }
      if (params.time_total.h != undefined) {
        this.hours  = params.time_total.h
      }
    }

    /* RECIPE DURATION : PREPARATION */

    return null
  }
}

Recipe.methods.update = function(params) {
  error = validate_title(params.title)                        ||
          validate_array(params.ingredients,  "ingredients")  ||
          validate_array(params.labels,       "labels")       ||
          validate_array(params.steps,        "steps")        ||
          validate_array(params.blacklist,    "blacklist");
  if (error) {
    return error
  }
  else {
    this.image        = params.image        || this.image
    this.title        = params.title        || this.title
    this.description  = params.description  || this.description
    this.ingredients  = params.ingredients  || this.ingredients
    this.steps        = params.steps        || this.steps
    this.people       = params.people       || this.people
    this.labels       = params.labels       || this.labels
    this.blacklist    = params.blacklist    || this.blacklist
    this.updated_at   = new Date

    if (params.time_total != undefined) {
      if (params.time_total.m != undefined) {
        this.minutes = params.time_total.m
      }
      if (params.time_total.h != undefined) {
        this.hours  = params.time_total.h
      }
    }

    if (params.parts) {
      this.parts = params.parts
    }

    return null
  }
}

/**
 * Review Method
 */

Recipe.methods.calcMark = function() {
  mark = 0
  n = 0
  while (n < this.reviews.length) {
    mark += this.reviews[n].mark;
    n++;
  }
  this.mark = mark / n;
}

Recipe.methods.addReview = function(userId, mark, comment) {
  // Create or update ?
  for (var i = 0; i < this.reviews.length; i++) {
    if (this.reviews[i].userId == userId) {
      // Update review
      this.reviews[i].comment = comment;
      this.reviews[i].mark = mark;
      return {success: "Review updated"};
    }
  }
  // Create review
  this.reviews.push({userId: userId, mark: mark, comment: comment});
  return {success: "Review added"};
}

Recipe.methods.removeReview = function(userId) {
  // Create or update ?
  for (var i = 0; i < this.reviews.length; i++) {
    if (this.reviews[i].userId == userId) {
      this.reviews.splice(i, 1)
      return {success: "Review removed"};
    }
  }
  return {error: "Review not found"};
}

/**
 * Like Method
 */

Recipe.methods.like = function(user_id) {
  if (this.likes.indexOf(user_id) != -1) {
    return "you already favorites this recipe"
  } else {
    this.likes.push(user_id)
    return null
  }
}

Recipe.methods.unlike = function(user_id) {
  index_tab = this.likes.indexOf(user_id)
  if (index_tab == -1) {
    return "you don't favorites this recipe"
  } else {
    this.likes.splice(index_tab, 1)
    return null
  }
}

/**
 * Get information
 */

Recipe.methods.information = function(user_id) {
  user_like = false
  if (user_id != undefined && this.likes.indexOf(user_id) != -1) {user_like = true}
  return {id:           this._id,
          image:        this.image,
          title:        this.title,
          description:  this.description,
          ingredients_length:  this.ingredients.length,
          labels:       this.labels,
          blacklist:    this.blacklist,
          mark:         this.mark,
          likes:        this.likes.length,
          liked:        user_like,
          reviews:      this.reviews.length,
          people:       this.people,
          steps:        this.steps,
          parts:        this.parts,
          hours:        this.hours,
          minutes:      this.minutes,
          created_at:   this.created_at,
          updated_at:   this.updated_at}
}

Recipe.plugin(random, { path: 'r' });

var r = mongoose.model('Recipe', Recipe);

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
