
function Tile() {
	this.t = {
		type		: 'tile',
		img			: 'assets/images/grass_and_water.png',
		canvas		: 0,
		ctx			: 0,
		cols		: 4,
		rows		: 6,
		offsetY		: 7,
		width		: 64,
		hw			: 32,
		hh 			: 16,
		height		: 46,
		speed		: 0,
		frame		: 1,
		animated	: false,
		direction	: 0,
		debug		: 1,
		anim		: {
			stand: 	{name: 'stand',  start:  0,	length: 0, end: 'hold'	, playdir: 0}
		}
	};
}

function Map(){
	this.canvas = 0;
	this.ctx = 0;
	this.tiles = [];
}

Map.prototype.init = function(){
	
	for (var i = 0; i < 40; i++){
	    for (j = 40; j >= 0; j--){  // Changed loop condition here.
	    	var t = new Tile().t;
	        var tile = newSprite(t);
			tile.canvas = document.createElement('canvas');
			tile.Xpos = (j * t.hw) + (i * t.hw)
			tile.Ypos = (i * t.hh) - (j * t.hh)
			tile.init(tile.canvas);
			this.tiles.push(tile);
		}
	}
	
	/*
	for (var i = 0; i < 20; i++){
		var tile = newSprite(new Tile().t);
		tile.canvas = document.createElement('canvas');
		var offset_x = 0;
    	if (i % 2 === 0) {
    		offset_x = tile.width / 2
    	}
    	for (j = 0; j < 20; j++){
			tile.Xpos = j * tile.width + offset_x;
			tile.Ypos = (i * tile.height / 2)
			tile.init(tile.canvas);
			this.tiles.push(tile);        
        }
    }
    */


}
Map.prototype.draw = function(){
		console.log(tile);

}
GameMap = new Map();
GameMap.init();