var jwt       = require('jsonwebtoken')
  , Redis     = require("ioredis")
  , redisClient = new Redis({host:  process.env.NOURRITURE_REDIS_1_PORT_6379_TCP_ADDR || '127.0.0.1'})
  , secret    = 'eyJmaXJzdG5hbWUiOiJDbG92aXMiLCJsYXN0bmF'
  , user_id   = null
  , user_hash = null
  , access_consumer     = false
  , access_supplier     = false
  , access_gastronomist = false
  , access_admin        = false
  redisClient.setMaxListeners(0);

exports.connected = function() {
  return (user_id != null)
}

exports.user_id = function() {
  return user_id
}

exports.user_hash = function() {
  return user_hash
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

exports.verify = function(token, res, next) {
  if (token == undefined) {
    res.send(401, {error: "you need to be connected"});
    return
  }
  else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.send(400, {error: err['message']});
        return
      }
      else {
        user_id   = decoded.id
        user_hash = decoded.salt
        // "LRANGE", idx, 0, -1
        redisClient.on("error", function (err) {
          console.log("Error " + err);
        });

        var ret = null
        redisClient.lrange("user:" + user_id + ":token", 0, -1, function (err, replies) {
            if (replies.length == 0) {
              res.send(401, {error: "token too old"});
            } else {
              var result = false
              replies.forEach(function (reply, i) {
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
                  if (!result) {
                    result = true
                    next()
                    return
                  }
                }
              });
              if (!result) {
                res.send(400, {error: "too old token"});
              }
            }
        });
      }
    });
  }
}
