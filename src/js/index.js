var update = require('./update');

var menu = document.getElementById('menu');
var startButton = document.getElementById('start');

startButton.onclick = function() {
	menu.style.display = 'none';
	update.renderLoop();
	update.secondsLoop();
};
