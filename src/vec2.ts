import type { Vec2 } from "./types";

export function add(firstVec: Vec2, secondVec: Vec2): Vec2 {
	return { x: firstVec.x + secondVec.x, y: firstVec.y + secondVec.y };
}

export function sub(firstVec: Vec2, secondVec: Vec2): Vec2 {
	return { x: firstVec.x - secondVec.x, y: firstVec.y - secondVec.y };
}

export function multi(firstVec: Vec2, secondVec: Vec2): Vec2 {
	return { x: firstVec.x * secondVec.x, y: firstVec.y * secondVec.y };
}
