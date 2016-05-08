var kb = {
	up: false,
	down: false,
	right: false,
	left: false
};
Mousetrap.bind('up',    function() { kb.up    = true;  }, 'keydown');
Mousetrap.bind('up',    function() { kb.up    = false; }, 'keyup');
Mousetrap.bind('down',  function() { kb.down  = true;  }, 'keydown');
Mousetrap.bind('down',  function() { kb.down  = false; }, 'keyup');
Mousetrap.bind('right', function() { kb.right = true;  }, 'keydown');
Mousetrap.bind('right', function() { kb.right = false; }, 'keyup');
Mousetrap.bind('left',  function() { kb.left  = true;  }, 'keydown');
Mousetrap.bind('left',  function() { kb.left  = false; }, 'keyup');
