function Tile() {
	var obj = {
		type		: 'tile',
		img			: 'assets/images/grass_and_water.png',
		canvas		: 0,
		ctx			: 0,
		cols		: 4,
		rows		: 6,
		width		: 64,
		height		: 64,
		speed		: 10,
		frame		: 0,
		direction	: 3
		
	};
	return obj;
}