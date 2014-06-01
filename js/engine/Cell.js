rpg.Cell = function(def){
	this.height = 32;
	this.width = 32;
	this.type = this.types.SOLID;
	// always starts SOLID can be altered after
	if(def){
		for (key in def){
			this[key] = def[key];
		}
	}
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('width',  this.w);
	this.canvas.setAttribute('height', this.h);
	this.ctx = this.canvas.getContext('2d');
	this.deco = { done: false }, 
	this.objects = []
}
rpg.Cell.prototype.isWall = function(){
	if (typeof this.type.isWall !== 'undefined'){
		return this.type.isWall();
	}
	return false;//this.type.a > 10
}
rpg.CellType = function(def){
	if(def){
		for (key in def){
			this[key] = def[key];
		}
	}
}
rpg.CellType.prototype.predraw = function(ctx){}
rpg.CellType.prototype.decorate = function(ctx, objects){
	// can be custom written pre cell type such that the 
	// decorations that appear are appropriate for that cell type
}
rpg.Cell.prototype.types = {
	// a: is the a* digging cost
	// x,y: the position on the sprite sheet to draw from
	// tile: the asset to find the sprite sheet on
	// broken: the probability that a tile will display the "broken" version (when available)
	// TODO: improve variation in sprites selected per task
	"DOOR"	 : new rpg.CellType({ name: "DOOR",  a: 40, tile: "DR", x: 0*32, 	y: 0 })
};
rpg.Cell.prototype.stand = function(cell, actor){
	if (typeof this.type.stand !== 'undefined'){
		this.type.stand(this, actor);
	}
}
rpg.Cell.prototype.draw = function(){
	var t = this;
	var srcX = t.type.x, 
		srcY =t.type.y, 
		srcWidth = this.width, 
		srcHeight= this.height;
	this.ctx.clearRect(0, 0, this.width, this.height);
	// The decorate function has two modes of attack. anything that needs to be drawn as a sub-layer
	// can be directly added to the CTX while anything that should be added on top can be pushed
	// onto the objects array
	this.type.predraw(this.ctx);
	if(!this.deco.done){
		t.type.decorate(this.ctx, this.objects);
		this.deco.done = true;
	}
	// might make more sense to make each cell a stack of tiles that can be drawn from the bottom up.
	t.ctx.drawImage(rpg.Tiles[t.type.tile], srcX, srcY, srcWidth, srcHeight, 
					0, 0, srcWidth, srcHeight);
	for(i in this.objects){
		var o = this.objects[i];
		t.ctx.drawImage(rpg.Tiles[o.tile], o.x, o.y, o.w, o.h, 
					0, 0, srcWidth, srcHeight);
	}
	if(false) {
		t.ctx.font = "10px Arial";
		t.ctx.fillStyle = "#FFFFFF";
		t.ctx.fillText( "["+t.x+ ","+t.y+"]", 0,12)
	}
	rpg.ctx.drawImage(t.canvas, t.x*32, t.y*32);
}