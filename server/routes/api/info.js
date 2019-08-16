const router = require('express').Router();
const client = require('../../redis');

router.get('/', (req, res) => {
  client.info((err, serverInfo) => {
    if (err) {
      console.error('error: ', err);
      throw 'error occur: ' + err;
    }

    console.log('server info\n', serverInfo);
    res.json(parseServerInfo(serverInfo));
  });
});


parseServerInfo = serverInfo => {
  const lines = serverInfo.trim().split('\r\n');

  let currentKey = '';
  const infoJson = {};

  for (const line of lines) {
    if (!line) {
      continue;
    }

    if (line.startsWith('#')) {
      currentKey = line.substring(2);

      if (!infoJson[currentKey]) {
        infoJson[currentKey] = {};
      }

      continue;
    }

    const pair = line.split(':');
    console.log('currentKey, pair: ', currentKey, pair);
    infoJson[currentKey][pair[0].trim()] = pair[1].trim();
  }

  console.log('json: ', infoJson);
  return infoJson;
}

module.exports = router;