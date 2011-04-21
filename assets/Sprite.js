function newSprite(obj) {
	var Sprite = {
		is_ready:	false,
		type:		obj.type,
		canvas:		0,
		ctx:		0,
		img:		0,			// this becomes imagedata		
		img_src:	obj.img,	// the text path of the file for laoding
		cols: 		obj.cols,
		rows: 		obj.rows,
		width: 		obj.width,
		height:		obj.height,
		Xpos:		0,
		Ypos:		0,
		Xspd:		0,
		Yspd:		0,
		speed:		obj.speed,
		RunToXY:	0,
		actions:	obj.anim,	// this is the list of animations the sprite has
		anim:		0,			// this is the current animation the sprite is running
		frame: 		0,			// this is the current frame of the animation
		pause:		0,			// in order to use amazing frame rates, we need a pause for the animation.
		direction: 	0,			// this is the direction (of 8) it is running in
		dead:		0,
		debug:		0,
		init : function(c){
			Sprite.canvas = c;
			Sprite.canvas.setAttribute('width',  Sprite.width);
			Sprite.canvas.setAttribute('height', Sprite.height);
			Sprite.ctx = Sprite.canvas.getContext('2d');
			Sprite.loadImage(); 
			Sprite.anim = Sprite.actions.stand;
			Sprite.direction = 6;
		},
		loadImage: function(){  			
			Sprite.img = new Image();  		
			Sprite.img.onload = function(){ 
				Sprite.is_ready = true;
				Sprite.drawFrame();
				try {
					DrawToParent(); // 
				} catch (e) {
					
				}
			};
			Sprite.img.src = Sprite.img_src; 
		},
		getSpeed:	function() {
			var DirectionMap = {
				0 : [-1.0,  0.0],  // 0 - W
				1 : [-0.5, -0.5],  // 1 - NW
				2 : [ 0.0, -1.0],  // 2 - N 
				3 : [ 0.5, -0.5],  // 3 - NE
				4 : [ 1.0,  0.0],  // 4 - E
				5 : [ 0.5,  0.5],  // 5 - SE
				6 : [ 0.0,  1.0],  // 6 - S
				7 : [-0.5,  0.5]   // 7 - SW
			};
			dm = DirectionMap[Sprite.direction];
			Sprite.Xspd = dm[0] * Sprite.speed;
			Sprite.Yspd = dm[1] * Sprite.speed;
		},
		pointTo: function(pt){
			var xChk = Sprite.Xpos + (Sprite.width /2);
			var yChk = Sprite.Ypos + (Sprite.height /2);				
			var angle = Math.atan2(xChk-pt.Xpos,yChk-pt.Ypos);
			var d = angle * (180 / Math.PI);
			
			if (d <  -23 && d >=  -68) { Sprite.direction = 3; } else 
			if (d <  -68 && d >= -113) { Sprite.direction = 4; } else 
			if (d < -113 && d >= -158) { Sprite.direction = 5; } else 
			if (d >   23 && d <=   68) { Sprite.direction = 1; } else 
			if (d >   68 && d <=  113) { Sprite.direction = 0; } else 
			if (d >  113 && d <=  158) { Sprite.direction = 7; } else 
			if (Math.abs(d) <= 23) 	   { Sprite.direction = 2; } else 
			if (Math.abs(d) > 158) 	   { Sprite.direction = 6; } 
			
		},
		drawFrame: function(){
			Sprite.ctx.clearRect(0,0,Sprite.width,Sprite.height); //clear previous frame
			//MainContext.clearRect(Sprite.Xpos, Sprite.Ypos, Sprite.width, Sprite.height);
			if(Sprite.is_ready){ //do not draw if sprite is not ready
				//calculate values for sprite based on animation
				var srcX 		= Sprite.anim.start + (Sprite.frame * Sprite.width);
				var srcY 		= Sprite.direction * Sprite.height;
				var srcWidth 	= Sprite.width;
				var srcHeight 	= Sprite.height;
				
			    if (Sprite.debug == 1) {
					// draw a bounding box for debuggery
					Sprite.ctx.fillStyle = "rgb(100,0,100)";
				 	Sprite.ctx.strokeRect(0,0,Sprite.width,Sprite.height);
				}
				
				if (Sprite.RunToXY != 0) {
					Sprite.runTo(Sprite.RunToXY);
				} 
				if (Sprite.anim.name == 'run') {
					Sprite.getSpeed();
					Sprite.Xpos += Sprite.Xspd;
					Sprite.Ypos += Sprite.Yspd;
				}
				Sprite.ctx.drawImage(Sprite.img,
									srcX, srcY, srcWidth, srcHeight, 
									0, 0, srcWidth, srcHeight); //draw image
				Sprite.step(); //advance animation
				// Sprite.moveSprite(); //move sprite
			}
		},
		runTo: function(xy) {
			var O2 = {	Xpos: 	xy[0],
						Ypos:	xy[1],
						width:	1,
						height:	1};
			Sprite.pointTo(O2);
			if (Sprite.dirtyCollision(O2)) {		
				Sprite.RunToXY = 0;
				Sprite.anim = Sprite.actions.stand;
				Sprite.reanim();
			} else {
				Sprite.anim = Sprite.actions.run;
				var pt = {Xpos: xy[0], Ypos: xy[1]};
			}
		},
		turn: function(d) {
			nd = Sprite.direction + d; // new direction.
			if (nd < 0) { 
				nd = Sprite.rows - 1;
			} else if (nd >= Sprite.rows) {
				nd = 0;
			}
			Sprite.direction = nd;
		},
		reanim: function(){
			Sprite.frame = Sprite.anim.start;
			Sprite.anim.playdir = 1;
		},
		dirtyCollision: function(obj) {
			// Checks this sprite against another object:
		    var left1, left2;
		    var right1, right2;
		    var top1, top2;
		    var bottom1, bottom2;

		    left1 = Sprite.Xpos;
		    left2 = obj.Xpos;
		    right1 = Sprite.Xpos + Sprite.width;
		    right2 = obj.Xpos + obj.width;
		    top1 = Sprite.Ypos; 
		    top2 = obj.Ypos;
		    bottom1 = Sprite.Ypos + Sprite.height;
		    bottom2 = obj.Ypos + obj.height;

		    if (bottom1 < top2) return false;
		    if (top1 > bottom2) return false;
		    if (right1 < left2) return false;
		    if (left1 > right2) return false;

		    return true;
		},
		detailCollision: function(obj){
			// in the detail Collision, we've got to first grab the area of both images
			// that are overlapping, then we'll check each pixel in that area and 
			// compare
			
			// start the same way as a dirty collision
		    
		    var left1, left2, over_left;
		    var right1, right2, over_right;
		    var top1, top2, over_top;
		    var bottom1, bottom2, over_bottom;
		    var over_width, over_height;
		    var i, j;

		    left1 = Sprite.Xpos;
		    left2 = obj.Xpos;
		    right1 = Sprite.Xpos + Sprite.width;
		    right2 = obj.Xpos + obj.width;
		    top1 = Sprite.Ypos;
		    top2 = obj.Ypos;
		    bottom1 = Sprite.Ypos + Sprite.height;
		    bottom2 = obj.Ypos + obj.height;		    
		    
		    // Trivial Detections (will tune later)
		    if (bottom1 < top2) return false;
		    if (top1 > bottom2) return false;
		    if (right1 < left2) return false;
		    if (left1 > right2) return false;
		    
		    
		    // Ok, compute the rectangle of overlap:		    
		    if (bottom1 > bottom2)  {	over_bottom = bottom2; 
		    } else { 					over_bottom = bottom1; }
		 
		    if (top1 < top2) 		{	over_top = top2; 
		    } else { 					over_top = top1; }

		    if (right1 > right2) 	{	over_right = right2; 
		    } else { 					over_right = right1; }

		    if (left1 < left2)  	{	over_left = left2; 
		    } else {					over_left = left1; }

		    if (Sprite.debug == 1) {
		    	// again for the purposes of global debuggery I thought it'd be nice to be able to 
		    	// draw the area of overlap, but without ruining all other tests
		    	MainContext.fillStyle = "rgb(200,0,0)";
		    	MainContext.fillRect (over_left, over_top, over_right-over_left, over_bottom-over_top);
		    }
		    overlap_width = over_right-over_left;
		    overlap_height = over_bottom-over_top;
		    
		    if (Sprite.Xpos > obj.Xpos) {
		    	// read the data start at the sprite's right side
		    	var sprite_data_x_start = Sprite.Xpos	+Sprite.width	-overlap_width;
		    	var obj_data_x_start 	= obj.Xpos;
		    } else {
		    	// read the data from the sprites left.
		    	var sprite_data_x_start = Sprite.Xpos;
		    	var obj_data_x_start 	= obj.Xpos	+obj.width			-overlap_width;		    	
		    }
		    
		    if (Sprite.Ypos > obj.Ypos) {
		    	// read the data start at the sprite's right side
		    	var sprite_data_y_start = Sprite.Ypos	+Sprite.height	-overlap_height;
		    	var obj_data_y_start 	= obj.Ypos;
		    } else {
		    	// read the data from the sprites left.
		    	var sprite_data_y_start = Sprite.Ypos;
		    	var obj_data_y_start 	= obj.Ypos	+obj.height			-overlap_height;		    	
		    }
		    
		    
		    // 1. get the coordinates of the overlapped area for box object1
		    // 2. get the coordinates of the overlapped area for this Sprite
		    // 3. get the data for each into an array using GETIMAGEDATA
		    //		eg:
		    var sprite_overlap_image = Sprite.ctx.getImageData(	sprite_data_x_start, 
		    													sprite_data_y_start, 
		    													overlap_width, 
		    													overlap_height);
		    var obj_overlap_image = obj.ctx.getImageData(		obj_data_x_start, 
																obj_data_y_start, 
																overlap_width, 
																overlap_height);
		    
		    
		    //soid	= sprite_overlap_image.data;
		    soid = sprite_overlap_image;
	    	GlobalWatchSOID = sprite_overlap_image;
	    	GlobalWatchOOID = obj_overlap_image;	    	
		    ooid	= obj_overlap_image;
		    
		    //MainContext.putImageData(sprite_overlap_image.data, 100, 100);
		    //MainContext.putImageData(obj_overlap_image.data, 	400, 400);
		    
		    for (idx in soid.data) {
		    	if (!isNaN(idx)) {
			    	if (!(soid.data.idx === 0 && ooid.data.idx === 0)) {
			    		//return true;
			    		//console.log(idx + ' ' + soid.data[idx] + ' omg hit! ' + ooid.data[idx]);
			    	}
		    	}
		    }
		    return false;			
		    
		    
		    //		var object_overlap_image = obj.ctx.getImageData(obj.XStart, obj.YStart, obj.width, obj.height);
		    // 4. loop through each element in the area looking for a spot where they are both NOT the alpha color
		    //
		    //		eg:
		    //		soid	= sprite_overlap_image.data;
		    //		ooid	= object_overlap_image.data;
		    //		for (idx in soid) {
			//			if (soid[idx] != 0 && ooid[idx] != 0) {
		    //				return true;
		    // 			}
			//		}
		    //		return false;
	
		    
		    
		},
		step: function() {
			var cf  = Sprite.frame; // the current frame we are on
			var an  = Sprite.anim;  // the current anim we are running
			var nf  = cf + an.playdir; // this is the next frame
			if (nf >= an.start+an.length || nf < an.start) {
				// this means we must take action
				switch(an.end) {
					case 'reverse':
						an.playdir *= -1;
						nf  = cf + an.playdir;
						break;
					case 'hold':
						an.playdir = 0;
						nf  = cf + an.playdir;
						break;
					case 'loop':
						nf = an.start;
						break;
					default:
				}
			}
			Sprite.frame = nf;
		}
			
	};
	return Sprite;
}