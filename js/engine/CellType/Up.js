rpg.Cell.prototype.types.UP = new rpg.CellType({
	name: "UP", 
	a: 40,
	tile: "A5",
	x: 5*32,
	y: 6*32,
	decorate: function(ctx, objects){
    	objects.push({	
    		tile: "B", 
			x: 2*32, 	
			y: 0,
			w: 32,
			h: 32
		})
	},
	stand: function(){
		rpg.Map.direction = 'up'
	}
});