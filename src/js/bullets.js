var menuCanvas = document.getElementById('menuCanvas');
var m = menuCanvas.getContext('2d');
menuCanvas.width = 512;
menuCanvas.height = 32;
var m = menuCanvas.getContext('2d');

var gameCanvas = document.getElementById('gameCanvas');
gameCanvas.width = 512;
gameCanvas.height = 512;
var g = gameCanvas.getContext('2d');

function vec2(x,y) {
	return { x: x, y: y };
}

function randColor() {
	return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function randInt(min, max) {
	return Math.round(Math.random() * max) - min;
}

var player = {
	type: 'player',
	pos: vec2(gameCanvas.width/2, gameCanvas.height/2),
	radius: 5,
	speed: 3,
	deinc: 0.1,
	color: '#333'
};

var pattern = {
	down: function(bullet) {
		bullet.pos.y += bullet.speedpos.y;
	},
	sideWays: function(bullet) {
		bullet.pos.y += bullet.speedpos.y;
		bullet.pos.x += bullet.speedpos.x;
	},
	wavyDown: function(bullet) {
		bullet.pos.y += bullet.speedpos.y + Math.sin((frame)/30);
		bullet.pos.x += Math.sin(frame/(bullet.speedpos.x * 40)) * 2;
	},
	awayFromCenter: function(bullet, key) {

	}
};

var bullets = { array: [] };

function addBullet(bulletObject) {
	bullets.array.push(bulletObject);
}

var func = {
	applyPlayerSpeed: function(obj) {
		if(player.speed > 0) {
			if(kb.up)    obj.pos.y -= player.speed;
			if(kb.down)  obj.pos.y += player.speed;
			if(kb.right) obj.pos.x += player.speed;
			if(kb.left)  obj.pos.x -= player.speed;
		}
	},
	pytha: function(pos1, pos2) {
		return Math.sqrt(
			((pos1.x - pos2.x) * (pos1.x - pos2.x)) +
			((pos1.y - pos2.y) * (pos1.y - pos2.y))
		);
	},
	distanceCheck: function(obj1, obj2) {
		pytha = func.pytha(obj1.pos, obj2.pos);
		return pytha < (obj1.radius + obj2.radius);
	},

	unclog: function(obj1, obj2) {
		var angle = Math.acos((obj1.pos.x - obj2.pos.x)/func.pytha(obj1.pos, obj2.pos));
		obj2.pos.x = obj1.pos.x - (Math.cos(angle) * (obj1.radius + obj2.radius));

		if(obj2.pos.y < obj1.pos.y) {
			obj2.pos.y = obj1.pos.y - (Math.sin(angle) * (obj1.radius + obj2.radius));
		} else {
			obj2.pos.y = obj1.pos.y + (Math.sin(angle) * (obj1.radius + obj2.radius));
		}
	},

	squareCheck: function(obj1, obj2) {
		return !(
			(obj1.pos.x + obj1.radius) < (obj2.pos.x - obj2.radius) ||
			(obj1.pos.y + obj1.radius) < (obj2.pos.y - obj2.radius) ||
			(obj1.pos.x - obj1.radius) > (obj2.pos.x + obj2.radius) ||
			(obj1.pos.y - obj1.radius) > (obj2.pos.y + obj2.radius)
		);
	}
};

var update = {
	collision: function(bullet) {
		if(bullet.isConnected) {
			// Connected Collision
			for(var b=0, len = bullets.array.length; b < len; b++) {
				var otherBullet = bullets.array[b];
				if(!otherBullet.isConnected &&
					 func.squareCheck(bullet, otherBullet) && func.distanceCheck(bullet, otherBullet)) {

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
				bullet.pattern(bullet);
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

		func.applyPlayerSpeed(player);
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
				pos: 			vec2(randInt(0,gameCanvas.width),randInt(0,gameCanvas.height)),
				radius: 	6 + randInt(0,8),
				color: 		randColor(),
				speedpos: vec2(1 + (2 * Math.random()), 1 + (2 * Math.random())),
				pattern: pattern.wavyDown
			});
		}

		draw.text(m, 'meme', 10, 'black', vec2(menuCanvas.width/2, menuCanvas.height/2));

		requestAnimationFrame(loop.cur);
	}
};
loop.cur = loop.game;
loop.cur();
