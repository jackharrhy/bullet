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
  for(var b=0, bLen=bulletArray.length; b < bLen; b++) {
    if(bulletArray[b] && entity.checkCollision(playerEntity,bulletArray[b])) {
      let bulletToMove = bulletArray[b];

      playerArray.push(entity.create({
        radius: bulletToMove.radius,
        color: bulletToMove.color,
        pos: bulletToMove.pos,
        posOffset: vec2.sub(basePlayer.pos, bulletToMove.pos)
      }));

      bulletArray.splice(b,1);

      if(state.avoiding) {
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

  if(!state.hasMoved) {
    canvas.img('thisIsYou',canvasSize.x / 2 - (70),canvasSize.y / 2 - (123));
    if(keyboard.up || keyboard.down || keyboard.left || keyboard.right) {
      state.hasMoved = true;
    }
  }

  for(var i=0; i < bulletArray.length; i++) {
    if(bulletArray[i]) {
      let bulletEntity = bulletArray[i];

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

  for(var p=0; p < playerArray.length; p++) {
    let playerEntity = playerArray[p];

    entity.moveWithPlayer(playerEntity, basePlayer);
    entity.swapAround(playerEntity, canvasSize);

    canvas.circle(playerEntity);
    checkCollision(playerEntity);
  }

  if(!state.finished) {
    window.requestAnimationFrame(renderLoop);
  }
}

function secondsLoop() {
  seconds++;

  if(state.hasMoved) {
    if(state.avoiding) {
      scoreBoard.avoidingSeconds++;
    } else {
      scoreBoard.secondsLeft--;

      if(scoreBoard.secondsLeft <= 0) {
        state.finished = true;
      }
    }

    scoreBoard.updateDOM();

    if(bulletArray.length <= 130) {
      bulletArray.push(entity.create({
        radius: randInt(7,14),
        color: randHex(),

        pos: canvas.getRandomBoundPoint(),
        maxVel: {
          x: ((Math.random() * seconds/7) + 1),
          y: ((Math.random() * seconds/7) + 1)
        },
        acel: {
          x: Math.random() < 0.5 ? -0.005 : 0.005,
          y: Math.random() < 0.5 ? -0.005 : 0.005
        }
      }));
    }
  }

  if(!state.finished) {
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
