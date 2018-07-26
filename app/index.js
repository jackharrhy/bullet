document.addEventListener("DOMContentLoaded", function(event) {
  var update = require('./update');

  var menu = document.getElementById('menu');
  var startButton = document.getElementById('start');
  var scoreBoards = document.getElementById('scoreBoards');

  startButton.onclick = function() {
    menu.style.display = 'none';
    scoreBoards.style.display = 'block';

    update.renderLoop();
    update.secondsLoop();
  };
});
