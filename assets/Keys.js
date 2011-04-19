		document.addEventListener("keypress", 
			function(e){
				switch(e.which) {
					case 119:  // 'w'
				  		m.anim = m.actions.run;
				  		m.reanim();
				  		break;
					case 97:  // 'a' - turn right
				  		m.turn(-1);				  		
				  		break;
					case 115:  // 's'
				  		m.anim = m.actions.stand;
				  		m.reanim();
				  		break;
					case 100:  // 'd' - turn left
				  		m.turn(1);
				  		break;
					case 101: // e = attack
				  		m.anim = m.actions.block;
				  		m.reanim();
				  		break;
					case 120: // x = die
				  		m.anim = m.actions.die;
				  		m.reanim();
				  		break;				  		
					case 113: // q = attack
				  		m.anim = m.actions.attack;
				  		m.reanim();
				  		break;
						default:
				  			//code to be executed if n is different from case 1 and 2
				}
				//m.direction = 0;
			}, false);