var canvas = document.getElementById('game');
var MainContext = canvas.getContext('2d');


var canvas_support = {
		canvas_compatible : false,
		check_canvas : function() {
			try {
				this.canvas_compatible = !!(document.createElement('canvas').getContext('2d')); // S60
			} catch(e) {
				this.canvas_compatible = !!(document.createElement('canvas').getContext); // IE
			} 
			return this.canvas_compatible;
		}
};

if(canvas_support.check_canvas()){  //check canvas support before intializing
	//Game.initGame(); //initialize game object
}
else {
	Message.addMessage('Your Browser Does not support this app!');	
}


//document.body.appendChild(m.canvas);

var Game = {
		gameTimer: 			0, //holds id of main game timer
		fps: 				250, //target fps for game loop
		m:					0,
		initGame: function() { //initialize game
			Game.fps = 	5; //set target fps to 250
			Game.startTimer(); //start game loop

			mc = document.createElement('canvas');
			Game.m = newSprite(Minotaur());
			Game.m.init(mc);

			
		},
		startTimer: function(){ //start game loop
			var interval = 1000 / Game.fps;
			Game.gameTimer = setInterval(Game.runLoop, interval);
		},
		runLoop: function(){ //code to run on each game loop
			
			Game.m.drawFrame();
			var m = Game.m;
			MainContext.drawImage(m.canvas, m.width, m.height, m.width, m.height, 0, 0, 256, 128)
		}
	};
Game.initGame();

