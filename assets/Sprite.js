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
			
			// I hate this.  this is the most unreadable garbage EVER.
			// is this how the pros do it? 
			
			if (d < -22.5 && d >= -67.5) {
				Sprite.direction = 3;
			} else if (d < -67.5 && d >= -112.5) {
				Sprite.direction = 4;
			} else if (d < -112.5 && d >= -157.5) {
				Sprite.direction = 5;
			} else if (d > 22.5 && d <= 67.5) {
				Sprite.direction = 1;
			} else if (d > 67.5 && d <= 112.5) {
				Sprite.direction = 0;
			} else if (d > 112.5 && d <= 157.5) {
				Sprite.direction = 7;
			} else if (Math.abs(d) <= 22.5) {
				Sprite.direction = 2;
			} else if (Math.abs(d) > 157.5) {
				Sprite.direction = 6;
			} 
			
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
		closeTo: function(p1, p2, range){
			if(p1 <= p2+range && p1 >= p2-range ){
				// close enough on the X axis
				return true;
			}
			return false;
		},
		runTo: function(xy) {
			// must add "approximation" to test within a few pixels
			// at the moment. once the mino gets to his "spot" he 
			// does the flipflop dance.
			
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
		    top1 = Sprite.Ypoz;
		    top2 = obj.Ypos;
		    bottom1 = Sprite.Ypos + Sprite.height;
		    bottom2 = obj.Ypos + obj.height;

		    if (bottom1 < top2) return false;
		    if (top1 > bottom2) return false;

		    if (right1 < left2) return false;
		    if (left1 > right2) return false;

		    return true;
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