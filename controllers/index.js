var express = require('express')
  , router = express.Router();

router.use('/users',        require('./users'));
router.use('/followers',    require('./followers'));
router.use('/sessions',     require('./sessions'));
router.use('/ingredients',  require('./ingredients'));
router.use('/moments',      require('./moments'));
router.use('/recipes',      require('./recipes'));
// router.use('/comments/:cid/like',   require('./comments_like'));
router.use('/moments/:mid/like',    require('./moments_like'));
router.use('/moments/:mid/comments',require('./moments_comments'));
router.use('/recipes/:mid/comments',require('./recipes_comments'));

module.exports = router