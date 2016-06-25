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
	awayFromCenter: function(bullet, key) {
    // TODO
	}
};
