/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , fs        = require('fs')
  , auth      = require('./services/authentification')
  , multipart = require('connect-multiparty')
  , log         = require('./services/log');

/**
 * Router middleware
 */

router.use(function(req, res, next) {
  next()
})

/**
 * [POST] Upload new picture
 */

var multipartMiddleware = multipart({uploadDir: __dirname +'/../public/pictures' });

router.post('/', multipartMiddleware, function(req, res) {
  url_img = req.files.file.path.split('/home/manawasp/node/Nourriture/public/pictures')[1]
  rData = {'url': url_img}
  log.writeLog(req, "pictures", 404, rData)
  res.send(200, {'url': url_img})
})

module.exports = router
