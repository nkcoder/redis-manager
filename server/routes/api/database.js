const client = require('../../redis');
const router = require('express').Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

const DEFAULT_PAGE_SIZE = 10;

router.get('/keys', (req, res) => {
  let cursor = req.query.cursor;
  if (!cursor) {
    cursor = 0;
  }

  client.scan(cursor, 'COUNT', DEFAULT_PAGE_SIZE, (_, reply) => {
    console.log('cursor: %s, database reply: %s', cursor, reply);

    res.json(
      {
        'cursor': reply[0],
        'keys': reply[1]
      }
    )
  });

});

router.get('/search', (req, res) => {
  const pattern = `*${req.query.key}*`;
  const cursor = req.query.cursor;

  if (!cursor) {
    cursor = 0;
  }

  client.scan(cursor, 'MATCH', pattern, 'COUNT', DEFAULT_PAGE_SIZE, (err, reply) => {
    if (err) {
      console.log('err: ', err);
      res.json({});
      return;
    }
    console.log('cursor: %i, match: %s, reply: %s', cursor, pattern, reply);
    res.json(
      {
        'cursor': reply[0],
        'keys': reply[1]
      }
    );
  })

})

router.get('/type', (req, res) => {
  const key = req.query.key;

  client.type(key, (_, reply) => {
    console.log('get type for key: %s, type: %s', key, reply);
    res.json({ type: reply.toUpperCase() });
  });

})

router.get('/value', (req, res) => {
  const key = req.query.key;
  const cursor = req.query.cursor;

  client.type(key, (_, reply) => {
    console.log('key: %s, reply: %s', key, reply);
    const type = reply;

    switch (type) {
      case 'none':
        handleNotExistKey(key, res);
        break;
      case 'string':
        fetchString(key, res);
        break;
      case 'list':
        fetchList(key, res);
        break;
      case 'set':
        fetchSet(key, cursor, res);
        break;
      case 'hash':
        fetchHash(key, cursor, res);
        break;
      case 'zset':
        fetchZSet(key, cursor, res);
        break;
      default:
        throw type;
    }

  });

})

router.put('/expire', (req, res) => {
  const { key, seconds } = req.body;

  client.expire(key, seconds, (_, reply) => {
    console.log('expire key: %s, seconds: %i, reply: %s', key, seconds, reply);
    return res.json({ code: reply });
  })
})

router.delete('/delete', (req, res) => {
  const keys = req.query.keys;

  client.del(keys, (_, reply) => {
    console.log("delete key: %s, reply: %s", keys, reply);
    return res.json({ deleted: reply });
  })
})

router.get('/ttl', (req, res) => {
  const key = req.query.key;

  client.ttl(key, (_, reply) => {
    console.log('ttl for key: %s, reply: %i', key, reply);
    return res.json({ 'ttl': reply });
  })
})

handleNotExistKey = (key, res) => {
  console.warn('key: %s not exist', key);
  res.json({});
}

fetchString = (key, res) => {
  client.get(key, (_, reply) => {
    console.log('key: %s, reply: %s"', key, reply);
    res.json({ type: 'string', value: reply });
  })
}

fetchList = (key, res) => {
  client.lrange(key, 0, -1, (_, reply) => {
    console.log('key: %s, reply: %s', key, reply);
    res.json({ type: 'list', value: reply });
  })
}

fetchSet = (key, cursor, res) => {
  if (!cursor) {
    cursor = 0;
  }

  client.sscan(key, cursor, (_, reply) => {
    console.log('key: %s, reply: %s', key, reply);
    res.json({ type: 'set', cursor: reply[0], value: reply[1] });
  })
}

fetchHash = (key, cursor, res) => {
  if (!cursor) {
    cursor = 0;
  }

  client.hscan(key, cursor, (_, reply) => {
    console.log('key: %s, reply: %s', key, reply);
    res.json({ type: 'hash', cursor: reply[0], value: reply[1] });
  })
}

fetchZSet = (key, cursor, res) => {
  if (!cursor) {
    cursor = 0;
  }

  client.zscan(key, cursor, (_, reply) => {
    console.log('key: %s, reply: %s', key, reply);
    res.json({ type: 'zset', cursor: reply[0], value: reply[1] });
  })
}

module.exports = router;