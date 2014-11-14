var jwt       = require('jsonwebtoken')
  , secret    = 'eyJmaXJzdG5hbWUiOiJDbG92aXMiLCJsYXN0bmF'
  , user_id   = null
  , access_consumer     = false
  , access_supplier     = false
  , access_gastronomist = false
  , access_admin        = false

exports.connected = function() {
  return (user_id != null)
}

exports.user_id = function() {
  return user_id
}

exports.access_gastronomist = function() {
  return access_gastronomist
}

exports.access_consumer = function() {
  return access_consumer
}

exports.access_supplier = function() {
  return access_supplier
}

exports.access_admin = function() {
  return access_admin
}

exports.verify = function(token) {
  if (token == undefined) {
    return {code: 401, json_value: {error: "you need to be connected"}};
  }
  else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        return {code: 400, json_value: {error: err['message']}};
      }
      else {
        user_id = decoded.id
        if (decoded.access) {
          if (decoded.access.indexOf('consumer') != -1) {access_consumer = true}
          if (decoded.access.indexOf('supplier') != -1) {access_supplier = true}
          if (decoded.access.indexOf('gastronomist') != -1) {access_gastronomist = true}
          if (decoded.access.indexOf('admin') != -1) {access_admin = true}
        }
      }
    });
  }
  return null
}