(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("canvas.js", function(exports, require, module) {
'use strict';

var randInt = require('./fab/randInt');

var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

var imgs = {
  thisIsYou: document.getElementById('imgthisIsYou')
};

module.exports = {
  getSize: function getSize() {
    return { x: window.innerWidth, y: window.innerHeight };
  },
  getCenter: function getCenter() {
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  },
  getRandomBoundPoint: function getRandomBoundPoint() {
    if (Math.random() >= 0.5) {
      return { x: randInt(0, window.innerWidth), y: 0 };
    }
    return { x: 0, y: randInt(0, window.innerHeight) };
  },

  resize: function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  },

  hide: function hide() {
    canvas.style.display = 'none';
  },

  img: function img(imgStr, x, y) {
    c.drawImage(imgs[imgStr], x, y);
  },

  circle: function circle(entity) {
    c.fillStyle = entity.color;
    c.beginPath();
    c.arc(entity.pos.x, entity.pos.y, entity.radius, 0, 2 * Math.PI);
    c.fill();
  },

  outlineCircle: function outlineCircle(entity) {
    c.fillStyle = entity.color;
    c.strokeStyle = entity.strokeColor;
    c.beginPath();
    c.arc(entity.pos.x, entity.pos.y, entity.radius, 0, 2 * Math.PI);
    c.fill();
    c.stroke();
  },

  clear: function clear() {
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
  },

  text: function text(pos, _text, size, color) {
    c.fillStyle = color;
    c.font = size.toString() + 'px Helvetica';
    c.fillStyle(_text, pos.x, pos.y);
  }
};
});

require.register("entity.js", function(exports, require, module) {
'use strict';

var vec2 = require('./vec2');

var distanceCheck = require('./fab/distanceCheck');

var squareCheck = require('./fab/squareCheck');

function limit1DVel(vel, maxVel) {
  if (vel > 0) {
    return vel >= maxVel ? maxVel : vel;
  }
  return vel <= -maxVel ? -maxVel : vel;
}

function limitVel(entity) {
  return {
    x: limit1DVel(entity.vel.x, entity.maxVel.x),
    y: limit1DVel(entity.vel.y, entity.maxVel.y)
  };
}

module.exports = {
  create: function create(frag) {
    return {
      radius: frag.radius || 4,
      color: frag.color || 'black',

      pos: frag.pos || { x: 0, y: 0 },
      posOffset: frag.posOffset || { x: 0, y: 0 },

      vel: frag.vel || { x: 0, y: 0 },
      maxVel: frag.maxVel || { x: 0, y: 0 },

      acel: frag.acel || { x: 0, y: 0 }
    };
  },

  basePlayer: function basePlayer(center) {
    return this.create({
      radius: 5,
      color: 'white',
      outlineColor: 'black',

      pos: center,

      maxVel: { x: 3, y: 3 },
      acel: { x: 0.4, y: 0.4 }
    });
  },

  checkCollision: function checkCollision(ent1, ent2) {
    return squareCheck(ent1, ent2) && distanceCheck(ent1, ent2);
  },

  acel: function acel(entity) {
    entity.vel.y += entity.acel.y;
    entity.vel.x += entity.acel.x;
  },

  move: function move(entity) {
    entity.vel = limitVel(entity);

    entity.pos = vec2.add(entity.pos, entity.vel);
  },

  moveWithKeyboard: function moveWithKeyboard(entity, keyboard) {
    if (keyboard.up) {
      entity.vel.y -= entity.acel.y;
    }
    if (keyboard.down) {
      entity.vel.y += entity.acel.y;
    }
    if (keyboard.left) {
      entity.vel.x -= entity.acel.x;
    }
    if (keyboard.right) {
      entity.vel.x += entity.acel.x;
    }

    this.move(entity);
  },

  moveWithPlayer: function moveWithPlayer(entity, basePlayer) {
    entity.pos = vec2.sub(basePlayer.pos, entity.posOffset);
  },

  swapAround: function swapAround(entity, canvasSize) {
    // Y Axis
    if (entity.pos.y > canvasSize.y) {
      entity.pos.y -= canvasSize.y;
    } else if (entity.pos.y < 0) {
      entity.pos.y += canvasSize.y;
    }

    // X Axis
    if (entity.pos.x > canvasSize.x) {
      entity.pos.x -= canvasSize.x;
    } else if (entity.pos.x < 0) {
      entity.pos.x += canvasSize.x;
    }
  }
};
});

require.register("fab/distanceCheck.js", function(exports, require, module) {
'use strict';

var pytha = require('./pytha');

module.exports = function (ent1, ent2) {
  var pythaSol = pytha(ent1.pos, ent2.pos);
  return pythaSol < ent1.radius + ent2.radius;
};
});

require.register("fab/pytha.js", function(exports, require, module) {
"use strict";

module.exports = function (pos1, pos2) {
  return Math.sqrt((pos1.x - pos2.x) * (pos1.x - pos2.x) + (pos1.y - pos2.y) * (pos1.y - pos2.y));
};
});

require.register("fab/randHex.js", function(exports, require, module) {
'use strict';

module.exports = function () {
  return '#' + Math.random().toString(16).substr(-6);
};
});

require.register("fab/randInt.js", function(exports, require, module) {
"use strict";

module.exports = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
});

require.register("fab/squareCheck.js", function(exports, require, module) {
"use strict";

module.exports = function (ent1, ent2) {
  return !(ent1.pos.x + ent1.radius < ent2.pos.x - ent2.radius || ent1.pos.y + ent1.radius < ent2.pos.y - ent2.radius || ent1.pos.x - ent1.radius > ent2.pos.x + ent2.radius || ent1.pos.y - ent1.radius > ent2.pos.y + ent2.radius);
};
});

require.register("index.js", function(exports, require, module) {
'use strict';

document.addEventListener("DOMContentLoaded", function (event) {
  var update = require('./update');

  var menu = document.getElementById('menu');
  var startButton = document.getElementById('start');
  var scoreBoards = document.getElementById('scoreBoards');

  startButton.onclick = function () {
    menu.style.display = 'none';
    scoreBoards.style.display = 'block';

    update.renderLoop();
    update.secondsLoop();
  };
});
});

require.register("keyboard.js", function(exports, require, module) {
'use strict';

var Combokeys = require('combokeys');
var canvasInput = new Combokeys(document.documentElement);

var kb = {
  up: false, down: false, left: false, right: false
};

canvasInput.bind('up', function () {
  kb.up = true;
}, 'keydown');
canvasInput.bind('up', function () {
  kb.up = false;
}, 'keyup');
canvasInput.bind('down', function () {
  kb.down = true;
}, 'keydown');
canvasInput.bind('down', function () {
  kb.down = false;
}, 'keyup');
canvasInput.bind('left', function () {
  kb.left = true;
}, 'keydown');
canvasInput.bind('left', function () {
  kb.left = false;
}, 'keyup');
canvasInput.bind('right', function () {
  kb.right = true;
}, 'keydown');
canvasInput.bind('right', function () {
  kb.right = false;
}, 'keyup');

module.exports = kb;
});

require.register("scoreBoard.js", function(exports, require, module) {
'use strict';

var dom = {
  scoreBoards: document.getElementById('scoreBoards'),
  avoidingSeconds: document.getElementById('secondsAvoided'),
  secondsLeft: document.getElementById('secondsLeft'),
  amountCollected: document.getElementById('amountCollected')
};

module.exports = {
  avoidingSeconds: 0,
  secondsLeft: 20,
  amountCollected: 0,

  updateDOM: function updateDOM() {
    dom.avoidingSeconds.innerHTML = this.avoidingSeconds;
    dom.secondsLeft.innerHTML = this.secondsLeft;
    dom.amountCollected.innerHTML = this.amountCollected;
  },

  hide: function hide() {
    dom.scoreBoards.style.display = 'none';
  }
};
});

require.register("state.js", function(exports, require, module) {
"use strict";

module.exports = {
  avoiding: true,
  finished: false,

  hasMoved: false
};
});

require.register("update.js", function(exports, require, module) {
'use strict';

var vec2 = require('./vec2.js');
var randInt = require('./fab/randInt');
var randHex = require('./fab/randHex');

var entity = require('./entity');
var canvas = require('./canvas');
var keyboard = require('./keyboard');

var state = require('./state');

var scoreBoard = require('./scoreBoard');

var playerArray = [];
var bulletArray = [];

var frame = -1;
var seconds = -1;

canvas.resize();

var basePlayer = entity.basePlayer(canvas.getCenter());

function checkCollision(playerEntity) {
  for (var b = 0, bLen = bulletArray.length; b < bLen; b++) {
    if (bulletArray[b] && entity.checkCollision(playerEntity, bulletArray[b])) {
      var bulletToMove = bulletArray[b];

      playerArray.push(entity.create({
        radius: bulletToMove.radius,
        color: bulletToMove.color,
        pos: bulletToMove.pos,
        posOffset: vec2.sub(basePlayer.pos, bulletToMove.pos)
      }));

      bulletArray.splice(b, 1);

      if (state.avoiding) {
        state.avoiding = false;
        document.getElementById('avoidBoard').style.opacity = '0.25';
        document.getElementById('collectBoard').style.display = 'block';
      }

      scoreBoard.amountCollected++;
      scoreBoard.updateDOM();
    }
  }
}

function renderLoop() {
  frame++;
  canvas.clear();

  var canvasSize = canvas.getSize();

  if (!state.hasMoved) {
    canvas.img('thisIsYou', canvasSize.x / 2 - 70, canvasSize.y / 2 - 123);
    if (keyboard.up || keyboard.down || keyboard.left || keyboard.right) {
      state.hasMoved = true;
    }
  }

  for (var i = 0; i < bulletArray.length; i++) {
    if (bulletArray[i]) {
      var bulletEntity = bulletArray[i];

      entity.move(bulletEntity);
      entity.acel(bulletEntity);
      entity.swapAround(bulletEntity, canvasSize);

      canvas.circle(bulletEntity);
    }
  }

  entity.moveWithKeyboard(basePlayer, keyboard);
  entity.swapAround(basePlayer, canvasSize);
  canvas.outlineCircle(basePlayer);
  checkCollision(basePlayer);

  for (var p = 0; p < playerArray.length; p++) {
    var playerEntity = playerArray[p];

    entity.moveWithPlayer(playerEntity, basePlayer);
    entity.swapAround(playerEntity, canvasSize);

    canvas.circle(playerEntity);
    checkCollision(playerEntity);
  }

  if (!state.finished) {
    window.requestAnimationFrame(renderLoop);
  }
}

function secondsLoop() {
  seconds++;

  if (state.hasMoved) {
    if (state.avoiding) {
      scoreBoard.avoidingSeconds++;
    } else {
      scoreBoard.secondsLeft--;

      if (scoreBoard.secondsLeft <= 0) {
        state.finished = true;
      }
    }

    scoreBoard.updateDOM();

    if (bulletArray.length <= 130) {
      bulletArray.push(entity.create({
        radius: randInt(7, 14),
        color: randHex(),

        pos: canvas.getRandomBoundPoint(),
        maxVel: {
          x: Math.random() * seconds / 7 + 1,
          y: Math.random() * seconds / 7 + 1
        },
        acel: {
          x: Math.random() < 0.5 ? -0.005 : 0.005,
          y: Math.random() < 0.5 ? -0.005 : 0.005
        }
      }));
    }
  }

  if (!state.finished) {
    setTimeout(secondsLoop, 1000);
    //finish();
  } else {
    finish();
  }
}

function finish() {
  scoreBoard.hide();
  canvas.hide();
  document.getElementById('menuContainer').style.display = 'none';
  document.getElementById('finish').style.display = 'block';
}

module.exports = {
  renderLoop: renderLoop,
  secondsLoop: secondsLoop
};
});

require.register("vec2.js", function(exports, require, module) {
"use strict";

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
});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=bundle.js.map