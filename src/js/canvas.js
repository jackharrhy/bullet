var vec2 = require('./fab/vec2');
var randInt = require('./fab/randInt');

var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

module.exports = {
	getSize: function() {
		return vec2(window.innerWidth, window.innerHeight);
	},
	getCenter: function() {
		return vec2(window.innerWidth/2, window.innerHeight/2);
	},
	getRandomBoundPoint: function() {
		if(Math.random() >= 0.5) {
			return vec2(randInt(0,window.innerWidth),0);
		} else {
			return vec2(0,randInt(0,window.innerHeight));
		}
	},

	resize: function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	},

	circle: function(entity) {
		c.fillStyle = entity.color;
		c.beginPath();
		c.arc(entity.pos.x, entity.pos.y, entity.radius, 0, 2*Math.PI);
		c.fill();
	},
	clear: function() {
		c.fillStyle = 'white';
		c.fillRect(0,0,canvas.width,canvas.height);
	},

	text: function(pos,text,size,color) {
		c.fillStyle = color
		c.font = size.toString() + 'px Helvetica';
		c.fillStyle(text, pos.x, pos.y);
	}
};
