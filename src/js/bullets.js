var menuCanvas = document.getElementById('menuCanvas'); var m = menuCanvas.getContext('2d');

var gameCanvas = document.getElementById('gameCanvas');
var g = gameCanvas.getContext('2d');

gameCanvas.width = 512;
gameCanvas.height = 512;

menuCanvas.width = 512;
menuCanvas.height = 32;

var player = {
	type: 'player',
	pos: {
		x: gameCanvas.width/2,
		y: gameCanvas.height/2
	},
	radius: 5,
	speed: 3,
	deinc: 0.1,
	fillColor: '#333'
};

function fixBulletPos(bullet) {
	if(bullet.pos.y < gameCanvas.height * -0.1) bullet.pos.y += gameCanvas.height * 1.2;
	if(bullet.pos.y > gameCanvas.height * 1.1) bullet.pos.y -= gameCanvas.height * 1.2;

	if(bullet.pos.x > gameCanvas.width * 1.1) bullet.pos.x -= gameCanvas.height * 1.2;
	if(bullet.pos.x < gameCanvas.width * -0.1) bullet.pos.x += gameCanvas.height * 1.2;

	if(bullet.type == 'player') {
		for(var i=0, len = bullets.array.length; i < len; i++) {
			var connectedBullet = bullets.array[i];
			if(connectedBullet.isConnected) {
				if(connectedBullet.pos.y > gameCanvas.height * 1.1) connectedBullet.pos.y -= gameCanvas.height * 1.2;

				if(connectedBullet.pos.x > gameCanvas.width * 1.1) connectedBullet.pos.x -= gameCanvas.height * 1.2;
				if(connectedBullet.pos.x < gameCanvas.width * -0.1) connectedBullet.pos.x += gameCanvas.height * 1.2;
			}
		}
	}
}

var pattern = {
	down: function(bullet) {
		bullet.pos.y += bullet.yspeed;
		fixBulletPos(bullet);
	},
	sideWays: function(bullet) {
		bullet.pos.y += bullet.yspeed;
		bullet.pos.x += bullet.xspeed;
		fixBulletPos(bullet);
	},
	wavyDown: function(bullet, key) {
		bullet.pos.y += bullet.yspeed + Math.sin((frame + key)/30);
		bullet.pos.x += Math.sin(frame/(bullet.xspeed * 40)) * 2;
		fixBulletPos(bullet);
	},
	awayFromCenter: function(bullet, key) {

	}
};

var bullets = { array: [] };

function randColor() {
	return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function randInt(min, max) {
	return Math.round(Math.random() * max) - min;
}

function generateBullet(i) {
	var bullet = {
		type: 'bullet',
		pos: {
			x: i,
			y: 0
		},
		radius: 6 + (Math.random() * 4),
		fillColor: randColor(),
		yspeed: 1 + (2 * Math.random()),
		xspeed: 1 + (2 * Math.random()),
		pattern: pattern.sideWays
	};
	bullets.array.push(bullet);
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
		if(pytha < 110) {
			draw.line(g, obj1.pos, obj2.pos, pytha/18.33333, 'rgba(0,0,0,'+(((pytha * -1) + 110)/330).toString()+')');
		}
		return pytha < (obj1.radius + obj2.radius);
	},
	unclog: function(obj1, obj2) {
		var angle = Math.acos((obj1.pos.x - obj2.pos.x)/func.pytha(obj1.pos, obj2.pos));

		obj2.pos.x = obj1.pos.x - (Math.cos(angle) * (obj1.radius + obj2.radius));

		var yMov = Math.sin(angle) * (obj1.radius + obj2.radius);
		if(obj2.pos.y < obj1.pos.y) {
			obj2.pos.y = obj1.pos.y - (Math.sin(angle) * (obj1.radius + obj2.radius));
		} else {
			obj2.pos.y = obj1.pos.y + (Math.sin(angle) * (obj1.radius + obj2.radius));
		}
	}
};

var update = {
	collisions: function(bullet, i) {
		if(bullet.isConnected) {
			for(var b=0, len = bullets.array.length; b < len; b++) {
				var otherBullet = bullets.array[b];
				if(!otherBullet.isConnected &&
					 func.distanceCheck(bullet, otherBullet)) {

					func.unclog(bullet, otherBullet);
					otherBullet.isConnected = true;
					player.speed -= otherBullet.radius / 60;
				}
			}
		} else {
			if(func.distanceCheck(player, bullet)) {
				func.unclog(player, bullet);

				bullet.isConnected = true;
				player.speed -= bullet.radius / 60;
			} else {
				bullet.pattern(bullet, i);
			}
		}
	}
};

var draw = {
	circle: function(ctx,obj) {
		ctx.fillStyle = obj.fillColor;
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(obj.pos.x, obj.pos.y, obj.radius, 0, 2*Math.PI);
		ctx.fill();
	},
	line: function(ctx,pos1,pos2,width,color) {
		ctx.beginPath();
		ctx.moveTo(pos1.x, pos1.y);
		ctx.lineTo(pos2.x, pos2.y);
		ctx.lineWidth = width;
		ctx.strokeStyle = color;
		ctx.stroke();
	},
	clear: function(ctx) {
		ctx.fillStyle = 'white';
		ctx.fillRect(0,0,gameCanvas.width, gameCanvas.height);
	},

	text: function(pos,size,color) {
		
	},
	menu: function() {

	}
};

var kb = {
	up: false,
	down: false,
	right: false,
	left: false
}
Mousetrap.bind('up',    function() { kb.up    = true  }, 'keydown');
Mousetrap.bind('up',    function() { kb.up    = false }, 'keyup');
Mousetrap.bind('down',  function() { kb.down  = true  }, 'keydown');
Mousetrap.bind('down',  function() { kb.down  = false }, 'keyup');
Mousetrap.bind('right', function() { kb.right = true  }, 'keydown');
Mousetrap.bind('right', function() { kb.right = false }, 'keyup');
Mousetrap.bind('left',  function() { kb.left  = true  }, 'keydown');
Mousetrap.bind('left',  function() { kb.left  = false }, 'keyup');

var frame = -1;
var loop = {
	menu: function() {
		frame++;

		requestAnimationFrame(loop.cur);
	},
	game: function() {
		frame++;

		draw.clear(g);
		func.applyPlayerSpeed(player);
		fixBulletPos(player);
		draw.circle(g,player);
		for(var i=0, len = bullets.array.length; i < len; i++) {
			var bullet = bullets.array[i];
			bullet.xspeed += 0.001;
			bullet.yspeed += 0.001;
			if(bullet.isConnected) {
				func.applyPlayerSpeed(bullet);
			}
			update.collisions(bullet, i);
			draw.circle(g,bullet);
		}

		if(frame % 30 === 0) {
			generateBullet(randInt(0,gameCanvas.width));
		}

		requestAnimationFrame(loop.cur);
	}
}
loop.cur = loop.game;
loop.cur();
