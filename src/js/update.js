var vec2 = require('./fab/vec2');
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

	maxVel: vec2(3,3),
	acel: vec2(0.4,0.4)
});

function checkCollision(playerEntity) {
	for(var b=0, bLen=bulletArray.length; b < bLen; b++) {
		if(bulletArray[b] && entity.checkCollision(playerEntity,bulletArray[b])) {
			var bulletToMove = Object.create(bulletArray[b]);
			var copyOfPlayer = Object.create(playerEntity);

			playerArray.push(entity.create({
				radius: bulletToMove.radius,
				color: bulletToMove.color,
				pos: bulletToMove.pos,
				posOffset: vec2.sub(basePlayer.pos, bulletToMove.pos)
			}));

			canvas.circle(bulletArray[b]);
			delete bulletArray[b];
		}
	}
}

module.exports = {
	renderLoop: function() {
		frame++;
		canvas.clear();

		entity.moveWithKeyboard(basePlayer, keyboard);
		entity.swapAround(basePlayer, canvas.getSize());
		canvas.circle(basePlayer);
		checkCollision(basePlayer);

		for(var p=0, pLen=playerArray.length; p < pLen; p++) {
			var playerEntity = playerArray[p];

			entity.moveWithPlayer(playerEntity, basePlayer);
			entity.swapAround(playerEntity, canvas.getSize());

			canvas.circle(playerEntity);
			checkCollision(playerEntity);
		}

		for(var i=0, len=bulletArray.length; i < len; i++) {
			if(bulletArray[i]) {
				var bulletEntity = bulletArray[i];

				entity.move(bulletEntity);
				entity.acel(bulletEntity);
				entity.swapAround(bulletEntity, canvas.getSize());

				canvas.circle(bulletEntity);
			}
		}

		requestAnimationFrame(this.renderLoop.bind(this));
	},

	secondsLoop: function() {
		seconds++;

		if(bulletArray.length <= 130) {
			bulletArray.push(entity.create({
				radius: randInt(7,14),
				color: randHex(),

				pos: canvas.getRandomBoundPoint(),
				maxVel: vec2(
					((Math.random() * seconds/7) + 1),
					((Math.random() * seconds/7) + 1)
				),
				acel: vec2(
					Math.random() < 0.5 ? -0.005 : 0.005,
					Math.random() < 0.5 ? -0.005 : 0.005 
				)
			}));
		}

		setTimeout(this.secondsLoop.bind(this), 1000);
	}
};

