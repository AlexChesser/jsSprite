<?php

?>
<html>
	<head>
	</head>
	<body>
		<canvas id='game' width=1024 height=700> </canvas>
		<script type="text/javascript" src="assets/Sprite.js"></script>		
		<script type="text/javascript" src="assets/Minotaur.js"></script>
		<script type="text/javascript" src="assets/Keys.js"></script>		
	</body>
	<script type="text/javascript">
		var canvas 		= document.getElementById('game');
		var MainContext = canvas.getContext('2d');		
		var m 			= newSprite(Minotaur());

		m.canvas = document.createElement('canvas');
		m.init(m.canvas);

		runloop = function(m) {
			m.drawFrame();
			MainContext.drawImage(m.canvas, m.Xpos, m.Ypos);
			
		};
		minoTimer = setInterval('runloop(m)', (1000/18));
		
	</script>
	
</html>