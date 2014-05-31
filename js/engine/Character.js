rpg.Actor = function (def){
	this.loc = def.loc;
	this.sprite = def.sprite;
	this.facing = def.facing;
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('width',  this.sprite.w);
	this.canvas.setAttribute('height', this.sprite.h);
	this.ctx = this.canvas.getContext('2d');
}
rpg.Actor.prototype.updateframe = function() {
	var s = this.sprite;
	this.ctx.drawImage(	rpg.Tiles[s.tile], // what image is this coming from?
						s.dir[this.facing].x, s.w * s.frame, // what pixel in image to read from (x,y),  
						s.w, s.h,  // how many pixels in each direction to read?
						0, 0, s.w, s.h);
	rpg.ctx.drawImage(this.canvas, this.loc.x, this.loc.y);
};
rpg.Character = new rpg.Actor({
	loc: {
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
			{ x: this.h, frames: 4},
			{ x: 2*this.h, frames: 4},			
			{ x: 3*this.h, frames: 4}
		],
		tile: "F01"
	}
});
