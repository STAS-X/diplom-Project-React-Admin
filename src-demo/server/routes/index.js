const express = require('express');
const router = express.Router({mergeParams: true})

router.use('/auth', require('./auth.routes'));
router.use('/comments', require('./comment.routes'));
router.use('/tasks', require('./task.routes')); 
// router.use('/profession', require('./profession.routes'));
// router.use('/quality', require('./quality.routes'));
router.use('/users', require('./user.routes'));

module.exports = router;