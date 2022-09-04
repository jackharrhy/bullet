export type Vec2 = { x: number; y: number };

export type Entity = {
	radius: number;
	color: string;
	outlineColor?: string;
	strokeColor?: string;
	pos: Vec2;
	posOffset: Vec2;
	vel: Vec2;
	maxVel: Vec2;
	acel: Vec2;
};
