'use strict';

module.exports = function (ent1, ent2) {
	return !(
		(ent1.pos.x + ent1.radius) < (ent2.pos.x - ent2.radius)
    || (ent1.pos.y + ent1.radius) < (ent2.pos.y - ent2.radius)
    || (ent1.pos.x - ent1.radius) > (ent2.pos.x + ent2.radius)
    || (ent1.pos.y - ent1.radius) > (ent2.pos.y + ent2.radius)
	);
};
