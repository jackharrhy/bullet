const dom = {
	scoreBoards: document.getElementById("scoreBoards") as HTMLElement,
	avoidingSeconds: document.getElementById("secondsAvoided") as HTMLElement,
	secondsLeft: document.getElementById("secondsLeft") as HTMLElement,
	amountCollected: document.getElementById("amountCollected") as HTMLElement,
};

class ScoreBoardState {
	avoidingSeconds = 0;
	secondsLeft = 20;
	amountCollected = 0;
}

export const scoreBoardState = new ScoreBoardState();

export const updateDOM = () => {
	dom.avoidingSeconds.innerHTML = scoreBoardState.avoidingSeconds.toString();
	dom.secondsLeft.innerHTML = scoreBoardState.secondsLeft.toString();
	dom.amountCollected.innerHTML = scoreBoardState.amountCollected.toString();
};

export const hide = () => {
	dom.scoreBoards.style.display = "none";
};
