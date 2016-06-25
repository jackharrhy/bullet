var func = require('./func');
var kb = require('./keyboard');

module.exports = {
  addBullet: function(bullet) {
    function addBullet(bulletObject, array) {
      array.push(bulletObject);
    }
  },

  randomBoundBulletVec: function() {
    if(Math.random() >= 0.5) {
      return vec2(randInt(0,gameCanvas.width),0);
    } else {
      return vec2(0,randInt(0,gameCanvas.height));
    }
  },

  applyPlayerSpeed: function(player, obj) {
    if(player.speed > 0) {
      if(kb.up)    obj.pos.y -= player.speed;
      if(kb.down)  obj.pos.y += player.speed;
      if(kb.right) obj.pos.x += player.speed;
      if(kb.left)  obj.pos.x -= player.speed;
    }
  },

  unclog: function(obj1, obj2) {
    var angle = Math.acos((obj1.pos.x - obj2.pos.x)/func.pytha(obj1.pos, obj2.pos));
    obj2.pos.x = obj1.pos.x - (Math.cos(angle) * (obj1.radius + obj2.radius));

    if(obj2.pos.y < obj1.pos.y) {
      obj2.pos.y = obj1.pos.y - (Math.sin(angle) * (obj1.radius + obj2.radius));
    } else {
      obj2.pos.y = obj1.pos.y + (Math.sin(angle) * (obj1.radius + obj2.radius));
    }
  }
};
