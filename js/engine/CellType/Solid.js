rpg.Cell.prototype.types.SOLID = new rpg.CellType({
	name: "SOLID",
	a: 10, 
	tile: "A4", 
	x: (2*32)+16,
	y: (4*32)-16,
	isWall: function(){
		return !rpg.Map.isGenerating;
	}
});