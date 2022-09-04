import type { Entity, Vec2 } from "./types";
import { distanceCheck } from "./utils/distance-check";
import { squareCheck } from "./utils/square-check";
import * as vec2 from "./vec2";
import { kb } from "./keyboard";

const limit1DVel = (vel: number, maxVel: number) => {
	if (vel > 0) {
		return vel >= maxVel ? maxVel : vel;
	}
	return vel <= -maxVel ? -maxVel : vel;
};

const limitVel = (entity: Entity) => ({
	x: limit1DVel(entity.vel.x, entity.maxVel.x),
	y: limit1DVel(entity.vel.y, entity.maxVel.y),
});

export const create = (frag: Partial<Entity>) => ({
	radius: frag.radius || 4,
	color: frag.color || "black",
	outlineColor: frag.outlineColor,
	strokeColor: frag.strokeColor,

	pos: frag.pos || { x: 0, y: 0 },
	posOffset: frag.posOffset || { x: 0, y: 0 },

	vel: frag.vel || { x: 0, y: 0 },
	maxVel: frag.maxVel || { x: 0, y: 0 },

	acel: frag.acel || { x: 0, y: 0 },
});

export const basePlayer = (center: Vec2) =>
	create({
		radius: 5,
		color: "white",
		outlineColor: "black",

		pos: center,

		maxVel: { x: 3, y: 3 },
		acel: { x: 0.4, y: 0.4 },
	});

export const checkCollision = (ent1: Entity, ent2: Entity) =>
	squareCheck(ent1, ent2) && distanceCheck(ent1, ent2);

export const acel = (entity: Entity) => {
	entity.vel.y += entity.acel.y;
	entity.vel.x += entity.acel.x;
};

export const move = (entity: Entity) => {
	entity.vel = limitVel(entity);

	entity.pos = vec2.add(entity.pos, entity.vel);
};

export const moveWithKeyboard = (entity: Entity, keyboard: typeof kb) => {
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

	move(entity);
};

export const moveWithPlayer = (entity: Entity, basePlayer: Entity) => {
	entity.pos = vec2.sub(basePlayer.pos, entity.posOffset);
};

export const swapAround = (entity: Entity, canvasSize: Vec2) => {
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
};
