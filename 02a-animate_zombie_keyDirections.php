<?php

?>
<html>
	<head>

	</head>
	<body>
		<canvas id='game' style='width: 128px; height: 128px;'> </canvas>
		<script type="text/javascript" src="assets/Sprite.js"></script>		
		<script type="text/javascript" src="assets/Zombie.js"></script>
	</body>
	<script type="text/javascript">
		var canvas 		= document.getElementById('game');
		var MainContext = canvas.getContext('2d');		
		var m 			= newSprite(Zombie());
		
		m.init(canvas);

		runloop = function(m) {
			m.drawFrame();
		};
		
		minoTimer = setInterval('runloop(m)', (1000/4));

		document.addEventListener("keypress", 
			function(e){
				switch(e.which) {
					case 119:  // 'w'
				  		m.anim = m.actions.run;
				  		m.reanim();
				  		break;
					case 97:  // 'a' - turn right
				  		m.turn(-1);				  		
				  		break;
					case 115:  // 's'
				  		m.anim = m.actions.stand;
				  		m.reanim();
				  		break;
					case 100:  // 'd' - turn left
				  		m.turn(1);
				  		break;
					case 101: // e = attack
				  		m.anim = m.actions.block;
				  		m.reanim();
				  		break;
					case 120: // x = die
				  		m.anim = m.actions.die;
				  		m.reanim();
				  		break;				  		
					case 113: // q = attack
				  		m.anim = m.actions.attack;
				  		m.reanim();
				  		break;
					case 99: // c = crit
				  		m.anim = m.actions.crit;
				  		m.reanim();
				  		break;
					case 98: // b = crit
				  		m.anim = m.actions.brains;
				  		m.reanim();
				  		break;				  				  		
						default:
				  			//code to be executed if n is different from case 1 and 2
				}
				//m.direction = 0;
			}, false);
		
		
		
	</script>
	
</html>