rpg.Cell.prototype.types.ESPACE = new rpg.CellType({
	name: "ESPACE",
	a: 40,
	tile: "A5",
	x: 5*32,
	y: 6*32,
	broken: 0.1,
	decorate: function(ctx, obj){
		if(Math.random() < this.broken){
			obj.push({ tile: "A5", x: 5*32, y: 13*32, w: 32, h: 32 });
		}
	}
});