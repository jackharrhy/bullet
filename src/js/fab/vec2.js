var vec2 = function(x,y) {
	return { x: x, y: y };
}

vec2.add = function(firstVec, secondVec) {
	return vec2(firstVec.x + secondVec.x,firstVec.y + secondVec.y);
};

vec2.sub = function(firstVec, secondVec) {
	return vec2(firstVec.x - secondVec.x,firstVec.y - secondVec.y);
};

vec2.multi = function(firstVec, secondVec) {
	return vec2(firstVec.x * secondVec.x,firstVec.y * secondVec.y);
};

module.exports = vec2;
