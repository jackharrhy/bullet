module.exports = {
	down: function(bullet) {
		bullet.pos.y += bullet.speedpos.y;
	},
	sideWays: function(bullet) {
		bullet.pos.y += bullet.speedpos.y;
		bullet.pos.x += bullet.speedpos.x;
	},
	wavyDown: function(bullet, frame) {
		bullet.pos.y += bullet.speedpos.y + Math.sin((frame)/30);
		bullet.pos.x += Math.sin(frame/(bullet.speedpos.x * 40)) * 2;
	},
	straightOnAxis: function(bullet) {
		if(Math.random() >= 0.5) {
			bullet.pos.y += bullet.speed;
		} else {
			bullet.pos.x += bullet.speed;
		}
	},
	awayFromCenter: function(bullet, key) {
    // TODO
	}
};
