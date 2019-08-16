const redis = require('redis');
const client = redis.createClient();

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

module.exports = client