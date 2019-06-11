'use strict';

const Combokeys = require('combokeys');
const canvasInput = new Combokeys(document.documentElement);

const kb = {
	up: false, down: false, left: false, right: false,
};

canvasInput.bind('up', () => { kb.up = true; }, 'keydown');
canvasInput.bind('up', () => { kb.up = false; }, 'keyup');
canvasInput.bind('down', () => { kb.down = true; }, 'keydown');
canvasInput.bind('down', () => { kb.down = false; }, 'keyup');
canvasInput.bind('left', () => { kb.left = true; }, 'keydown');
canvasInput.bind('left', () => { kb.left = false; }, 'keyup');
canvasInput.bind('right', () => { kb.right = true; }, 'keydown');
canvasInput.bind('right', () => { kb.right = false; }, 'keyup');

module.exports = kb;
