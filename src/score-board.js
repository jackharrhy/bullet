'use strict';

const dom = {
	scoreBoards: document.getElementById('scoreBoards'),
	avoidingSeconds: document.getElementById('secondsAvoided'),
	secondsLeft: document.getElementById('secondsLeft'),
	amountCollected: document.getElementById('amountCollected'),
};

module.exports = {
	avoidingSeconds: 0,
	secondsLeft: 20,
	amountCollected: 0,

	updateDOM() {
		dom.avoidingSeconds.innerHTML = this.avoidingSeconds;
		dom.secondsLeft.innerHTML = this.secondsLeft;
		dom.amountCollected.innerHTML = this.amountCollected;
	},

	hide() {
		dom.scoreBoards.style.display = 'none';
	},
};
