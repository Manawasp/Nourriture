var jwt       = require('jsonwebtoken')
  , redis     = require("redis")
  , redisClient = redis.createClient();
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
        user_id   = decoded.id
        user_hash = decoded.salt
        "LRANGE", idx, 0, -1
        client.lrange("users:"+user_id, function (err, replies) {
            console.log(replies.length + " replies:");
            replies.forEach(function (reply, i) {
              console.log("    " + i + ": " + reply);
              if (reply == user_hash) {
                if (decoded.access) {
                  if (decoded.access.indexOf('consumer') != -1) {
                    access_consumer = true
                  } else {access_consumer = false}
                  if (decoded.access.indexOf('supplier') != -1) {
                    access_supplier = true
                  } else {access_supplier = false}
                  if (decoded.access.indexOf('gastronomist') != -1) {
                    access_gastronomist = true
                  } else {access_gastronomist = false}
                  if (decoded.access.indexOf('admin') != -1) {
                    access_admin = true
                  } else {access_admin = false}
                }
                client.quit();
                return null;
              }
            });
            client.quit();
        });
        return {code: 401, json_value: {error: "token too old"}};
      }
    });
  }
}