rpg.Tiles = {
	assets : [				
		[ "A4" , 'assets/images/Dungeon_A4.png' ],
		[ "A5" , 'assets/images/Dungeon_A5.png' ],
		[ "B" , 'assets/images/Dungeon_B.png' ],
		[ "DR" , 'assets/images/Door1.png' ],
		[ "F01" , 'assets/images/001-Fighter01.png' ]
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
					rpg.start()
				}
			}
			this[key].src = value;
		}
	}
}
