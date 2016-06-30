var vec2 = require('./fab/vec2');

function pytha(pos1, pos2) {
	return Math.sqrt(
		((pos1.x - pos2.x) * (pos1.x - pos2.x)) +
		((pos1.y - pos2.y) * (pos1.y - pos2.y))
	);
}

function distanceCheck(ent1, ent2) {
	var pythaSol = pytha(ent1.pos, ent2.pos);
	return pythaSol < (ent1.radius + ent2.radius);
}

function squareCheck(ent1, ent2) {
	return !(
		(ent1.pos.x + ent1.radius) < (ent2.pos.x - ent2.radius) ||
		(ent1.pos.y + ent1.radius) < (ent2.pos.y - ent2.radius) ||
		(ent1.pos.x - ent1.radius) > (ent2.pos.x + ent2.radius) ||
		(ent1.pos.y - ent1.radius) > (ent2.pos.y + ent2.radius)
	);
}

module.exports = {
	create: function(frag) {
		return {
			radius: frag.radius || 4,
			color: frag.color || 'black',
			
			pos: frag.pos || vec2(0,0),
			posOffset: frag.posOffset || vec2(0,0),
			
			vel: frag.vel || vec2(0,0),
			maxVel: frag.maxVel || vec2(1,1),
			
			acel: frag.acel || vec2(0,0)
		};
	},
	
	checkCollision: function(ent1, ent2) {
		if(squareCheck(ent1, ent2) && distanceCheck(ent1, ent2)) {
			return true;
		}
		return false;
	},

	acel: function(entity) {
		entity.vel.y += entity.acel.y;
		entity.vel.x += entity.acel.x;
	},
	
	move: function(entity) {
		if(entity.vel.y > 0) {
			entity.vel.y = entity.vel.y >= entity.maxVel.y ? entity.maxVel.y : entity.vel.y;
			entity.pos.y += entity.vel.y;
		} else {
			entity.vel.y = entity.vel.y <= -entity.maxVel.y ? -entity.maxVel.y : entity.vel.y;
			entity.pos.y += entity.vel.y;
		}
		
		if(entity.vel.x > 0) {
			entity.vel.x = entity.vel.x >= entity.maxVel.x ? entity.maxVel.x : entity.vel.x;
			entity.pos.x += entity.vel.x;
		} else {
			entity.vel.x = entity.vel.x <= -entity.maxVel.x ? -entity.maxVel.x : entity.vel.x;
			entity.pos.x += entity.vel.x;
		}
	},

	moveWithKeyboard: function(entity, keyboard) {
		if(keyboard.up) {
			entity.vel.y -= entity.acel.y;
		}
		if(keyboard.down) {
			entity.vel.y += entity.acel.y;
		}
		if(keyboard.left) {
			entity.vel.x -= entity.acel.x;
		}
		if(keyboard.right) {
			entity.vel.x += entity.acel.x;
		}
		
		this.move(entity);
	},

	moveWithPlayer: function(entity, basePlayer) {
		entity.pos = vec2.sub(basePlayer.pos, entity.posOffset);
	},
	
	swapAround: function(entity, canvasSize) {
		// Y Axis
		if(entity.pos.y > canvasSize.y) {
			entity.pos.y -= canvasSize.y;
		}
		else if(entity.pos.y < 0) {
			entity.pos.y += canvasSize.y;
		}
	
		// X Axis
		if(entity.pos.x > canvasSize.x) {
			entity.pos.x -= canvasSize.x;
		}
		else if(entity.pos.x < 0) {
			entity.pos.x += canvasSize.x;
		}
	}
};
