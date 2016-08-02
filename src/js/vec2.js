function add(firstVec, secondVec) {
	return { x: firstVec.x + secondVec.x, y: firstVec.y + secondVec.y };
}

function sub(firstVec, secondVec) {
	return { x: firstVec.x - secondVec.x, y: firstVec.y - secondVec.y };
}

function multi(firstVec, secondVec) {
	return { x: firstVec.x * secondVec.x, y: firstVec.y * secondVec.y };
}

module.exports = {
	add: add,
	sub: sub,
	multi: multi
};
