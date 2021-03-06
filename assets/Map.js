// javascript-astar 0.2.0
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Implements the astar search algorithm in javascript using a Binary Heap.
// Includes Binary Heap (with modifications) from Marijn Haverbeke.
// http://eloquentjavascript.net/appendix2.html

(function(definition) {
    if(typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = definition();
    } else if(typeof define === 'function' && define.amd) {
        define([], definition);
    } else {
        var exports = definition();
        window.astar = exports.astar;
        window.Graph = exports.Graph;
    }
})(function() {
	var astar = {
	    init: function(grid) {
	        for(var x = 0, xl = grid.length; x < xl; x++) {
	            for(var y = 0, yl = grid[x].length; y < yl; y++) {
	                var node = grid[x][y];
	                node.f = 0;
	                node.g = 0;
	                node.h = 0;
	                node.cost = node.type.a;
	                node.visited = false;
	                node.closed = false;
	                node.parent = null;
	            }
	        }
	    },
	    heap: function() {
	        return new BinaryHeap(function(node) {
	            return node.f;
	        });
	    },

	    // astar.search
	    // supported options:
	    // {
	    //   heuristic: heuristic function to use
	    //   diagonal: boolean specifying whether diagonal moves are allowed
	    //   closest: boolean specifying whether to return closest node if
	    //            target is unreachable
	    // }
	    search: function(grid, start, end, options) {
	        astar.init(grid);

	        options = options || {};
	        var heuristic = options.heuristic || astar.manhattan;
	        var diagonal = !!options.diagonal;
	        var closest = options.closest || false;
	        var openHeap = astar.heap();
	        var start = grid[start.x][start.y],
	        	end = grid[end.x][end.y]

	        // set the start node to be the closest if required
	        var closestNode = start;

	        start.h = heuristic(start, end);

	        function pathTo(node){
	            var curr = node;
	            var path = [];
	            while(curr.parent) {
	                path.push(curr);
	                curr = curr.parent;
	            }
	            return path.reverse();
	        }


	        openHeap.push(start);

	        while(openHeap.size() > 0) {

	            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
	            var currentNode = openHeap.pop();

	            // End case -- result has been found, return the traced path.
	            if(currentNode.x === end.x 
	            	&& currentNode.y === end.y) {
	                return pathTo(currentNode);
	            }

	            // Normal case -- move currentNode from open to closed, process each of its neighbors.
	            currentNode.closed = true;

	            // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
	            var neighbors = astar.neighbors(grid, currentNode, diagonal);

	            for(var i=0, il = neighbors.length; i < il; i++) {
	                var neighbor = neighbors[i];

	                if(neighbor.closed || neighbor.isWall()) {
	                    // Not a valid node to process, skip to next neighbor.
	                    continue;
	                }
	                // The g score is the shortest distance from start to current node.
	                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
	                var gScore = currentNode.g + neighbor.cost;
	                var beenVisited = neighbor.visited;

	                if(!beenVisited || gScore < neighbor.g) {

	                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
	                    neighbor.visited = true;
	                    neighbor.parent = currentNode;
	                    neighbor.h = neighbor.h || heuristic(neighbor, end);
	                    neighbor.g = gScore;
	                    neighbor.f = neighbor.g + neighbor.h;

	                    if (closest) {
	                        // If the neighbour is closer than the current closestNode or if it's equally close but has
	                        // a cheaper path than the current closest node then it becomes the closest node
	                        if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
	                            closestNode = neighbor;
	                        }
	                    }



	                    if (!beenVisited) {
	                        // Pushing to heap will put it in proper place based on the 'f' value.
	                        openHeap.push(neighbor);
	                    }
	                    else {
	                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
	                        openHeap.rescoreElement(neighbor);
	                    }
	                }
	            }
	        }

	        if (closest) {
	            return pathTo(closestNode);
	        }

	        // No result was found - empty array signifies failure to find path.
	        return [];
	    },
	    manhattan: function(pos0, pos1) {
	        // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
	        var d1 = Math.abs (pos1.x - pos0.x);
	        var d2 = Math.abs (pos1.y - pos0.y);
	        return d1 + d2;
	    },
	    diagonal: function(pos0, pos1) {
	        var D = 1;
	        var D2 = Math.sqrt(2);
	        var d1 = Math.abs (pos1.x - pos0.x);
	        var d2 = Math.abs (pos1.y - pos0.y);
	        return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
	    },
	    neighbors: function(grid, node, diagonals) {
	        var ret = [];
	        var x = node.x;
	        var y = node.y;

	        // West
	        if(grid[x-1] && grid[x-1][y]) {
	            ret.push(grid[x-1][y]);
	        }

	        // East
	        if(grid[x+1] && grid[x+1][y]) {
	            ret.push(grid[x+1][y]);
	        }

	        // South
	        if(grid[x] && grid[x][y-1]) {
	            ret.push(grid[x][y-1]);
	        }

	        // North
	        if(grid[x] && grid[x][y+1]) {
	            ret.push(grid[x][y+1]);
	        }

	        if (diagonals) {

	            // Southwest
	            if(grid[x-1] && grid[x-1][y-1]) {
	                ret.push(grid[x-1][y-1]);
	            }

	            // Southeast
	            if(grid[x+1] && grid[x+1][y-1]) {
	                ret.push(grid[x+1][y-1]);
	            }

	            // Northwest
	            if(grid[x-1] && grid[x-1][y+1]) {
	                ret.push(grid[x-1][y+1]);
	            }

	            // Northeast
	            if(grid[x+1] && grid[x+1][y+1]) {
	                ret.push(grid[x+1][y+1]);
	            }

	        }

	        return ret;
	    }
	};

	function Graph(grid) {
	    var nodes = [];

	    for (var x = 0; x < grid.length; x++) {
	        nodes[x] = [];

	        for (var y = 0, row = grid[x]; y < row.length; y++) {
	            nodes[x][y] = new GraphNode(x, y, row[y]);
	        }
	    }

	    this.input = grid;
	    this.nodes = nodes;
	}

	Graph.prototype.toString = function() {
	    var graphString = "\n";
	    var nodes = this.nodes;
	    var rowDebug, row, y, l;
	    for (var x = 0, len = nodes.length; x < len; x++) {
	        rowDebug = "";
	        row = nodes[x];
	        for (y = 0, l = row.length; y < l; y++) {
	            rowDebug += row[y].type + " ";
	        }
	        graphString = graphString + rowDebug + "\n";
	    }
	    return graphString;
	};

	function GraphNode(x, y, type) {
	    this.data = { };
	    this.x = x;
	    this.y = y;
	    this.pos = {
	        x: x,
	        y: y
	    };
	    this.type = type;
	}

	GraphNode.prototype.toString = function() {
	    return "[" + this.x + " " + this.y + "]";
	};

	GraphNode.prototype.isWall = function() {
	    return this.type === 0;
	};

	function BinaryHeap(scoreFunction){
	    this.content = [];
	    this.scoreFunction = scoreFunction;
	}

	BinaryHeap.prototype = {
	    push: function(element) {
	        // Add the new element to the end of the array.
	        this.content.push(element);

	        // Allow it to sink down.
	        this.sinkDown(this.content.length - 1);
	    },
	    pop: function() {
	        // Store the first element so we can return it later.
	        var result = this.content[0];
	        // Get the element at the end of the array.
	        var end = this.content.pop();
	        // If there are any elements left, put the end element at the
	        // start, and let it bubble up.
	        if (this.content.length > 0) {
	            this.content[0] = end;
	            this.bubbleUp(0);
	        }
	        return result;
	    },
	    remove: function(node) {
	        var i = this.content.indexOf(node);

	        // When it is found, the process seen in 'pop' is repeated
	        // to fill up the hole.
	        var end = this.content.pop();

	        if (i !== this.content.length - 1) {
	            this.content[i] = end;

	            if (this.scoreFunction(end) < this.scoreFunction(node)) {
	                this.sinkDown(i);
	            }
	            else {
	                this.bubbleUp(i);
	            }
	        }
	    },
	    size: function() {
	        return this.content.length;
	    },
	    rescoreElement: function(node) {
	        this.sinkDown(this.content.indexOf(node));
	    },
	    sinkDown: function(n) {
	        // Fetch the element that has to be sunk.
	        var element = this.content[n];

	        // When at 0, an element can not sink any further.
	        while (n > 0) {

	            // Compute the parent element's index, and fetch it.
	            var parentN = ((n + 1) >> 1) - 1,
	                parent = this.content[parentN];
	            // Swap the elements if the parent is greater.
	            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
	                this.content[parentN] = element;
	                this.content[n] = parent;
	                // Update 'n' to continue at the new position.
	                n = parentN;
	            }

	            // Found a parent that is less, no need to sink any further.
	            else {
	                break;
	            }
	        }
	    },
	    bubbleUp: function(n) {
	        // Look up the target element and its score.
	        var length = this.content.length,
	            element = this.content[n],
	            elemScore = this.scoreFunction(element);

	        while(true) {
	            // Compute the indices of the child elements.
	            var child2N = (n + 1) << 1, child1N = child2N - 1;
	            // This is used to store the new position of the element,
	            // if any.
	            var swap = null;
	            var child1Score;
	            // If the first child exists (is inside the array)...
	            if (child1N < length) {
	                // Look it up and compute its score.
	                var child1 = this.content[child1N];
	                child1Score = this.scoreFunction(child1);

	                // If the score is less than our element's, we need to swap.
	                if (child1Score < elemScore){
	                    swap = child1N;
	                }
	            }

	            // Do the same checks for the other child.
	            if (child2N < length) {
	                var child2 = this.content[child2N],
	                    child2Score = this.scoreFunction(child2);
	                if (child2Score < (swap === null ? elemScore : child1Score)) {
	                    swap = child2N;
	                }
	            }

	            // If the element needs to be moved, swap it, and continue.
	            if (swap !== null) {
	                this.content[n] = this.content[swap];
	                this.content[swap] = element;
	                n = swap;
	            }

	            // Otherwise, we are done.
	            else {
	                break;
	            }
	        }
	    }
	};

	return {
	    astar: astar,
	    Graph: Graph
	};

});

var rpg = {
	Map : {},
	Tiles: {}
}

rpg.Tiles = {
	assets : [				
		[ "A4" , 'assets/images/Dungeon_A4.png' ],
		[ "A5" , 'assets/images/Dungeon_A5.png' ],
		[ "B" , 'assets/images/Dungeon_B.png' ],
		[ "DR" , 'assets/images/Door1.png' ]
	],
	loading: 0,
	loadImages : function(){
		while(asset = this.assets.pop()){
			var key = asset[0],
				value = asset[1];
			this[key] = new Image();
			rpg.Tiles.loading++;
			this[key].onload = function(){
				rpg.Tiles.loading--;
				if (rpg.Tiles.loading <= 0){
					rpg.Map.generate()
				}
			}
			this[key].src = 'https://raw.githubusercontent.com/AlexChesser/jsSprite/master/'+value;
		}
	}
}
	
	
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
	type: {
        "HALL" 		: { name: "HALL", a: 0, tile: "A5", x: 4*32, y: 4*32, broken: 0.4},
		"ESPACE" 	: { name: "ESPACE", a: 40, tile: "A5", x: 5*32, y: 6*32, broken: 0.05 },
		"SOLID"		: { name: "SOLID", a: 10, tile: "A4", x: (2*32)+16, y: (4*32)-16 },
		"DOOR"		: { name: "DOOR", a: 40, tile: "DR", x: 0*32, y: 0 },
		"UP"		: { name: "UP", a: 40, tile: "B", x: 2*32, y: 0 },
		"DOWN"		: { name: "DOWN", a: 40, tile: "B", x: 2*32, y: 1*32 },
		"PERIMETER" : { name: "PERIMITER", a: 40, tile: "A4", x: 10*32, y: 9*32 },
		"OOB"		: { name: "OOB", a: 40, tile: "A5", x: 0, y: 0 }
	},
	// Algorithm based on http://donjon.bin.sh/fantasy/dungeon/about/dungeon.pl
	// rewritten in javascript
    // altered to use astar to connect rooms instead of random corridors
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
		this.addStairs(d);
		//this.draw(d)

		d.level = this.floors.length+1;
		this.currentlevel = d.level;
		this.floors.push(d);
		console.log(this.floors)
		this.draw2(d);
	},
	up: function(){
		console.log("current level is"+this.currentlevel)
		if(this.currentlevel <= 1){
			return;
		} else {
			this.currentlevel--;
			console.log("so I can go up one level to "+this.currentlevel);
			this.draw2(this.floors[this.currentlevel-1]);
		}
	},
	down: function(){
		console.log("current level is"+this.currentlevel 
					+ "number of levels is" + this.floors.length)

		if(this.currentlevel < this.floors.length){
			this.currentlevel++;
			console.log("so i am drawing the existing level"+this.currentlevel)
			this.draw2(this.floors[this.currentlevel-1]);
		} else {
			console.log("so i am making a new level")
			this.generate();
		}
	},
	// create a multidimensional dungeon array
	// this will initially be filled with solid 
	empty_dungeon: function(d){
		for (var r = 0; r <= d.n_rows; r++) {
			d.cells.push([]);
			for (var c = 0; c <= d.n_cols; c++) {
				d.cells[r].push({
					'type' : this.type.SOLID, 
					'marker' : ".", 
					x: r, 
					y: c,
					isWall: function(){
						this.type > 3
					}
				});
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
	  			if (d.cells[r][c].type !== this.type.SOLID) {
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
					d.cells[r][c].type = this.type.PERIMETER;
				} else {
					d.cells[r][c].marker = " ";
					d.cells[r][c].type = this.type.ESPACE;
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
			var x = vxs[vx];
			d.cells[x.x][x.y].marker = "+"
			d.cells[x.x][x.y].type = this.type.DOOR
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
					cell.type = this.type.HALL;
				}
			}
		}
	},
	addStairs: function(d){
		var UP = d.rooms[0],
			DOWN = d.rooms[d.rooms.length-1]
		d.cells[UP.north+2][UP.west+2].type = this.type.UP;
		d.cells[DOWN.south-2][DOWN.east-2].type = this.type.DOWN;

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
	tile: function(t){
		cellwh = 32;
		var init = function(){
			t.canvas = document.createElement('canvas');
			t.canvas.setAttribute('width',  cellwh);
			t.canvas.setAttribute('height', cellwh);
			t.ctx = t.canvas.getContext('2d');
			t.ctx.fillStyle = "rgb(100,0,100)";
			t.ctx.strokeRect(0,0,t.width,t.height);
			imageLoaded()

		};
        var types = this.type,
            randrange =this.randrange;
		var imageLoaded = function(){
			var srcX = t.type.x, srcY =t.type.y, 
				srcWidth =32, srcHeight=32;
            if(Math.random() < t.type.broken) {
                switch(t.type.name){
                    case "ESPACE":
                        srcY = 13*32;
                          break;
                    case "HALL":
                        srcY = 12*32;
                        break;
                    default:
                }
            }
            // might make more sense to make each cell a stack of tiles that can be drawn from the bottom up.
            if(t.type.name === "UP"){
            	var ESPACE = types.ESPACE,
            		srcWidth = 32, srcHeight =32;
				t.ctx.drawImage(rpg.Tiles[ESPACE.tile], ESPACE.x, ESPACE.y, srcWidth, srcHeight, 
									0, 0, srcWidth, srcHeight);
            }
			t.ctx.drawImage(rpg.Tiles[t.type.tile], srcX, srcY, srcWidth, srcHeight, 
									0, 0, srcWidth, srcHeight);
			drawSelf();
		}
		var drawSelf = function(){
			rpg.MainContext.drawImage(t.canvas, t.x*32, t.y*32);	
		}
		init();
	},
	draw2:function(d){
		MainContext.clearRect(0,0,canvas.width,canvas.height);
		for(var r in d.cells){
			for (var c in d.cells[r]){
				this.tile(d.cells[r][c])
			}
		}
	}
}