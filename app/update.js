'use strict';

const vec2 = require('./vec2');
const {randInt, randHex} = require('./utils');

const entity = require('./entity');
const canvas = require('./canvas');
const keyboard = require('./keyboard');

const state = require('./state');

const scoreBoard = require('./score-board');

const playerArray = [];
const bulletArray = [];

let seconds = -1;

canvas.resize();

const basePlayer = entity.basePlayer(canvas.getCenter());

function checkCollision(playerEntity) {
	for (let b = 0, bLen = bulletArray.length; b < bLen; b++) {
		if (bulletArray[b] && entity.checkCollision(playerEntity, bulletArray[b])) {
			const bulletToMove = bulletArray[b];

			playerArray.push(entity.create({
				radius: bulletToMove.radius,
				color: bulletToMove.color,
				pos: bulletToMove.pos,
				posOffset: vec2.sub(basePlayer.pos, bulletToMove.pos),
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

function finish() {
	scoreBoard.hide();
	canvas.hide();
	document.getElementById('menuContainer').style.display = 'none';
	document.getElementById('finish').style.display = 'block';
}

function renderLoop() {
	canvas.clear();

	const canvasSize = canvas.getSize();

	if (!state.hasMoved) {
		canvas.img('thisIsYou', canvasSize.x / 2 - 70, canvasSize.y / 2 - 123);
		if (keyboard.up || keyboard.down || keyboard.left || keyboard.right) {
			state.hasMoved = true;
		}
	}

	for (let i = 0; i < bulletArray.length; i++) {
		if (bulletArray[i]) {
			const bulletEntity = bulletArray[i];

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

	for (let p = 0; p < playerArray.length; p++) {
		const playerEntity = playerArray[p];

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
		}
		else {
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
					x: (Math.random() * seconds / 7) + 1,
					y: (Math.random() * seconds / 7) + 1,
				},
				acel: {
					x: Math.random() < 0.5 ? -0.005 : 0.005,
					y: Math.random() < 0.5 ? -0.005 : 0.005,
				},
			}));
		}
	}

	if (state.finished) {
		finish();
	}
	else {
		setTimeout(secondsLoop, 1000);
	}
}

module.exports = {
	renderLoop,
	secondsLoop,
};
