var jwt       = require('jsonwebtoken')
  , secret    = 'eyJmaXJzdG5hbWUiOiJDbG92aXMiLCJsYXN0bmF'
  , user_id   = null;

exports.connected = function() {
  return (user_id != null)
}

exports.user_id = function() {
  return user_id
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
      }
    });
  }
  return null
}