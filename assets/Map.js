var rpg = {
	Map : {}
}
rpg.Map =  {
	get_opts : function(){
	  var opts = {
		'seed'			  	: new Date(),
		'n_rows'			: 25, //		  # must be an odd number
		'n_cols'			: 50, //		 # must be an odd number
		'dungeon_layout'	: 'None',
		'room_min'		  	: 3,   //		# minimum room size
		'room_max'		  	: 5,	 //	  # maximum room size
		'room_layout'	   	: 'Scattered', // # Packed, Scattered
		'corridor_layout'   : 'Bent', //
		'remove_deadends'	: 50,	   //   # percentage
		'add_stairs'		: 2,		  // # number of stairs
		'map_style'		 	: 'Standard',
		'cell_size'		 	: 18,		 // # pixels
		"cells"				: [],
		"rooms"				: []
	  };
	  return opts;
	},
	currentfloor: {},
	floors: [],
	// Algorithm based on http://donjon.bin.sh/fantasy/dungeon/about/dungeon.pl
	// rewritten in javascript
	generate: function(d){
		if (d === undefined) {
			d = this.get_opts();
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

		this.empty_dungeon(d);
		this.init_rooms(d);
		this.open_rooms(d);
		this.corridors(d);
		this.currentfloor = d;
		this.floors.push(d);
		this.draw(d)
	},
	// create a multidimensional dungeon array
	// this will initially be filled with solid 
	empty_dungeon: function(d){
		for (var r = 0; r <= d.n_rows; r++) {
			d.cells.push([]);
			for (var c = 0; c <= d.n_cols; c++) {
				d.cells[r].push({'type' : 'SOLID', 'marker' : ".", x: r, y: c});
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
	  			if (d.cells[r][c].type !== 'SOLID') {
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

		// we can now add this room
		for (var r = b.r1; r <= b.r2; r++){
			for (var c = b.c1; c <= b.c2; c++){
				if(	[b.r1, b.r2].indexOf(r) != -1
				||	[b.c1, b.c2].indexOf(c) != -1){
					d.cells[r][c].marker = "#";
					d.cells[r][c].type = "PERIMETER";
				} else {
					d.cells[r][c].marker = " ";
					d.cells[r][c].type = "ESPACE";
				}
			}
		}
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
			var x = vxs[vx];
			d.cells[x.x][x.y].marker = "+"
			d.cells[x.x][x.y].type = "DOOR"
			r.exits.push(x);
		}
	},
	corridors: function(d){
		for (i in d.rooms) {
			var r = d.rooms[i];
			for(j in r.exits){
				var x = r.exits[j];
				//console.log("starting tunnel")
				//console.log(x)
				this.tunnel(d, x);
			}
		}
	},
	dir_x : {north: -1, south: 1, west: 0, east: 0},
	dir_y : {north: 0, south: 0, west: -1, east: 1},
	tunnel: function(d, x){
		//console.log("next set in dir"+x.dir)

		var next = {
			x: x.x + this.dir_x[x.dir], 
			y: x.y + this.dir_y[x.dir],
			dir: x.dir
		}
		//console.log(next)
		var cell = this.get_cell(d, next.x, next.y);
		if(cell.type === "SOLID"){
			//next.dir = this.change_dir(next.dir);
			//this.tunnel(d, next);

			cell.type="HALL";
			cell.marker="H";
		}
		
		if(	cell.type === "OOB"
			|| cell.type === "PERIMETER"){
			next.dir = this.change_dir(next.dir);
			console.log("changed dir");
		}
		// TODO: consider continue conditions
		//	stop if: 
		//	1) the hallway is beside another hallway other than a cell behind it
		//	2) the hallway is beside a doorway other than a cell behind it
		if(this.disconnected(d, next, x)){
			this.tunnel(d, next);
		}
		
	},
	change_dir: function(dir){
		switch(dir){
			case 'north':
			case 'south':
				return ['east', 'west'][this.randrange(0,1)]
				break;
			case 'east':
			case 'west':
				return ['north', 'south'][this.randrange(0,1)]
				break;
		}
	},
	get_cell: function(d, x, y){
		if(x >= d.n_rows-1 || x < 0 ||
			y >= d.n_cols-1 || y < 0){
			return { 'type' : "OOB" }
		}
		return d.cells[x][y];
	},
	get_cells: function(d, cell, l){
		// get the cells in all 4 directions
		var cells = { 
			'north' : this.get_cell(d, cell.x-1, cell.y),
			'south'	: this.get_cell(d, cell.x+1, cell.y), 
			'west'	: this.get_cell(d, cell.x, cell.y+1),
			'east' 	: this.get_cell(d, cell.x, cell.y-1)
		};
		skip = {
			'north' : 'south', 'south': 'north',
			'west'	: 'east',	'east': 'west' 
		};
		delete cells[skip[l.dir]];
		for(i in cells){
			if(cells[i].type === "OOB"){
				delete cells[i]
			}
		}
		return cells;
	},
	disconnected: function(d, cell, l){
		var cells = this.get_cells(d, cell, l);
		if(Object.keys(cells).length == 0){
			return false
		};
		for(i in cells){
			var near = cells[i];
			if(near.type == "DOOR"){
				return false;
			}
		}
		return true;
	},
	draw: function(d){
		console.log("   |----|----|----|----|----|----|----|----|----|----|");
		for(var r in d.cells){
			var line = ("0"+r).substr(-1) + ": ";
			for (var c in d.cells[r]){
				line += d.cells[r][c].marker;
			}
			console.log(line);
		}
	}
}
rpg.Map.generate()