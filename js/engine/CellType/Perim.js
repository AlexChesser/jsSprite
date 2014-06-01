rpg.Cell.prototype.types.PERIM = new rpg.CellType({ 
	name: "PERIM", 
	a: 40, 
	tile: "A4", 
	x: 10*32,
	y: 9*32,
	isWall: false,
	isWall: function(){
		return true;
	}
});