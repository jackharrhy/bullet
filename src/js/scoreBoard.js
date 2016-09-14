var dom = {
	scoreBoards: document.getElementById('scoreBoards'),
	avoidingSeconds: document.getElementById('secondsAvoided'),
	secondsLeft: document.getElementById('secondsLeft'),
	amountCollected: document.getElementById('amountCollected')
};

module.exports = {
	avoidingSeconds: 0,
	secondsLeft: 20,
	amountCollected: 0,

	updateDOM: function() {
		dom.avoidingSeconds.innerHTML = this.avoidingSeconds;
		dom.secondsLeft.innerHTML = this.secondsLeft;
		dom.amountCollected.innerHTML = this.amountCollected;
	},

	hide: function() {
		dom.scoreBoards.style.display = 'none';
	}
};
