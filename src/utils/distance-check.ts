import { Entity } from "../types";
import { pytha } from "./pytha";

export const distanceCheck = (ent1: Entity, ent2: Entity) => {
	const pythaSol = pytha(ent1.pos, ent2.pos);
	return pythaSol < ent1.radius + ent2.radius;
};
