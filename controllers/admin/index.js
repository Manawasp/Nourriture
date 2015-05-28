var express = require('express')
  , router = express.Router();

/**
 * Aplication route
 */

router.use('/users',        	  require('./users'));

/**
 * 404 no route catching
 */

notfound = function(req, res){
  res.send(404, {error: "route not found"});
}

router.post('*', notfound);
router.get('*', notfound);
router.put('*', notfound);
router.patch('*', notfound);
router.delete('*', notfound);

/**
 * Export module
 */

module.exports = router
