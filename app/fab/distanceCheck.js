var pytha = require('./pytha');

module.exports = function(ent1, ent2) {
  var pythaSol = pytha(ent1.pos, ent2.pos);
  return pythaSol < (ent1.radius + ent2.radius);
};
