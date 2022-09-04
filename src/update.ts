import * as vec2 from "./vec2";
import * as entity from "./entity";
import * as canvas from "./canvas";
import { kb } from "./keyboard";
import state from "./state";
import * as scoreBoard from "./score-board";
import type { Entity } from "./types";
import { randInt } from "./utils/rand-int";
import { randHex } from "./utils/rand-hex";

const playerArray = [] as Entity[];
const bulletArray = [] as Entity[];

let seconds = -1;

canvas.resize();

const basePlayer = entity.basePlayer(canvas.getCenter());

const checkCollision = (playerEntity: Entity) => {
	for (let b = 0, bLen = bulletArray.length; b < bLen; b++) {
		if (
			bulletArray[b] &&
			entity.checkCollision(playerEntity, bulletArray[b])
		) {
			const bulletToMove = bulletArray[b];

			playerArray.push(
				entity.create({
					radius: bulletToMove.radius,
					color: bulletToMove.color,
					pos: bulletToMove.pos,
					posOffset: vec2.sub(basePlayer.pos, bulletToMove.pos),
				})
			);

			bulletArray.splice(b, 1);

			if (state.avoiding) {
				state.avoiding = false;
				(
					document.getElementById("avoidBoard") as HTMLElement
				).style.opacity = "0.25";
				(
					document.getElementById("collectBoard") as HTMLElement
				).style.display = "block";
			}

			scoreBoard.scoreBoardState.amountCollected++;
			scoreBoard.updateDOM();
		}
	}
};

const finish = () => {
	scoreBoard.hide();
	canvas.hide();
	(document.getElementById("menuContainer") as HTMLElement).style.display =
		"none";
	(document.getElementById("finish") as HTMLElement).style.display = "block";
};

export const renderLoop = () => {
	canvas.clear();

	const canvasSize = canvas.getSize();

	if (!state.hasMoved) {
		canvas.img("thisIsYou", canvasSize.x / 2 - 70, canvasSize.y / 2 - 123);
		if (kb.up || kb.down || kb.left || kb.right) {
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

	entity.moveWithKeyboard(basePlayer, kb);
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
};

export const secondsLoop = () => {
	seconds++;

	if (state.hasMoved) {
		if (state.avoiding) {
			scoreBoard.scoreBoardState.avoidingSeconds++;
		} else {
			scoreBoard.scoreBoardState.secondsLeft--;

			if (scoreBoard.scoreBoardState.secondsLeft <= 0) {
				state.finished = true;
			}
		}

		scoreBoard.updateDOM();

		if (bulletArray.length <= 130) {
			bulletArray.push(
				entity.create({
					radius: randInt(7, 14),
					color: randHex(),

					pos: canvas.getRandomBoundPoint(),
					maxVel: {
						x: (Math.random() * seconds) / 7 + 1,
						y: (Math.random() * seconds) / 7 + 1,
					},
					acel: {
						x: Math.random() < 0.5 ? -0.005 : 0.005,
						y: Math.random() < 0.5 ? -0.005 : 0.005,
					},
				})
			);
		}
	}

	if (state.finished) {
		finish();
	} else {
		setTimeout(secondsLoop, 1000);
	}
};
