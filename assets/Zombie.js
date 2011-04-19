function Zombie() {
	var obj = {
		img:		'assets/images/zombie_0.png',
		canvas:		0,
		ctx:		0,
		cols: 		36,
		rows: 		8,
		width: 		128,
		height:		128,
		speed: 		3,		
		frame: 0,
		direction: 3,
		anim : {
			stand: 	{start:  0,	length: 4, end: 'loop'		, playdir: 1},
			run: 	{start:  4,	length: 8, end: 'loop'	 	, playdir: 1},
			attack: {start: 12, length: 10, end: 'reverse'	, playdir: 1},
			brains: {start: 16, length: 4, end: 'reverse'	, playdir: 1},			
			block:	{start: 20, length: 2, end: 'hold'		, playdir: 1},
			die: 	{start: 22, length: 6, end: 'hold'		, playdir: 1},
			crit: 	{start: 28, length: 7, end: 'hold'		, playdir: 1}			
		}
	};
	return obj;
}