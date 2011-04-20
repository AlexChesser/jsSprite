<?php

?>
<html>
	<head>
		<style type="text/css">
			.mino {
				width: 18px;
				height: 18px;	
			}
		</style>
	</head>
	<body>
		Note that the latest is available on Github <br/>
	
		<a href="01-draw_minotaur.php">Test 1 - Draw Minotaur</a><br/>
		<a href="02-animate_minotaur.php">Test 2 - Animate Minotaur</a><br/>
		<a href="02a-animate_minotaur_keyDirections.php">Test 2 - Animate Minotaur with Keys</a><br/>
		<a href="02a-animate_zombie_keyDirections.php">Test 2 - Animate Zombie with Keys</a><br/>		
		<a href="03-drawn_minotaur_on_canvas.php">Test 3 - Drawn Minotaur on Canvas</a><br/>
		<a href="04-animated_minotaur_on_canvas.php">Test 4 - Animated Minotaur on Canvas</a><br/>
		<a href="05-animated_minotaur_on_canvas_and_zombies.php">Test 5 - Animated Minotaur and Zombies</a><br/>		
		<a href="06-brainnsss....php">Test 6 - Brainssss....</a><br/>
		<a href="07-sort_zombies.php">Test 7 - Sort Zombies</a><br/>
		<a href="08-mouse_move.php">Test 8 - Mouse move</a><br/>		
		<a href="09-zombie-explosion.php">Test 9 - Zombie Explosion</a><br/>				
		<a href="10-better-directions.php">Test 10 - better directions</a><br/>
		<a href="11-first-read-pixels-in-an-image.php">Test 11 - heavy lifting before pixel perfect collision</a><br/>
		<a href="12-glorious.php">Test 12 - Grlorious!</a><br/>
		<a href="13-more-pixel-detection.php">Test 13 - ok, back to collisions</a><br/>

<p/>

This is some scribbles, don't have time to work on perfect collisions - but can doodle a circle  

<canvas id='canvas' height=1000 width=1000></canvas>

<script>
		
		
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');

  // Create gradients
  var radgrad = ctx.createRadialGradient(300,300,100,300,300,300);
  radgrad.addColorStop(0, '#A7D30C');
  radgrad.addColorStop(0.9, '#019F62');
  radgrad.addColorStop(1, 'rgba(1,159,98,0)');
  
  var radgrad2 = ctx.createRadialGradient(105,105,20,112,120,50);
  radgrad2.addColorStop(0, '#FF5F98');
  radgrad2.addColorStop(0.75, '#FF0188');
  radgrad2.addColorStop(1, 'rgba(255,1,136,0)');

  var radgrad3 = ctx.createRadialGradient(95,15,15,102,20,40);
  radgrad3.addColorStop(0, '#00C9FF');
  radgrad3.addColorStop(0.8, '#00B5E2');
  radgrad3.addColorStop(1, 'rgba(0,201,255,0)');

  var radgrad4 = ctx.createRadialGradient(0,150,50,0,140,90);
  radgrad4.addColorStop(0, '#F4F201');
  radgrad4.addColorStop(0.8, '#E4C700');
  radgrad4.addColorStop(1, 'rgba(228,199,0,0)');
  
  // draw shapes
  ctx.fillStyle = radgrad4;
  ctx.fillRect(0,0,450,450);
  
  ctx.fillStyle = radgrad3;
  ctx.fillRect(0,0,150,150);
  ctx.fillStyle = radgrad2;
  ctx.fillRect(0,0,150,150);

  
  ctx.fillStyle = radgrad;
  ctx.fillRect(0,0,1000,1000);
}
draw();
</script>
		
	</body>
</html>
