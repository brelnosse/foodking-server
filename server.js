const http = require('http');
const app = require('./app');
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});

server.on('error', (err) => {
	console.error('Server error:', err);
	process.exit(1);
});