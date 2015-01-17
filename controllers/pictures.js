/**
 * Static var
 */

var express   = require('express')
  , router    = express.Router()
  , fs        = require('fs')
  , auth      = require('./services/authentification')
  , multipart = require('connect-multiparty');
 
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
  url_img = req.files.file.path.split('/home/manawasp/node/Nourriture')[1]
  res.send(200, {'url': url_img})
})

module.exports = router