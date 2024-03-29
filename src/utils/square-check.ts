import type { Entity } from "../types";

export const squareCheck = (ent1: Entity, ent2: Entity) =>
	!(
		ent1.pos.x + ent1.radius < ent2.pos.x - ent2.radius ||
		ent1.pos.y + ent1.radius < ent2.pos.y - ent2.radius ||
		ent1.pos.x - ent1.radius > ent2.pos.x + ent2.radius ||
		ent1.pos.y - ent1.radius > ent2.pos.y + ent2.radius
	);
