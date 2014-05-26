<?php
//
//  

?>
<html>
	<head>
	</head>
	<body>
		<input id='message_1' />  		<input id='message_2' />
		<input id='message_3' />
		<br/> 
		<br/>
		<style>canvas canvas {border: 1px solid black;}</style>
		<canvas id='game' width=1024 height=700 style="border: 1px solid black;"> </canvas>
		<script type="text/javascript" src="assets/Sprite.js"></script>		
		<script type="text/javascript" src="assets/Minotaur.js"></script>
		<script type="text/javascript" src="assets/Zombie.js"></script>		
		<script type="text/javascript" src="assets/Keys.js"></script>
		<script type="text/javascript" src="assets/Mouse.js"></script>
		<textarea id='fufufu' rows="100" cols="80"></textarea>

		
	</body>
	<script type="text/javascript">
	var msg1 = document.getElementById('message_1');
	var msg2 = document.getElementById('message_2');
	var msg3 = document.getElementById('message_3');	
	var fffffffuuuuuuuuuuuu;
	
		var canvas 		= document.getElementById('game');
		var MainContext = canvas.getContext('2d');		
		var m 			= newSprite(Minotaur());
		var Zarr		= new Array();
		
		gameInit = function(){
			m.canvas = document.createElement('canvas');
			m.init(m.canvas);
			for (var i=0; i <= 4; i=i+1) {
				Zarr[i] = newSprite(Zombie());
				Zarr[i].canvas = document.createElement('canvas');
				Zarr[i].Xpos = (Math.floor(Math.random()*400));
				Zarr[i].Ypos = (Math.floor(Math.random()*400));
				Zarr[i].init(Zarr[i].canvas);
				Zarr[i].anim = Zarr[i].actions.run;
			};
		};
		runloop = function(m) {
			MainContext.clearRect(0,0,canvas.width,canvas.height);
				
			m.drawFrame();
			
			for (Z in Zarr) {  // For ZOMBIE in "Zombie Array" Aaaaarrrgghhh... 
				var zmb = Zarr[Z];  // shorthand 
				
				zmb.drawFrame();
				if (!zmb.dead) {
					zmb.pointTo(m);
					if (zmb.dirtyCollision(m)) {
						zmb.dead = 1;
						zmb.anim = zmb.actions.crit;
						zmb.reanim();
					}
				};
				MainContext.drawImage(zmb.canvas, zmb.Xpos, zmb.Ypos);
			};
			MainContext.drawImage(m.canvas, m.Xpos, m.Ypos);

			// OK - obviously getting a little tired at the moment, but this code as actually
			// pretty useful.  What I've managed to do in this space is take a small sample of 
			// the canvas and read it into memory
			//
			// then I loop through each "pixel" in that memory space and can read the color at that spot
			// when I run this script from the 0,0 corner - (where) every pixel in the array is "whitespace" 
			// the value comes out as "0"
			//
			// As you can see from this one, the value comes out as numbers (each probably representing a color value
			// I wonder if "255" is the shadow, or maybe it's black?  Who knows?  From here it's time 
			// to try a bit more stuff
			
			var fufufu = document.getElementById('fufufu');	
			if (m.is_ready && m.dead == 0) {   // there's a lot of data, only read once
				m.dead = 1;  					
				fffffffuuuuuuuuuuuu = MainContext.getImageData(m.Xpos+64, m.Ypos+64, 10, 10);  // read a small chunk
																							   // to debug, will do this with the whole overlap area
				for (f in fffffffuuuuuuuuuuuu.data) {
					fufufu.value = fufufu.value + '\n' + fffffffuuuuuuuuuuuu.data[f];    // the data sits at (getImageData).data
				}
			}
			
			
			msg1.value = m.Xpos +','+m.Ypos;
			msg2.value = m.RunToXY;
		};
		gameInit();
		minoTimer = setInterval('runloop(m)', (1000/15));

	</script>
	
</html>