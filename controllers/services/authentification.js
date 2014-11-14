var jwt       = require('jsonwebtoken')
  , secret    = 'eyJmaXJzdG5hbWUiOiJDbG92aXMiLCJsYXN0bmF'
  , user_id   = null,
  , access_consumer     = false,
  , access_supplier     = false,
  , access_gastronomist = false;

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
          access_consumer = (decoded.access['consumer'] || false) && decoded.access['consumer'] == true
          access_supplier = (decoded.access['supplier'] || false) && decoded.access['supplier'] == true
          access_gastronomist = (decoded.access['gastronomist'] || false) && ecoded.access['gastronomist'] == true
        }
      }
    });
  }
  return null
}