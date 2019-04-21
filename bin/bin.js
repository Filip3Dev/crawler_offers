'use strict'

const app = require('../app');
const debug = require('debug')('http');
const http = require('http');

const port = normalizePort(process.env.PORT || '9000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('listening', onListening);
debug("Api Rodando na: " + port);
console.log("Api Rodando na: " + port);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ?
    'pipe' + addr :
    'port' + addr.port;
  debug('Listening on ' + bind)
}