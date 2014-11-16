var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Comment = new Schema({
    comment     : String,
    ref_id      : String,
    created_by  : String,
    created_at  : Date,
    updated_at  : Date
});

/**
 * Public Method
 */

Comment.methods.create = function(params, user_id, ref_id) {
  error = exist_comment(params.comment)  ||
          validate_comment(params.comment);
  if (error) {
    return error
  }
  else {
    this.comment    = params.comment
    this.ref_id     = ref_id
    this.created_by = user_id
    this.created_at = new Date
    this.updated_at = new Date
    return null
  }
}

Comment.methods.update = function(params) {
  error = validate_comment(params.comment)
  if (error) {
    return error
  }
  else {
    this.comment = params.comment || this.comment
    this.updated_at = new Date
    return null
  }
}

/**
 * Get information
 */

Comment.methods.information = function() {
  return {id:           this._id,
          comment:      this.comment,
          created_by:   this.created_by,
          created_at:   this.created_at,
          updated_at:   this.updated_at}
}

mongoose.model('Comment', Comment);

/**
 * Private Method
 */

var exist_comment = function(comment) {
  if (comment == null || comment == undefined) {
    return "comment is empty"
  }
  return null;
}

var validate_comment = function(comment) {
  if (comment == null || comment == undefined) {
    return null
  }
  else if (comment.length < 3) {
    return "comment contain at least 3 characters"
  }
  return null
}