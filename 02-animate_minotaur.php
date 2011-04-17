<?php

?>
<html>
	<head>

	</head>
	<body>
		<canvas id='game' style='width: 128px; height: 128px;'> </canvas>
		<script type="text/javascript" src="assets/Sprite.js"></script>		
		<script type="text/javascript" src="assets/Minotaur.js"></script>
	</body>
	<script type="text/javascript">
		var canvas 		= document.getElementById('game');
		var MainContext = canvas.getContext('2d');		
		var m 			= newSprite(Minotaur());
		
		m.init(canvas);

		runloop = function(m) {
			m.drawFrame();
		};
		
		minoTimer = setInterval('runloop(m)', (1000/5));


		
		
	</script>
	
</html>