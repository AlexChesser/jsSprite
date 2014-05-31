rpg.Actor = function (def){
	if(def){
		for (key in def){
			this[key] = def[key];
		}
	}
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('width',  this.sprite.w);
	this.canvas.setAttribute('height', this.sprite.h);
	this.ctx = this.canvas.getContext('2d');
}
rpg.Actor.prototype.turn = function(dir){
	this.facing+=dir;
	if(this.facing >= this.sprite.dir.length){
		this.facing = 0;
	} else if(this.facing <0){
		this.facing = this.sprite.dir.length -1;
	}
	this.updateframe()
}
rpg.Actor.prototype.anim = function(){
	this.sprite.frame++;
	if(this.sprite.frame >= this.sprite.dir[this.facing].frames){
		this.sprite.frame = 0;
	}
	this.updateframe()
}
rpg.Actor.prototype.updateframe = function() {
	var s = this.sprite;
	rpg.Map.map.cells[this.grid.x][this.grid.y-1].draw();
	rpg.Map.map.cells[this.grid.x][this.grid.y].draw();
	this.ctx.clearRect(0, 0, s.w, s.h);
	this.ctx.drawImage(	rpg.Tiles[s.tile], // what image is this coming from?
						s.w * s.frame, s.dir[this.facing].x,// what pixel in image to read from (x,y),  
						s.w, s.h,  // how many pixels in each direction to read?
						0, 0, s.w, s.h);	
	rpg.ctx.drawImage(this.canvas, this.loc.x, this.loc.y);
};
rpg.Actor.prototype.grid_to_loc = function(grid){
	this.grid = grid;
	this.loc.x = grid.x*grid.height;
	this.loc.y = grid.y*grid.height - (this.sprite.h - grid.height);
}
rpg.Character = new rpg.Actor({
	// location in actual pixels
	loc: {
		x: 0,
		y: 0
	},
	grid: {
		x: 0,
		y: 0
	},	
	facing: 0,
	sprite: {
		w: 32,
		h: 48,
		frame: 0,
		source: {
			x: 0,
			y: 0,
		},
		dir: [
			{ x: 0, frames: 4},
			{ x: 48, frames: 4},
			{ x: 96, frames: 4},			
			{ x: 144, frames: 4}
		],
		tile: "F01"
	}
});

document.addEventListener("keypress", 
	function(e){
		var m = rpg.Character;
		switch(e.which) {
			case 119:  // 'w'
		  		m.anim();
		  		break;
			case 97:  // 'a' - turn right
		  		m.turn(-1);				  		
		  		break;
			case 115:  // 's'
		  		
		  		m.anim();
		  		break;
			case 100:  // 'd' - turn left
		  		m.turn(1);
		  		break;
			case 101: // e = attack
		  		
		  		m.anim();
		  		break;
			case 120: // x = die
		  		
		  		m.anim();
		  		break;				  		
			case 113: // q = attack
		  		
		  		m.anim();
		  		break;
				default:
		  			//code to be executed if n is different from case 1 and 2
		}
		//m.direction = 0;
	}, false);
