<?php

?>
<html>
	<head>
	</head>
	<body>
		<canvas id='game' width=1024 height=700> </canvas>
		<script type="text/javascript" src="assets/Sprite.js"></script>		
		<script type="text/javascript" src="assets/Minotaur.js"></script>
		<script type="text/javascript" src="assets/Zombie.js"></script>		
		<script type="text/javascript" src="assets/Keys.js"></script>		
	</body>
	<script type="text/javascript">
		var canvas 		= document.getElementById('game');
		var MainContext = canvas.getContext('2d');		
		var m 			= newSprite(Minotaur());
		var Zarr		= new Array();

		function mergeSort(arr) {
		    if (arr.length < 2)
		        return arr;

		    var middle = parseInt(arr.length / 2);
		    var left   = arr.slice(0, middle);
		    var right  = arr.slice(middle, arr.length);
		 
		    return merge(mergeSort(left), mergeSort(right));
		}
		 
		function merge(left, right)	{
		    var result = [];
		 
		    while (left.length && right.length) {
		        if (left[0].Ypos <= right[0].Ypos) {
		            result.push(left.shift());
		        } else {
		            result.push(right.shift());
		        }
		    }
		 
		    while (left.length)
		        result.push(left.shift());
		 
		    while (right.length)
		        result.push(right.shift());
		 
		    return result;
		}


		
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
			
			// Zarr = mergeSort(Zarr); // apparently not needed
			
			for (Z in Zarr) {  // For ZOMBIE in "Zombie Array" Aaaaarrrgghhh... 
				Zarr[Z].pointTo(m);
				Zarr[Z].drawFrame();
				
				MainContext.drawImage(Zarr[Z].canvas, Zarr[Z].Xpos, Zarr[Z].Ypos);
			};
			MainContext.drawImage(m.canvas, m.Xpos, m.Ypos);
		};
		gameInit();
		minoTimer = setInterval('runloop(m)', (1000/18));
		
	</script>
	
</html>