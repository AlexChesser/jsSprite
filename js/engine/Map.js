rpg.Map =  {
	get_opts : function(){
	  var opts = {
		'seed'			  	: new Date(),
		'n_rows'			: 20, //		  # must be an odd number
		'n_cols'			: 20, //		 # must be an odd number
		'dungeon_layout'	: 'None',
		'room_min'		  	: 3,   //		# minimum room size
		'room_max'		  	: 4,	 //	  # maximum room size
		'room_layout'	   	: 'Scattered', // # Packed (NYI), Scattered
		'corridor_layout'   : 'Bent', //
		'add_stairs'		: 2,		  // # number of stairs
		'map_style'		 	: 'Standard',
		'cell_size'		 	: 32,		 // # pixels
		"cells"				: [],
		"rooms"				: []
	  };
	  return opts;
	},
	currentfloor: {},
	floors: [],
	isGenerating: false,
	direction: null,
	// Algorithm based on http://donjon.bin.sh/fantasy/dungeon/about/dungeon.pl
	// rewritten in javascript
    // altered to use astar to connect rooms instead of random corridors
	generate: function(d){
		this.isGenerating = true;
		if (d === undefined) {
			d = rpg.Map.get_opts();
		}
		// certain incoming options can create a bad dungeon set 
		// (according to the original code.) this appears to normalize 
		// the rows and columns 
		d.n_i = parseInt(d.n_rows/2)
		d.n_j = parseInt(d.n_cols/2)
		d.n_rows = d.n_i *2
		d.n_cols = d.n_j *2
		d.max_row = d.n_rows -1;
		d.max_col = d.n_cols -1;
		d.n_rooms = 0;

		this.max = d.room_max;
		this.min = d.room_min;
		d.room_base = parseInt((this.min + 1) / 2);
		d.room_radix = parseInt((this.max - this.min) / 2);
		d.actors = [];
		this.empty_dungeon(d);
		this.init_rooms(d);
		this.open_rooms(d);
		this.corridors(d);
		this.addStairs(d);
		//this.draw(d)

		d.level = this.floors.length+1;
		this.currentlevel = d.level;
		this.map = d;
		this.floors.push(d);
		rpg.Character.set_to_grid(d.stairs.up);
		d.actors.push(rpg.Character);
		this.isGenerating = false;
		this.draw2(d);
	},
	up: function(){
		if(this.currentlevel <= 1){
			return;
		} else {
			this.currentlevel--;
			this.map = this.floors[this.currentlevel-1]
			rpg.Character.set_to_grid(this.map.stairs.down);
			this.draw2(this.map);
		}
		this.direction = null;
	},
	down: function(){
		if(this.currentlevel < this.floors.length){
			this.currentlevel++;
			this.map = this.floors[this.currentlevel-1]
			rpg.Character.set_to_grid(this.map.stairs.up);
			this.draw2(this.map);
		} else {
			this.generate();
		}
		this.direction = null;
	},	
	// create a multidimensional dungeon array
	// this will initially be filled with solid 
	empty_dungeon: function(d){
		for (var r = 0; r <= d.n_rows; r++) {
			d.cells.push([]);
			for (var c = 0; c <= d.n_cols; c++) {
				var cell = new rpg.Cell();
					cell.x = r; 
					cell.y = c;
				d.cells[r].push(cell);
			}
		}
	},
	init_rooms: function(d){
		if (d.room_layout == 'Packed') {
			// NYI $dungeon = &pack_rooms($dungeon);
		} else {
			this.scatter_rooms(d);
		}
	},
	scatter_rooms: function(d){
		var n_rooms = this.alloc_rooms(d);
		for (var i = 0; i < n_rooms; i++) {
			this.set_room(d);
		}
	},
	alloc_rooms: function(d) {
		var dungeon_area = d.n_cols * d.n_rows;
  		var room_area = d.room_max  * d.room_max;
  		return parseInt(dungeon_area / room_area);
	},
	randrange: function(from, to){
		return parseInt(Math.floor(Math.random()*(to-from +1)+from))
	},
	random_room : function(d){
		var r = {
			height: 0,
			width: 0,
			i: 0,
			j: 0
		}
		r.height = this.randrange(d.room_min, d.room_max);
		r.width = this.randrange(d.room_min, d.room_max);
		r.i = this.randrange(0, d.n_i - r.height);
		r.j = this.randrange(0, d.n_j - r.width);
		return r;
	},
	sound_room: function(d, b) {
		for (var r = b.r1; r <= b.r2; r++) {
			for (var c = b.c1; c <= b.c2; c++) {
	  			if (d.cells[r][c].type !== d.cells[r][c].types.SOLID) {
					return true;
	  			}
			}
		}
		return false;
  	},	
	set_room: function(d, r){
		// d = dungeon
		// r = random room
		if(r == undefined){
			r = this.random_room(d);
		}
		// determine room boundries
		// b = bounds
		var b = {
			r1 : ( r.i * 2) + 1,
			c1 : ( r.j * 2) + 1,
			r2 : ((r.i + r.height) * 2) - 1,
			c2 : ((r.j + r.width ) * 2) - 1
		};

		// check for collisions with existing rooms
		if(this.sound_room(d,b)){
			// room would overlap with another one.
			return;
		}
		if (	(b.r1 < 1 || b.r2 > d.max_row)
			|| 	(b.c1 < 1 || b.c2 > d.max_col)){
			//console.log("abandoning room outside of bounds");
			//console.log(b)
			return;
		};
		b.room_id = d.n_rooms++;
		function room_data(b){
			return {
				id: b.room_id,
				north: b.r1,
				south: b.r2,
				west: b.c1,
				east: b.c2,
				exits: []
			}
		}
		d.rooms.push(room_data(b));
		// we can now add this room
		for (var r = b.r1; r <= b.r2; r++){
			for (var c = b.c1; c <= b.c2; c++){
				if(	[b.r1, b.r2].indexOf(r) != -1
				||	[b.c1, b.c2].indexOf(c) != -1){
					d.cells[r][c].marker = "#";
					d.cells[r][c].type = d.cells[r][c].types.PERIM;
				} else {
					d.cells[r][c].marker = " ";
					d.cells[r][c].type = d.cells[r][c].types.ESPACE;
				}
			}
		}

	},
	open_rooms: function(d){
		for(var r in d.rooms){
			this.open_room(d,d.rooms[r])
		}
	},
	alloc_opens: function(r){
		var room_h = ((r.north - r.south) / 2) + 1;
  		var room_w = ((r.west  - r.east) / 2) + 1;
		flumph = parseInt(Math.sqrt(room_w * room_h));
  		return 1 + this.randrange(0, flumph);
	},
	valid_exits: function(d, r){
		var vx = [];
		function push_valid(check, base, from, to, dir){
			if (check) {
				for(var c = from+1; c < to; c+=2){
					// TODO: check that it fits
					switch(dir){
						case 'north':
						case 'south':
							vx.push({x: base, y: c, dir: dir});
							break;
						case 'east':
						case 'west':
							vx.push({x: c, y: base, dir: dir});
							break;
					}
					
				}
			}
		}
		push_valid((r.north >= 3), r.north, r.west, r.east, 'north');
		push_valid((r.south <= d.n_rows-3), r.south, r.west, r.east, 'south');
		push_valid((r.east >= 3), r.east, r.north, r.south, 'east');
		push_valid((r.west <= d.n_cols - 3), r.west, r.north, r.south, 'west');
		return vx;
	},
	open_room: function(d, r){
		r.opens = this.alloc_opens(r);
		// valid exits
		var vxs = this.valid_exits(d, r);

		for(var i = 0; i < r.opens; i++){
			// vx = valid exit
			var vx = this.randrange(0, vxs.length-1);
			// x = exit
			var x = vxs[vx]
			var door = new rpg.Cell({ 
				type: rpg.Cell.prototype.types.DOOR,
				x: x.x,
				y: x.y
			});
			d.cells[x.x][x.y] = door;

			x.room_id = r.id;
			r.exits.push(x);
		}
	},
	// get random exit in another room.
	random_exit: function(d, rm){
		var random_room = rm;
		while (random_room.id === rm.id) {
			var rid = this.randrange(0, d.rooms.length -1);
			random_room = d.rooms[rid]
		}
		var x_idx = this.randrange(0, random_room.exits.length-1);
		var x = random_room.exits[x_idx];
		return x;

	},
	corridors: function(d){
		for (i in d.rooms) {
			var r = d.rooms[i];
			for(j in r.exits){
				var from = r.exits[j],
					to = this.random_exit(d, r);
				var path = astar.search(d.cells, from, to)
				// remove the last cell in the A* so we don't overwrite the door
				path.pop();
				for(k in path){
					var cell = path[k];
					cell.marker = "H";
					cell.type = cell.types.HALL;
				}
			}
		}
	},
	addStairs: function(d){
		var UP = d.rooms[0],
			DOWN = d.rooms[d.rooms.length-1]
		d.cells[UP.north+2][UP.west+2].type = rpg.Cell.prototype.types.UP;
		d.cells[DOWN.south-2][DOWN.east-2].type = rpg.Cell.prototype.types.DOWN;
		d.stairs = {
			up: {x: UP.north+2, y: UP.west+2, height: 32},
			down: {x: DOWN.south-2, y: DOWN.east-2, height: 32}
		}
	},
	draw: function(d){
		console.log("    0----5----|----5----|----5----|----5----|----5----|");
		for(var r in d.cells){
			var line = ("0"+r).substr(-2) + ": ";
			for (var c in d.cells[r]){
				line += d.cells[r][c].marker;
			}
			console.log(line);
		}
	},
	draw2:function(d){
		rpg.ctx.clearRect(0,0,rpg.canvas.width,rpg.canvas.height);
		for(var r in d.cells){
			for (var c in d.cells[r]){
				d.cells[r][c].draw()
			}
		}
	}
}