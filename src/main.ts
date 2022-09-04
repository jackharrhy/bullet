document.addEventListener("DOMContentLoaded", async () => {
	await import("./style.css");
	await import("normalize.css");
	const update = await import("./update");

	const menu = document.getElementById("menu") as HTMLElement;
	const startButton = document.getElementById("start") as HTMLElement;
	const scoreBoards = document.getElementById("scoreBoards") as HTMLElement;

	startButton.onclick = () => {
		menu.style.display = "none";
		scoreBoards.style.display = "block";

		update.renderLoop();
		update.secondsLoop();
	};
});
