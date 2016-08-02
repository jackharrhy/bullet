var vec2 = require('./vec2');

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

function limit1DVel(vel, maxVel) {
	if(vel > 0) {
		return vel >= maxVel ? maxVel : vel;
	}
	return vel <= -maxVel ? -maxVel: vel;
}

function limitVel(entity) {
	return {
		x: limit1DVel(entity.vel.x, entity.maxVel.x),
		y: limit1DVel(entity.vel.y, entity.maxVel.y)
	};
}

module.exports = {
	create: function(frag) {
		return {
			radius: frag.radius || 4,
			color: frag.color || 'black',
			
			pos: frag.pos || {x: 0, y: 0},
			posOffset: frag.posOffset || {x: 0, y: 0},
			
			vel: frag.vel || {x: 0, y: 0},
			maxVel: frag.maxVel || {x: 0, y: 0},
			
			acel: frag.acel || {x: 0, y: 0}
		};
	},
	
	checkCollision: function(ent1, ent2) {
		return squareCheck(ent1, ent2) && distanceCheck(ent1, ent2);
	},

	acel: function(entity) {
		entity.vel.y += entity.acel.y;
		entity.vel.x += entity.acel.x;
	},
	
	move: function(entity) {
		entity.vel = limitVel(entity);

		entity.pos = vec2.add(entity.pos, entity.vel);
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
