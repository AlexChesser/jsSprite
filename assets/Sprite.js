function newSprite(obj) {
	var Sprite = {
		is_ready:	false,
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
		actions:	obj.anim,	// this is the list of animations the sprite has
		anim:		0,			// this is the current animation the sprite is running
		frame: 		0,			// this is the current frame of the animation
		direction: 	0,			// this is the direction (of 8) it is running in
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
				0 : [-1.0,  0.0],
				1 : [-0.5, -0.5],
				2 : [ 0.0, -1.0],
				3 : [ 0.5, -0.5],
				4 : [ 1.0,  0.0],
				5 : [ 0.5,  0.5],
				6 : [ 0.0,  1.0],
				7 : [-0.5,  0.5]
			};
			dm = DirectionMap[Sprite.direction];
			Sprite.Xspd = dm[0] * Sprite.speed;
			Sprite.Yspd = dm[1] * Sprite.speed;
		},
		drawFrame: function(){
			Sprite.ctx.clearRect(0,0,Sprite.width,Sprite.height); //clear previous frame
			MainContext.clearRect(Sprite.Xpos, Sprite.Ypos, Sprite.width, Sprite.height);
			if(Sprite.is_ready){ //do not draw if sprite is not ready
				//calculate values for sprite based on animation
				var srcX 		= Sprite.anim.start + (Sprite.frame * Sprite.width);
				var srcY 		= Sprite.direction * Sprite.height;
				var srcWidth 	= Sprite.width;
				var srcHeight 	= Sprite.height;
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
			m.frame = m.anim.start;
			m.anim.playdir = 1;
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