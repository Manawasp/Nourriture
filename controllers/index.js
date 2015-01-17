var express = require('express')
  , router = express.Router();

router.use('/users',        	require('./users'));
router.use('/followers',    	require('./followers'));
router.use('/followeds',    	require('./followeds'));
router.use('/sessions',     	require('./sessions'));
router.use('/ingredients',  	require('./ingredients'));
router.use('/moments',      	require('./moments'));
router.use('/recipes',      	require('./recipes'));
router.use('/comments/moments',	require('./moments_comments'));
router.use('/comments/recipes',	require('./recipes_comments'));
router.use('/like/recipes',   	require('./recipes_like'));
router.use('/like/moments',    	require('./moments_like'));
router.use('/pictures/',   		require('./pictures'));
router.use('/homepage/',   		require('./comrecipe'));

module.exports = router