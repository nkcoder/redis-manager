const router = require('express').Router();
const client = require('../../redis/client');

router.get('/', (req, res) => {
  client.info((err, serverInfo) => {
    console.log('server info\n', serverInfo);
    res.send(serverInfo);
  });
});

module.exports = router;