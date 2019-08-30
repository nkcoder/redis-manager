const client = require('../../redis');
const router = require('express').Router();
const bodyParser = require('body-parser');
const redisResponse = require('../../lib/redisResponse');

router.use(bodyParser.json());

const DEFAULT_PAGE_SIZE = 10;

router.get('/keys', (req, res) => {
  let cursor = req.query.cursor;
  if (!cursor) {
    cursor = 0;
  }

  client.scan(cursor, 'COUNT', DEFAULT_PAGE_SIZE, (_, reply) => {
    console.log('cursor: %s, database reply: %s', cursor, reply);

    res.json({
      cursor: reply[0],
      keys: reply[1]
    })
  });

});

router.get('/search', (req, res) => {
  const pattern = `*${req.query.key}*`;
  const cursor = req.query.cursor;

  if (!cursor) {
    cursor = 0;
  }

  client.scan(cursor, 'MATCH', pattern, 'COUNT', DEFAULT_PAGE_SIZE, (_, reply) => {
    console.log('cursor: %i, match: %s, reply: %s', cursor, pattern, reply);
    res.json({
      cursor: reply[0],
      keys: reply[1]
    });
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
    if (reply === redisResponse.success) {
      return res.json();
    } else {
      return res.status(400).json({
        message: `key does not exist.`
      });
    }
  })
})

router.put('/persist', (req, res) => {
  const { key } = req.body;

  client.persist(key, (_, reply) => {
    console.log('persist key: %s, reply: %s', key, reply);
    if (reply === redisResponse.success) {
      return res.json();
    } else {
      return res.status(400).json({
        message: 'key does not exist or does not have an associated timeout.'
      });
    }
  })
})

router.delete('/delete', (req, res) => {
  const keys = req.query.keys;

  client.del(keys, (_, reply) => {
    console.log("delete key: %s, reply: %s", keys, reply);
    if (reply > 0) {
      return res.json();
    } else {
      return res.status(400).json({
        message: `only ${reply} of ${keys.length} keys are deleted, others may not exist.`
      });
    }
  })
})

router.get('/ttl', (req, res) => {
  const key = req.query.key;

  client.ttl(key, (_, reply) => {
    console.log('ttl for key: %s, reply: %s', key, reply);
    if (reply === redisResponse.key_not_exist) {
      return res.status(400).json({
        message: 'key not exist.'
      })
    } else if (reply === redisResponse.key_not_volatile) {
      return res.status(400).json({
        message: 'key exists but has no associated expire.'
      })
    }

    return res.json({ 'ttl': reply });
  })
})

router.put('/switch-db', (req, res) => {
  const index = req.body.index;
  client.select(index, (_, reply) => {
    console.log('switch db to: %s, reply: %s', index, reply);
    if (reply !== redisResponse.ok) {
      return res.status(400).json({
        message: `cannot switch to ${index}, error: ${reply}`
      })
    }

    return res.json();
  })
})

handleNotExistKey = (key, res) => {
  console.warn('key: %s not exist', key);
  res.json({});
}

fetchString = (key, res) => {
  client.get(key, (_, reply) => {
    console.log('key: %s, reply: %s"', key, reply);
    res.json({ type: 'string', value: reply, cursor: '0' });
  })
}

fetchList = (key, res) => {
  client.lrange(key, 0, -1, (_, reply) => {
    console.log('key: %s, reply: %s', key, reply);
    res.json({ type: 'list', value: reply, cursor: '0' });
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