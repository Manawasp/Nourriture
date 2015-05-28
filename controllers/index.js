var express = require('express')
  , router = express.Router();

/**
 * Aplication route
 */
// router.use('/followers',    	  require('./followers'));
// router.use('/followeds',    	  require('./followeds'));
// router.use('/moments',      	  require('./moments'));
// router.use('/comments/moments',	require('./moments_comments'));
// router.use('/like/moments',    	require('./moments_like'));

router.use('/users',        	  require('./users'));
router.use('/sessions',     	  require('./sessions'));
router.use('/ingredients',  	  require('./ingredients'));
router.use('/recipes',      	  require('./recipes'));
router.use('/reviews/recipes',	require('./recipes_reviews'));
router.use('/favorites',        require('./recipes_favorites'));
router.use('/pictures/',   		  require('./pictures'));
router.use('/homepage/',   		  require('./comrecipe'));

// Admin access
router.use('/admin', require('./admin'));

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
