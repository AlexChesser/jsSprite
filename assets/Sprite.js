function newSprite(obj) {
	var Sprite = {
		canvas: 0, //canvas to hold this sprite - will be drawn to main canvas
		ctx: 0, //context for sprite canvas
		x: 0, // X position of this sprite
		y: 0, //Y position of this sprite
		animation: 0, //current animation for this sprite
		currentFrame: 0, //current animation frame for this sprite
		width: 0, 
		height: 0,
		image: 0, //image that is being drawn to the canvas
		currentStep: 0, //number of frames since this sprite's animation was updated
		is_ready: 0, //sprite has finished loading and can be used	
		initSprite: function(canvas, x, y, width, height, img_file){ //initialize sprite
			Sprite.is_ready = false; //sprite not ready
			Sprite.x = x;
			Sprite.y = y;
			Sprite.width = width;
			Sprite.height = height;
			Sprite.canvas = canvas; //canvas is created by Eperiment object and passed to sprite
			Sprite.canvas.setAttribute('width', width);
			Sprite.canvas.setAttribute('height', height);
			Sprite.ctx = Sprite.canvas.getContext('2d'); //get canvas drawing context
			Sprite.loadImage(img_file); // load image for sprite
			Sprite.animation = standRight; //set initial animation set
		},
		loadImage: function(img_file){  //loads image to draw for sprite
			Sprite.image = new Image();  //create new image object
			Sprite.image.onload = function(){  //event handler for image load 
				Sprite.is_ready = true; // sprite is ready when image is loaded
			}
			Sprite.image.src = img_file; //load file into image object
		},
		drawImage: function(){ //draw image into sprite canvas
			Sprite.ctx.clearRect(0,0,Sprite.width,Sprite.height); //clear previous frame
			if(Sprite.is_ready){ //do not draw if sprite is not ready
				//calculate values for sprite based on animation
				var srcX = Sprite.animation.sX + (Sprite.currentFrame * Sprite.animation.width);
				var srcY = Sprite.animation.sY ;
				var srcWidth = Sprite.animation.width;
				var srcHeight = Sprite.animation.height;
				Sprite.ctx.drawImage(Sprite.image, srcX, srcY, srcWidth, srcHeight, 0, 0, srcWidth, srcHeight); //draw image
				Sprite.stepSprite(); //advance animation
				Sprite.moveSprite(); //move sprite
			}
		},
		stepSprite: function(){ //advance animation based on animation speed (step value)
			if(Sprite.currentStep >= Sprite.animation.step){
				Sprite.currentStep = 0;
				Sprite.currentFrame++;
				if(Sprite.currentFrame >= Sprite.animation.totalFrames){ 
					if(Sprite.animation.loop){
						Sprite.currentFrame = 0; //loop animation back to start
					}
					else{
						Sprite.currentFrame = Sprite.animation.totalFrames -1;	//if loop not set, hold on final frame
					}
				}
			}
			else {
				Sprite.currentStep++; //advance step counter if step limit not reached	
			}
		},
		/*Temporary move functions to move demo sprites.  Ideally this code will be handled outside the Sprite object, so Sprite can focus soley on drawing and animation*/
		moveSprite: function(){
			if(Sprite.animation.name == walkRight.name){
				Sprite.x += 5;
				if(Sprite.x > Experiment.width)
				{
					Sprite.x = 0 - Sprite.width;
				}
			}
			else if(Sprite.animation.name == walkLeft.name){
				Sprite.x -= 5;
				if((Sprite.x + Sprite.width)  < 0 )
				{
					Sprite.x = Experiment.width;
				}
			}
		},
		goLeft: function(){
			if(Sprite.animation.name != walkLeft.name){
				Sprite.animation = walkLeft;
				Sprite.currentFrame = 0;
				Sprite.currentStep = 0;
			}
		},
		goRight: function(){
			if(Sprite.animation.name != walkRight.name){
				Sprite.animation = walkRight;
				Sprite.currentFrame = 0;
				Sprite.currentStep = 0;
			}
		},
		stopMovement: function(){
			if(Sprite.animation.name == walkLeft.name)
			{
				Sprite.animation = standLeft;
				Sprite.currentFrame = 0;
				Sprite.currentStep = 0;
			}
			else if(Sprite.animation.name == walkRight.name){
				Sprite.animation = standRight;
				Sprite.currentFrame = 0;
				Sprite.currentStep = 0;
			}
		}
	};
	return Sprite;  //returns newly created sprite object		
		
		
		
		
		
		
		
	}
}