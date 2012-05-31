CALC.mouseHandler = function() {

	var that = {};
	var hold = false,
		drag = false,
		stategy,
		path = [];
	
	that.mouseDown = function(mouseStrategy, event) {
		event.stopPropagation();
		strategy = mouseStrategy;
		hold = true;
		strategy.mouseDown(event);
	}

	that.mouseUp = function(mouseStrategy, event) {
		event.stopPropagation();
		if (!drag)
			strategy.click(event);
		hold = drag = false;
		path = [];
		strategy.mouseUp(event);
	}

	that.mouseMove = function(mouseStrategy, event) {
		event.stopPropagation();
		drag = hold;
		if (drag) {
			path.push({x: event.clientX, y: event.clientY});
			strategy.drag(event, path);
		}
		else
			strategy = mouseStrategy;
		strategy.mouseMove(event);
	}
	
	that.mouseWheel = function(mouseStrategy, event) {
		event.stopPropagation();
		strategy.scroll(event);
	}
	
	that.touchStart = function(mouseStrategy, event) {
		path = [];
		event.stopPropagation();
		//TODO IF WANTED
		/*if ( event.touches.length == 1 ) {

			event.preventDefault();

			onPointerDownPointerX = event.touches[ 0 ].pageX;
			onPointerDownPointerY = event.touches[ 0 ].pageY;

			onPointerDownLon = lon;
			onPointerDownLat = lat;
		}*/
	}
	
	that.touchEnd = function(mouseStrategy, event) {
		path = [];
	}

	that.touchMove = function(mouseStrategy, event) {
		event.stopPropagation();
		if ( event.touches.length == 1 ) {
			path.push({x: event.touches[0].pageX, y: event.touches[0].pageY});
			strategy.drag(event, path);
		}
		/*if ( event.touches.length == 1 ) {
			event.preventDefault();

			lon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + onPointerDownLon;
			lat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

			render();
		}*/
		
	}
	
	
	return that;

}();