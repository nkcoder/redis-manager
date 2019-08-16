const router = require('express').Router();

router.use(function (req, res, next) {
  console.log('get request, url: %s, params: %s', req.url, JSON.stringify(req.params));
  next();
});

router.use('/api', require('./api'));

module.exports = router;

