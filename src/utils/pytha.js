'use strict';

module.exports = function (pos1, pos2) {
	return Math.sqrt(
		((pos1.x - pos2.x) * (pos1.x - pos2.x))
    + ((pos1.y - pos2.y) * (pos1.y - pos2.y))
	);
};
