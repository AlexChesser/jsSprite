function Collision() {
	var C = {
		dirty: function(object1, object2) {
			// This takes 2 Sprite objects and does a bounding-box collision detection:
		    var left1, left2;
		    var right1, right2;
		    var top1, top2;
		    var bottom1, bottom2;

		    left1 = object1.Xpos;
		    left2 = object2.Xpos;
		    right1 = object1.Xpos + object1.width;
		    right2 = object2.Xpos + object2.width;
		    top1 = object1.Ypoz;
		    top2 = object2.Ypos;
		    bottom1 = object1.Ypos + object1.height;
		    bottom2 = object2.Ypos + object2.height;

		    if (bottom1 < top2) return false;
		    if (top1 > bottom2) return false;

		    if (right1 < left2) return false;
		    if (left1 > right2) return false;

		    return true;
		
		},
		precise: function() { 
			
		}
	}
}