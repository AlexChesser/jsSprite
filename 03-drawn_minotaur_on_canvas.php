<?php

?>
<html>
	<head>

	</head>
	<body>
		<canvas id='game' width=512 height=512> </canvas>
		<script type="text/javascript" src="assets/Sprite.js"></script>		
		<script type="text/javascript" src="assets/Minotaur.js"></script>
	</body>
	<script type="text/javascript">
		var canvas 		= document.getElementById('game');
		var MainContext = canvas.getContext('2d');		
		var m 			= newSprite(Minotaur());

		m.canvas = document.createElement('canvas');

		m.init(m.canvas);
		m.drawFrame();

		function DrawToParent() {
			
			MainContext.drawImage(m.canvas, 0, 0);
			
		}

		
		
	</script>
	
</html>