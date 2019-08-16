const router = require('express').Router();

router.use('/info', require('./info'));
router.use('/clients', require('./clients'));
router.use('/database', require('./database'));

module.exports = router;