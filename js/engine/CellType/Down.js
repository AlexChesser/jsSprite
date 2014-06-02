rpg.Cell.prototype.types.DOWN = new rpg.CellType({ 
	name: "DOWN",  
	a: 40, 
	tile: "B",
	x: 2*32,
	y: 1*32,
	stand: function(cell, actor){
		rpg.Map.direction = 'down'
	}
});