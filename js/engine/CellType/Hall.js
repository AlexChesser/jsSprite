rpg.Cell.prototype.types.HALL = new rpg.CellType({ 
	name: "HALL", 
	a: 0, 
	tile: "A5", 
	x: 4*32, 	
	y: 4*32, 
	broken: 0.4,
	decorate: function(ctx, obj){
		if(Math.random() < this.broken){
			obj.push({ tile: "A5", x: 4*32, y: 12*32, w: 32, h: 32});
		}
	}
});