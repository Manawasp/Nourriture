var express = require('express')
  , router = express.Router();

router.use('/users',        require('./users'));
router.use('/followers',    require('./followers'));
router.use('/sessions',     require('./sessions'));
router.use('/ingredients',  require('./ingredients'));
router.use('/moments',      require('./moments'));
router.use('/recipes',      require('./recipes'));
router.use('/moments/:mid/like',    require('./moments_like'));
router.use('/moments/:mid/comments',require('./moments_comments'));
router.use('/comments/recipes/',	require('./recipes_comments'));
router.use('/like/recipes/',   require('./recipes_like'));


module.exports = router