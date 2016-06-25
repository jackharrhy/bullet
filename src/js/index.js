var draw = require('./draw');
var kb = require('./keyboard');

var bullet = require('./bullet');
var pattern = require('./pattern');

var func = require('./func');

var menuCanvas = document.getElementById('menuCanvas');
var m = menuCanvas.getContext('2d');
menuCanvas.width = 512;
menuCanvas.height = 32;
var m = menuCanvas.getContext('2d');

var gameCanvas = document.getElementById('gameCanvas');
gameCanvas.width = 512;
gameCanvas.height = 512;
var g = gameCanvas.getContext('2d');

var player = {
	type: 'player',
	pos: func.vec2(gameCanvas.width/2, gameCanvas.height/2),
	radius: 5,
	speed: 3,
	deinc: 0.1,
	color: '#333'
};

var update = {
	collision: function(bullet) {
		if(bullet.isConnected) {
			// Connected Collision
			for(var b=0, len = bullets.array.length; b < len; b++) {
				var otherBullet = bullets.array[b];
				if(!otherBullet.isConnected && func.squareCheck(bullet, otherBullet) && func.distanceCheck(bullet, otherBullet)) {

					func.unclog(bullet, otherBullet);
					otherBullet.isConnected = true;
					player.speed -= otherBullet.radius / 120;
				}
			}
		} else {
			// Player Collision
			if(func.squareCheck(player, bullet) && func.distanceCheck(player, bullet)) {
				func.unclog(player, bullet);

				bullet.isConnected = true;
				player.speed -= bullet.radius / 120;
			} else {
				bullet.pattern(bullet, frame);
				update.swapArround(bullet);
			}
		}
	},

	swapArround: function(obj) {
		if(obj.pos.y < gameCanvas.height * -0.1) obj.pos.y += gameCanvas.height * 1.2;
		if(obj.pos.y > gameCanvas.height * 1.1)  obj.pos.y -= gameCanvas.height * 1.2;

		if(obj.pos.x > gameCanvas.width * 1.1)   obj.pos.x -= gameCanvas.height * 1.2;
		if(obj.pos.x < gameCanvas.width * -0.1)  obj.pos.x += gameCanvas.height * 1.2;
	}
};

var frame = -1;
var loop = {
	menu: function() {
		frame++;

		requestAnimationFrame(loop.cur);
	},
	game: function() {
		frame++;

		draw.clear(g, gameCanvas);

		player.applyPlayerSpeed(player);
		update.swapArround(player);
		draw.circle(g,player.pos, player.radius, player.color);

		for(var i=0, len = bullets.array.length; i < len; i++) {
			var bullet = bullets.array[i];
			bullet.xspeed += 0.0005;
			bullet.yspeed += 0.0005;

			if(bullet.isConnected) {
				func.applyPlayerSpeed(bullet);
			}

			update.collision(bullet, i);
			draw.circle(g,bullet.pos,bullet.radius,bullet.color);
		}

		if(frame % 60 === 0) {
			addBullet({
				pos: 			randomBoundBullet(),
				radius: 	6 + randInt(0,8),
				color: 		randColor(),
				speedpos: func.vec2(1 + (2 * Math.random()), 1 + (2 * Math.random())),
				pattern: pattern.wavyDown
			});
		}

		draw.clear(m, menuCanvas);

		requestAnimationFrame(loop.cur);
	}
};
loop.cur = loop.game;
loop.cur();
