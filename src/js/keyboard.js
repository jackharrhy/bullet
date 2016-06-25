var Combokeys = require('combokeys');
var canvasInput = new Combokeys(document.documentElement);

var kb = {
	up: false, down: false, left: false, right: false
};

canvasInput.bind('up', function() { kb.up = true; }, 'keydown');
canvasInput.bind('up', function() { kb.up = false; }, 'keyup');
canvasInput.bind('down', function() { kb.down = true; }, 'keydown');
canvasInput.bind('down', function() { kb.down = false; }, 'keyup');
canvasInput.bind('left', function() { kb.left = true; }, 'keydown');
canvasInput.bind('left', function() { kb.left = false; }, 'keyup');
canvasInput.bind('right', function() { kb.right = true; }, 'keydown');
canvasInput.bind('right', function() { kb.right = false; }, 'keyup');

module.exports = kb;
