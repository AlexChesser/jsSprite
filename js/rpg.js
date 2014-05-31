
// Create namespaces
var rpg = {
	init: function(){
		this.canvas = document.getElementById('game'); 
		this.ctx = this.canvas.getContext('2d');
		rpg.Tiles.loadImages();
	},
	canvas: null,
	ctx: null,
	// Tiles are the various images used in the game.
	// they are individual sprite sheets
	Tiles: {},
	// A cell is a single map square in the dungeon exentually expected to have
	// a sprite stack to be drawn from the bottom up, 
	// this way we can re-render any individual cell without loosing the content on it.
	// (also note that cell doesn't actually exist yet.. I might not even do it)
	Cell: {},
	// the game map as well as the full series of maps from beginning to end
	Map: {},
	// a mobile unit that can take action or be acted upon.
	// not quite sure how to use this yet, but every other game I've ssen has done it
	// likely the parent class that everything inherits from
	// (note that at the moment it lives in Character.js)
	Actor: {},
	// Character is the first mobile unit. Huzzah!
	// this inherits from Actor
	Character: {}
};