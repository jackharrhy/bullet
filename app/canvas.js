'use strict';

const {randInt} = require('./utils');

const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

const imgs = {
	thisIsYou: document.getElementById('imgthisIsYou'),
};

module.exports = {
	getSize() {
		return {x: window.innerWidth, y: window.innerHeight};
	},
	getCenter() {
		return {x: window.innerWidth / 2, y: window.innerHeight / 2};
	},
	getRandomBoundPoint() {
		if (Math.random() >= 0.5) {
			return {x: randInt(0, window.innerWidth), y: 0};
		}
		return {x: 0, y: randInt(0, window.innerHeight)};
	},

	resize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	},

	hide() {
		canvas.style.display = 'none';
	},

	img(imgStr, x, y) {
		c.drawImage(imgs[imgStr], x, y);
	},

	circle(entity) {
		c.fillStyle = entity.color;
		c.beginPath();
		c.arc(entity.pos.x, entity.pos.y, entity.radius, 0, 2 * Math.PI);
		c.fill();
	},

	outlineCircle(entity) {
		c.fillStyle = entity.color;
		c.strokeStyle = entity.strokeColor;
		c.beginPath();
		c.arc(entity.pos.x, entity.pos.y, entity.radius, 0, 2 * Math.PI);
		c.fill();
		c.stroke();
	},

	clear() {
		c.fillStyle = 'white';
		c.fillRect(0, 0, canvas.width, canvas.height);
	},

	text(pos, text, size, color) {
		c.fillStyle = color;
		c.font = `${size.toString()}px Helvetica`;
		c.fillStyle(text, pos.x, pos.y);
	},
};
