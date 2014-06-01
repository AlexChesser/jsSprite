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
	this.update()
}
rpg.Actor.prototype.destination = null;
rpg.Actor.prototype.anim = function(){
	this.sprite.frame++;
	if(this.sprite.frame >= this.sprite.dir[this.facing].frames){
		this.sprite.frame = 0;
	}
}
rpg.Actor.prototype.PathToXY = function(xy){
	var grid = [xy.x , xy.y ],
		c = rpg.Map.map.cells;
	var e = c[parseInt(xy.x/32)][parseInt(xy.y/32)]
	this.path = astar.search(c, this.grid, e, { diagonal: true });
}
rpg.Actor.prototype.set_destination = function(dir){	
	this.destination = rpg.Map.map.cells[this.grid.x + dir[0]][this.grid.y + dir[1]];
}
rpg.Actor.prototype.directionmap = {
		0 : [ 0.0,  1.0],  // 0 - S
		1 : [-1.0,  0.0],  // 2 - W 
		2 : [ 1.0,  0.0],  // 4 - E
		3 : [ 0.0, -1.0]  // 6 - N
	};
rpg.Actor.prototype.setspeed = function(){
	var t = this, s = this.speed;
	dm = t.directionmap[t.facing];
	s.x = dm[0] * s.base;
	s.y = dm[1] * s.base;
},
rpg.Actor.prototype.update = function(){
	if(this.destination != null) {
		this.set_to_grid(this.destination)
		this.destination = null;
	}
	if (this.path.length >0 ){
		this.anim();
		var c = this.path.shift();
			cell = rpg.Map.map.cells[c.x][c.y];
		this.set_to_grid(cell);
		cell.stand(cell, this);
	}
}
rpg.Actor.prototype.draw = function() {
	var s = this.sprite,
		c = rpg.Map.map.cells,
		g = this.grid;
	// to start with all neighbors will have to be redrawn
	var n = astar.neighbors(c, g, true);
	// add in the current cell as well
	n.push(c[g.x][g.y]);
	// and if you're taller that the current cell, take two up.
	if(s.h > n[0].height && c[g.x][g.y-2]){
		n.push(c[g.x][g.y-2])
		n.push(c[g.x+1][g.y-2])
		n.push(c[g.x-1][g.y-2])
	}	
	for(i in n){
		n[i].draw();
	}
	this.ctx.clearRect(0, 0, s.w, s.h);
	this.ctx.drawImage(	rpg.Tiles[s.tile], // what image is this coming from?
						s.w * s.frame, s.dir[this.facing].x,// what pixel in image to read from (x,y),  
						s.w, s.h,  // how many pixels in each direction to read?
						0, 0, s.w, s.h);	
	rpg.ctx.drawImage(this.canvas, this.loc.x, this.loc.y);
};
rpg.Actor.prototype.set_to_grid = function(grid) {
	this.grid = grid;
	this.loc = this.grid_to_loc(grid);
}

rpg.Actor.prototype.grid_to_loc = function(grid){
	return {
		x : grid.x*grid.height,
		y : grid.y*grid.height - (this.sprite.h - grid.height)
	}
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
	path: [],	
	facing: 0,
	speed: {
		base: 10,
		x: 0,
		y: 0
	},
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
				m.facing = 3
				m.set_destination(m.directionmap[m.facing]);
		  		m.anim();
		  		break;
			case 97:  // 'a' - turn right
		  		m.facing = 1
		  		m.set_destination(m.directionmap[m.facing]);
		  		break;
			case 115:  // 's'
				m.facing = 0
				m.set_destination(m.directionmap[m.facing]);
		  		m.anim();
		  		break;
			case 100:  // 'd' - turn left
		  		m.facing = 2
		  		m.set_destination(m.directionmap[m.facing]);
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
