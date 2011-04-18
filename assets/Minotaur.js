function Minotaur() {
	var obj = {
		img			: 'assets/images/minotaur.png',
		canvas		: 0,
		ctx			: 0,
		cols		: 24,
		rows		: 8,
		width		: 128,
		height		: 128,
		frame		: 0,
		direction	: 3,
		anim : {
			stand: 	{start:  0,	length: 4, end: 'reverse'	, playdir: 1},
			run: 	{start:  4,	length: 8, end: 'loop'	 	, playdir: 1},
			attack: {start: 12, length: 4, end: 'reverse'	, playdir: 1},
			block:	{start: 16, length: 2, end: 'hold'		, playdir: 1},
			die: 	{start: 18, length: 6, end: 'hold'		, playdir: 1}
		}
	};
	return obj;
}