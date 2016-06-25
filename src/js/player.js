var kb = require('./keyboard');

module.exports = {
	pos: func.vec2(gameCanvas.width/2, gameCanvas.height/2),
	radius: 5,
	speed: 3,
	deinc: 0.1,
	color: '#333'
	applyPlayerSpeed: function(player) {
		if(player.speed > 0) {
			if(kb.up)    obj.pos.y -= player.speed;
			if(kb.down)  obj.pos.y += player.speed;
			if(kb.right) obj.pos.x += player.speed;
			if(kb.left)  obj.pos.x -= player.speed;
		}
	}
};
