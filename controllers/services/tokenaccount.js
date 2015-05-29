var jwt       = require('jsonwebtoken')
  , Redis     = require("ioredis")
  , redisClient = new Redis()
  , secret    = 'eyJmaXJzdG5hbWUiOiJDbG92aXMiLCJsYXN0bmF'
  , userId   = null
  , userSalt 	= null
  redisClient.setMaxListeners(0);

exports.verify = function(req, res, password, token, callback) {
  jwt.verify(token, secret, function(err, decoded) {
    if (err) {
      callback(req, res, password, {status: 400, error: {error: err['message']}})
    }
    else {
      console.log(decoded)
      userId   	= decoded.id
      userSalt 	= decoded.salt
      // "LRANGE", idx, 0, -1
      redisClient.on("error", function (err) {
        console.log("Error " + err);
      });

      var ret = null
      redisClient.lrange("user:" + userId + ":account", 0, -1, function (err, replies) {
          if (replies.length == 0) {
            return {error: 401, error: {error: "token too old"}}
          }
          else {
            var result = false
            replies.forEach(function (reply, i) {
              if (reply == userSalt && !result) {
                result = true
                callback(req, res, password, {user_id: userId, salt: userSalt});
                return
              }
            });
            if (!result) {
              callback(req, res, password, {status: 400, error: {error: "already used token"}})
            }
          }
      });
    }
  });
}

exports.deleteHash = function(userId, salt) {
  console.log("ID: "+ userId)
  console.log("SALT: "+ salt)

	redisClient.lrem("user:" + userId + ":account", 0, salt, function() {
	});
}
