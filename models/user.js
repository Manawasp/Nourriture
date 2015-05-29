var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , jwt = require('jsonwebtoken')
  , secret = 'eyJmaXJzdG5hbWUiOiJDbG92aXMiLCJsYXN0bmF';

var User = new Schema({
    pseudo      : String,
    firstname   : String,
    lastname    : String,
    email       : String,
    password    : String,
    salt        : String,
    access      : [String],
    followers   : [String],
    followeds   : [String],
    avatar      : String,
    created_at  : Date,
    updated_at  : Date
});

/**
 * Public Method
 */

User.methods.createSalt = function() {
  this.salt       = crypto.createHash('md5').update((new Date().toString() + mongoose.Types.ObjectId() + "#salt")).digest("hex");
  return this.salt
}

User.methods.create_by_email = function(params) {
  error = exist_pseudo(params.pseudo)     || validate_pseudo(params.pseudo)  ||
          exist_email(params.email)       || validate_email(params.email)    ||
          exist_password(params.password) || validate_password(params.password);
  if (error) {
    return error
  }
  this.pseudo     = params.pseudo
  this.firstname  = params.firstname  || ""
  this.lastname   = params.lastname   || ""
  this.email      = params.email
  this.followers  = []
  this.followeds  = []
  this.avatar     = "/images/avatar.jpg"
  this.password   = crypto.createHash('md5').update(params.password).digest("hex");
  this.salt       = crypto.createHash('md5').update((new Date().toString() + mongoose.Types.ObjectId())).digest("hex");
  this.access     = ['consumer']
  if (this.pseudo == "superadmin") {
    this.access     = ['consumer', 'supplier', 'admin', 'gastronomist']
  }
  this.created_at = new Date
  this.updated_at = new Date
  return null
}

User.methods.new_salt = function() {
  this.salt       = crypto.createHash('md5').update((new Date().toString() + mongoose.Types.ObjectId())).digest("hex");
}

User.methods.update_information = function(params) {
  error = validate_pseudo(params.pseudo)  ||
          validate_email(params.email)    ||
          validate_password(params.password);
  if (error) {
    return error
  }
  // if (params.pseudo == "") {
    this.pseudo     = params.pseudo || this.pseudo
  // }
  this.firstname  = params.firstname  || this.firstname
  this.lastname   = params.lastname   || this.lastname
  this.email      = params.email      || this.email
  if (params.password) {
    this.password = crypto.createHash('md5').update(params.password).digest("hex");
    this.salt       = crypto.createHash('md5').update((new Date().toString() + mongoose.Types.ObjectId())).digest("hex");
  }
  this.updated_at = new Date
  return null
}

User.methods.update_access = function(data) {
  result = {consumer: true, supplier: false, gastronomist: false, admin: true};
  newArray = []
  // INIT ACCESS DATA
  for (var i = 0; i < this.access.length; i++) {
    if (this.access[i] == "supplier") {
      result.supplier = true;
    } else if (this.access[i] == "gastronomist") {
      result.gastronomist = true;
    } else if (this.access[i] == "admin") {
      result.admin = true;
    }
  }
  // UDPATE ACCESS DATA
  if (data.supplier != undefined) {
    result.supplier = data.supplier;
  } else if (data.cooker != undefined) {
    result.gastronomist = data.cooker;
  } else if (data.admin != undefined) {
    result.admin = data.admin;
  }
  // BUILD DATA IN USER
  this.access.length = 0
  if (result.admin == true) {
    newArray.push("admin");
  }
  if (result.gastronomist == true) {
    newArray.push("gastronomist")
  }
  if (result.supplier == true) {
    newArray.push("supplier")
  }
  if (result.consumer == true) {
    newArray.push("consumer")
  }
  this.access = newArray
}

User.methods.check_password = function(password) {
  return (this.password == crypto.createHash('md5').update(password).digest("hex"))
}

/**
 * Get information
 */

User.methods.personal_information = function() {
  return {id:         this._id,
          pseudo:     this.pseudo,
          firstname:  this.firstname,
          lastname:   this.lastname,
          avatar:     this.avatar,
          email:      this.email,
          access:     this.access,
          created_at: this.created_at,
          updated_at: this.updated_at}
}

User.methods.information = function() {
  return {id:         this._id,
          pseudo:     this.pseudo,
          avatar:     this.avatar,
          access:     this.access,
          created_at: this.created_at,
          updated_at: this.updated_at}
}

/**
 * Authentification Method
 */

User.methods.auth_token = function() {
  return (jwt.sign({id: this._id, salt: this.salt, access: this.access}, secret));
}

/**
 * Create JWT token
 */


 User.methods.tokenResetPassword = function(salt) {
   return (jwt.sign({id: this._id, salt: salt, date: Date()}, secret));
 }

/**
 * Followers methods
 */

User.methods.follow = function(user_id) {
  if (this.followers.indexOf(user_id) != -1) {
    return "already in your followers"
  } else {
    this.followers.push(user_id)
    return null
  }
}

User.methods.followed_by = function(user_id) {
  if (this.followeds.indexOf(user_id) != -1) {
    return "already followed by you"
  } else {
    this.followeds.push(user_id)
    return null
  }
}

User.methods.unfollow = function(user_id) {
  index_tab = this.followers.indexOf(user_id)
  if (index_tab == -1) {
    return "isn't in your followers"
  } else {
    this.followers.splice(index_tab, 1)
    return null
  }
}

User.methods.unfollowed_by = function(user_id) {
  index_tab = this.followeds.indexOf(user_id)
  if (index_tab == -1) {
    return "he isn't followed by you"
  } else {
    this.followeds.splice(index_tab, 1)
    return null
  }
}

User = mongoose.model('User', User);

/**
 * Private Method
 */

var exist_pseudo = function(pseudo) {
  if (pseudo == undefined || pseudo == null) {
    return "pseudo is undefined"
  }
  return null
}

var validate_pseudo = function(pseudo) {
  filter = /^\w+$/
  if (pseudo == undefined || pseudo == null) {
    return null
  }
  else if (pseudo.length < 3) {
    return "pseudo contain at least 3 characters"
  }
  else if (!filter.test(pseudo)) {
    return "pseudo must contain only letters, numbers and underscores"
  }
  return null
}

var exist_email = function(email) {
  if (email == undefined || email == null) {
    return "email is undefined"
  }
  return null
}

var validate_email = function(email) {
  filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
  if (email == undefined || email == null) {
    return null
  }
  else if (!filter.test(email)) {
    return "email must be validate email"
  }
  return null
}

var exist_password = function(password) {
  if (password == undefined || password == null) {
    return "password is undefined"
  }
  return null
}

var validate_password = function(password) {
  if (password == undefined || password == null) {
    return null
  }
  else if(password.length < 6) {
    return "password must contain at least 6 characters"
  }
  else if (!/[0-9]/.test(password)) {
    return "password must contain at least one number (0-9)"
  }
  else if (!/[a-z]/.test(password)) {
    return "password must contain at least one lowercase letter (a-z)"
  }
  else if (!/[A-Z]/.test(password)) {
    return "password must contain at least one uppercase letter (A-Z)"
  }
  return null
}
