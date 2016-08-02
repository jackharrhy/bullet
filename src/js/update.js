var vec2 = require('./vec2.js');
var randInt = require('./fab/randInt');
var randHex = require('./fab/randHex');

var entity = require('./entity');
var canvas = require('./canvas');
var keyboard = require('./keyboard');

var playerArray = [];
var bulletArray = [];

var frame = -1;
var seconds = -1;

canvas.resize();

var basePlayer = entity.create({
	radius: 5,
	color: 'red',

	pos: canvas.getCenter(),

	maxVel: {x: 3, y: 3},
	acel: {x: 0.4, y: 0.4}
});

function checkCollision(playerEntity) {
	for(var b=0, bLen=bulletArray.length; b < bLen; b++) {
		if(bulletArray[b] && entity.checkCollision(playerEntity,bulletArray[b])) {
			let bulletToMove = bulletArray[b];

			playerArray.push(entity.create({
				radius: bulletToMove.radius,
				color: bulletToMove.color,
				pos: bulletToMove.pos,
				posOffset: vec2.sub(basePlayer.pos, bulletToMove.pos)
			}));

			bulletArray.splice(b,1);
		}
	}
}

function renderLoop() {
	frame++;
	canvas.clear();

	var canvasSize = canvas.getSize();

	for(var i=0; i < bulletArray.length; i++) {
		if(bulletArray[i]) {
			let bulletEntity = bulletArray[i];

			entity.move(bulletEntity);
			entity.acel(bulletEntity);
			entity.swapAround(bulletEntity, canvasSize);

			canvas.circle(bulletEntity);
		}
	}

	entity.moveWithKeyboard(basePlayer, keyboard);
	entity.swapAround(basePlayer, canvasSize);
	canvas.circle(basePlayer);
	checkCollision(basePlayer);

	for(var p=0; p < playerArray.length; p++) {
		let playerEntity = playerArray[p];

		entity.moveWithPlayer(playerEntity, basePlayer);
		entity.swapAround(playerEntity, canvasSize);

		canvas.circle(playerEntity);
		checkCollision(playerEntity);
	}

	window.requestAnimationFrame(renderLoop);
}

function secondsLoop() {
	seconds++;

	if(bulletArray.length <= 130) {
		bulletArray.push(entity.create({
			radius: randInt(7,14),
			color: randHex(),

			pos: canvas.getRandomBoundPoint(),
			maxVel: {
				x: ((Math.random() * seconds/7) + 1),
				y: ((Math.random() * seconds/7) + 1)
			},
			acel: {
				x: Math.random() < 0.5 ? -0.005 : 0.005,
				y: Math.random() < 0.5 ? -0.005 : 0.005 
			}
		}));
	}

	setTimeout(secondsLoop, 1000);
}

module.exports = {
	renderLoop: renderLoop,
	secondsLoop: secondsLoop
};

