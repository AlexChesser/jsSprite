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
		    
		    if (bottom1 > bottom2) over_bottom = bottom2;
		    else over_bottom = bottom1;
		    
		    if (top1 < top2) over_top = top2;
		    else over_top = top1;

		    if (right1 > right2) over_right = right2;
		    else over_right = right1;

		    if (left1 < left2) over_left = left2;
		    else over_left = left1;
		    
		    console.log('ob:'+over_bottom+' ot: '+over_top+' or: '+over_right+' ol: '+over_left);
		    
		    /*
			    // Now compute starting offsets into both objects' bitmaps:
			    i = ((over_top - object1.y) * object1.width) + over_left;
			    pixel1 = object1.frames[object1.curr_frame] + i;
			
			    j = ((over_top - object2.y) * object2.width) + over_left;
			    pixel2 = object2.frames[object2.curr_frame] + j;
			
			  
			    // Now start scanning the whole rectangle of overlap,
			    // checking the corresponding pixel of each object's
			    // bitmap to see if they're both non-zero:
			
			    for (i=0; i < over_height; I++) {
			        for (j=0; j < over_width; j++) {
			            if (*pixel1 > 0) && (*pixel2 > 0) return(1);
			            pixel1++;
			            pixel2++;
			        }
			        pixel1 += (object1->width - over_width);
			        pixel2 += (object2->width - over_width);
			    }
			
			    // Worst case!  We scanned through the whole darn rectangle of overlap 
			    // and couldn't find a single colliding pixel!
			
			    return(0);
		     */
		    
		    
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