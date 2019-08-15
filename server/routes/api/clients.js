const router = require('express').Router();
const client = require('../../redis/client');

router.get('/', (req, res) => {
  client.client('LIST', (err, reply) => {
    if (err) {
      console.error('error', err);
      res.json({});
    }

    console.log('reply: ', reply);
    const clients = reply.trim().split('\n');

    const clientObjects = clients.map(client => {
      const clientObject = {};

      const keyValuePairs = client.split(' ');
      keyValuePairs.map(pair => {
        const kv = pair.split('=');
        clientObject[kv[0]] = kv[1];
      })
      return clientObject;
    });

    console.log('clientObjects: ', clientObjects);

    res.json(clientObjects);
  });
});

module.exports = router;
