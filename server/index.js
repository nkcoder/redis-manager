const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

const redis = require('redis');
const client = redis.createClient();

const FRONTEND_URL = "http://localhost:3000"

const app = express();
app.use(morgan('dev'));
app.use(cors(FRONTEND_URL));

app.get('/', (req, res) => {
  res.json({ code: 0 });
});

app.get('/info', (req, res) => {
  client.info((err, serverInfo) => {
    console.log('server info\n', serverInfo);
    res.send(serverInfo);
  });
});

app.get('/clients', (req, res) => {
  client.client('LIST', (err, reply) => {
    if (err) {
      console.log('error', err);
      res.json({});
    }

    const clients = reply.split('\n');
    console.log('reply\n', reply);

    res.send(clients);
  });
})

app.listen(4000, () => {
  console.log('listen on port 40000');
});

/**
 * redis client events
 */
client.on('error', function (err) {
  console.log('error', err);
});

client.on('ready', function () {
  console.log('ready: connection is established');
});

client.on('connect', function () {
  console.log('connect: the stream is connected to the server.');
});

client.on('reconnecting', function () {
  console.log(
    'reconnecting: trying to reconnect to the Redis server after losing the connection'
  );
});

client.on('end', function () {
  console.log('end: an established Redis server connection has closed.');
});
