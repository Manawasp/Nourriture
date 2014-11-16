var express = require('express')
  , router = express.Router();

router.use('/users',        require('./users'));
router.use('/followers',    require('./followers'));
router.use('/sessions',     require('./sessions'));
router.use('/ingredients',  require('./ingredients'));
router.use('/moments',      require('./moments'));
router.use('/recipes',      require('./recipes'));
router.use('/recipes/:rid/like',   require('./recipes_like'));
router.use('/moments/:mid/like',    require('./moments_like'));
router.use('/moments/:mid/comments',require('./moments_comments'));
router.use('/comments/recipes/',	require('./recipes_comments'));

module.exports = router