const http = require('http')
const app = require('./app');
const bcrypt = require('bcrypt');

const server = http.createServer(app);

server.listen(8080);