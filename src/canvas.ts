import { Entity, Vec2 } from "./types";
import { randInt } from "./utils/rand-int";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const c = canvas.getContext("2d") as CanvasRenderingContext2D;

const imgs = {
	thisIsYou: document.getElementById("imgthisIsYou") as HTMLImageElement,
};

export const getSize = () => ({ x: window.innerWidth, y: window.innerHeight });
export const getCenter = () => {
	return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
};
export const getRandomBoundPoint = () => {
	if (Math.random() >= 0.5) {
		return { x: randInt(0, window.innerWidth), y: 0 };
	}
	return { x: 0, y: randInt(0, window.innerHeight) };
};

export const resize = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

export const hide = () => {
	canvas.style.display = "none";
};

export const img = (imgStr: string, x: number, y: number) => {
	c.drawImage(imgs[imgStr as keyof typeof imgs], x, y);
};

export const circle = (entity: Entity) => {
	c.fillStyle = entity.color;
	c.beginPath();
	c.arc(entity.pos.x, entity.pos.y, entity.radius, 0, 2 * Math.PI);
	c.fill();
};

export const outlineCircle = (entity: Entity) => {
	c.fillStyle = entity.color;
	c.strokeStyle = entity.strokeColor ?? "";
	c.beginPath();
	c.arc(entity.pos.x, entity.pos.y, entity.radius, 0, 2 * Math.PI);
	c.fill();
	c.stroke();
};

export const clear = () => {
	c.fillStyle = "white";
	c.fillRect(0, 0, canvas.width, canvas.height);
};

export const text = (pos: Vec2, text: string, size: number, color: string) => {
	c.fillStyle = color;
	c.font = `${size.toString()}px Helvetica`;
	c.fillText(text, pos.x, pos.y);
};
