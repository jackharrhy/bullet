var winston = require('winston');

winston.add(winston.transports.File, { filename: 'bullet.log' });

winston.info('startup', new Date().toString());

var io = require('socket.io')(2244);
io.sockets.on('connection', function(socket) {
	winston.info('socket', socket);

	socket.on('transfer', function(transferData) {
		winston.info('transfer', transferData);
		io.emit('transfer', transferData);
	});
});
