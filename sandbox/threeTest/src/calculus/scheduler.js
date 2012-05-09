CALC = {};

CALC.scheduler = function() {
	
	var nextId = 0;
	var events = [];
	var that = {};

	that.attach = function(fun, delay) {

		delay = delay || 0;
		events[nextId] = {
			fun: fun,
			delay: delay
		};
		return nextId++;
	};

	that.detach = function(id) {
		if (events[id] !== undefined) {
			delete events[id];
			return true;
		}
		return false;
	};

	that.animate = function() {
	
		var ev;
		
		//Copy all events, to prevent events queued in current event loop to be executed
		var currentEvents = [];
		for (e in events) {
			if (events.hasOwnProperty(e)) {
				currentEvents[e] = events[e];
			}
		}
		
		for (e in currentEvents) {
			if (currentEvents.hasOwnProperty(e)) {
				ev =  currentEvents[e];
				if (ev.delay-- <= 0)  {
					ev.fun(ev.args);
					that.detach(e);
				}
			}
		}
		requestAnimationFrame(that.animate);
		render();
		stats.update();
	};


	return that;

}();


CALC.interpolations = {
	linear: function(t) {
		return t;
	},
	sinusodial: function(t) {
		return (Math.sin((t-1/2) * Math.PI) + 1)/2;
	},
	cubic: function(t) {
		return (3-2*t)*(t*t);
	},
	quintic: function(t) {
		return (6*t*t-15*t+10)*(t*t*t);
	}
};





CALC.animate = function(object, args, duration, interpolate, delay, callback) {

	for (a in args) {
		if (args[a] === undefined) delete args[a];
	}
	
	callback = callback || function(){};

	// object[key] ska bli value på duration frames
	var t = 0;
	var source;

	var step = function() {
		var a;
		t += 1/duration;
		interpolation = interpolate(t);
		for (a in args) {
			if (args.hasOwnProperty(a)) {
				dest = args[a];
				object[a] = source[a] + interpolation*(dest - source[a]);
			}
		}
		if (t < 1) {
			CALC.scheduler.attach(step);
		}
		else {
			callback();
		}
	};

	var start = function() {
		source = {};
		for (a in args) {
			if (args.hasOwnProperty(a)) {
				source[a] = object[a];
			}
		}
		step();
	};

	CALC.scheduler.attach(start, delay);
}


CALC.rotate = function(object, args, timing, callback) {
	timing = timing || {};
	CALC.animate(object.rotation, {
		x: args.x,
		y: args.y,
		z: args.z
	}, timing.duration, timing.interpolation, timing.delay, callback);
	return this;
};

CALC.translate = function(object, args, timing, callback) {
	timing = timing || {};
	CALC.animate(object.position, {
		x: args.x,
		y: args.y,
		z: args.z
	}, timing.duration, timing.interpolation, timing.delay, callback);
	return this;
};

CALC.fade = function(material, args, timing, callback) {
	timing = timing || {};
	CALC.animate(material, {
		opacity: args.opacity
	}, timing.duration, timing.interpolation, timing.delay, callback);
	return this;
};




/*
object.rotate({
	x: Math.PI/2,
	y: Math.PI
}, {
	duration: 120,
	interpolation: CALC.interpolations.quintic,
	delay: 120
});
*/


