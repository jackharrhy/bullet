'use strict';

import 'normalize.css';
import './styles/main.scss';

document.addEventListener('DOMContentLoaded', () => {
	const update = require('./update');

	const menu = document.getElementById('menu');
	const startButton = document.getElementById('start');
	const scoreBoards = document.getElementById('scoreBoards');

	startButton.onclick = () => {
		menu.style.display = 'none';
		scoreBoards.style.display = 'block';

		update.renderLoop();
		update.secondsLoop();
	};
});
