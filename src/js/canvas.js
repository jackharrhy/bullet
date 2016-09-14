var randInt = require('./fab/randInt');

var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

var imgs = {
	thisIsYou: document.getElementById('imgthisIsYou')
};

module.exports = {
	getSize: function() {
		return { x: window.innerWidth, y: window.innerHeight };
	},
	getCenter: function() {
		return { x: window.innerWidth/2, y: window.innerHeight/2 };
	},
	getRandomBoundPoint: function() {
		if(Math.random() >= 0.5) {
			return { x: randInt(0,window.innerWidth), y: 0 };
		}
		return { x: 0, y: randInt(0,window.innerHeight) };
	},

	resize: function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	},

	hide: function() {
		canvas.style.display = 'none';
	},

	img: function(imgStr, x,y) {
		c.drawImage(imgs[imgStr],x,y);
	},

	circle: function(entity) {
		c.fillStyle = entity.color;
		c.beginPath();
		c.arc(entity.pos.x, entity.pos.y, entity.radius, 0, 2*Math.PI);
		c.fill();
	},

	outlineCircle: function(entity) {
		c.fillStyle = entity.color;
		c.strokeStyle = entity.strokeColor;
		c.beginPath();
		c.arc(entity.pos.x, entity.pos.y, entity.radius, 0, 2*Math.PI);
		c.fill();
		c.stroke();
	},

	clear: function() {
		c.fillStyle = 'white';
		c.fillRect(0,0,canvas.width,canvas.height);
	},

	text: function(pos,text,size,color) {
		c.fillStyle = color;
		c.font = size.toString() + 'px Helvetica';
		c.fillStyle(text, pos.x, pos.y);
	}
};
