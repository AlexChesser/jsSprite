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
			};
			Sprite.img.src = Sprite.img_src; 
		},
		drawFrame: function(){
			Sprite.ctx.clearRect(0,0,Sprite.width,Sprite.height); //clear previous frame
			if(Sprite.is_ready){ //do not draw if sprite is not ready
				//calculate values for sprite based on animation
				var srcX = Sprite.anim.start + (Sprite.frame * Sprite.width);
				var srcY = Sprite.direction * Sprite.height;
				var srcWidth = Sprite.width;
				var srcHeight = Sprite.height;
				Sprite.ctx.drawImage(Sprite.img, srcX, srcY, srcWidth, srcHeight, 0, 0, srcWidth, srcHeight); //draw image
				Sprite.step(); //advance animation
				// Sprite.moveSprite(); //move sprite
			}
		},
		step: function() {
			var cf  = Sprite.frame; // the current frame we are on
			var an  = Sprite.anim;  // the current anim we are running
			var nf  = cf + an.playdir; // this is the next frame
			if (nf >= an.start+an.length || nf < an.start) {
				// this means we must take action
				nf = an.start;
			}
			Sprite.frame = nf;
		}
			
	};
	return Sprite;
}

function Minotaur() {
	var obj = {
		img:		'assets/images/minotaur.png',
		canvas:		0,
		ctx:		0,
		cols: 		24,
		rows: 		8,
		width: 128,
		height:128,
		frame: 0,
		direction: 3,
		anim : {
			stand: 	{start:  0,	length: 4, end: 'reverse'	, playdir: 1},
			run: 	{start:  4,	length: 8, end: 'loop'	 	, playdir: 1},
			attack: {start: 12, length: 4, end: 'reverse'	, playdir: 1},
			block:	{start: 16, length: 2, end: 'hold'		, playdir: 1},
			die: 	{start: 18, length: 6, end: 'hold'		, playdir: 1}
		}
	};
	return obj;
}