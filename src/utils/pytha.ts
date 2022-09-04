import type { Vec2 } from "../types";

export const pytha = (pos1: Vec2, pos2: Vec2) =>
	Math.sqrt(
		(pos1.x - pos2.x) * (pos1.x - pos2.x) +
			(pos1.y - pos2.y) * (pos1.y - pos2.y)
	);
