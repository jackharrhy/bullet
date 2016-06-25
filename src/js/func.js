module.exports = {
  vec2: function(x,y) {
  	return { x: x, y: y };
  },
  randColor: function() {
  	return '#' + Math.floor(Math.random()*16777215).toString(16);
  },
  randInt:function(min, max) {
  	return Math.round(Math.random() * max) - min;
  },
  pytha: function(pos1, pos2) {
		return Math.sqrt(
			((pos1.x - pos2.x) * (pos1.x - pos2.x)) +
			((pos1.y - pos2.y) * (pos1.y - pos2.y))
		);
	},
  // Hypotenuse distance check
	distanceCheck: function(obj1, obj2) {
		pytha = func.pytha(obj1.pos, obj2.pos);
		return pytha < (obj1.radius + obj2.radius);
	},

  // Two circle square collision check
	squareCheck: function(obj1, obj2) {
		return !(
			(obj1.pos.x + obj1.radius) < (obj2.pos.x - obj2.radius) ||
			(obj1.pos.y + obj1.radius) < (obj2.pos.y - obj2.radius) ||
			(obj1.pos.x - obj1.radius) > (obj2.pos.x + obj2.radius) ||
			(obj1.pos.y - obj1.radius) > (obj2.pos.y + obj2.radius)
		);
	}
};
