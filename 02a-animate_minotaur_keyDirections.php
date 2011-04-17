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

		document.addEventListener("keypress", 
			function(e){
				switch(e.charCode) {
					case 119:  // 'w'
				  		m.direction = 2;
				  		break;				
					case 97:  // 's'
				  		m.direction = 0;
				  		break;
					case 115:  // 's'
				  		m.direction = 6;
				  		break;
					case 100:  // 'd'
						m.direction = 4;
				  		break;
						default:
				  			//code to be executed if n is different from case 1 and 2
				}
				//m.direction = 0;
			}, false);
		
		
		
	</script>
	
</html>