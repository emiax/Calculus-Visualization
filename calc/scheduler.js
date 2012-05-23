

CALC.scheduler = function() {
	
	var nextId = 0;
	var events = [];
	var that = {};

	that.attach = function(fun, delay, evtHandle) {
		nextId++;

		if (evtHandle) {
			evtHandle.reassign();
		} else {
			evtHandle = function() {
				var that = {};
				var evtId = nextId;
				that.stop = function() {
					CALC.scheduler.detach(evtId);
				};
				that.reassign = function() {
					evtId = nextId;	
				};
				that.pause = function() {
					CALC.scheduler.pause(evtId);
				}
				that.resume = function() {
					CALC.scheduler.resume(evtId);
				}

				return that;
			}();
		}

		delay = delay || 0;
		events[nextId] = {
			fun: fun,
			delay: delay,
			evtHandle: evtHandle,
			paused: false
		};
		return evtHandle;
	};

	that.pause = function(id) {
		if (events[id]) {
			events[id].paused = true;
		}
	}

	that.resume = function(id) {
		if (events[id]) {
			events[id].paused = false;
		}
	}

	that.detach = function(id) {
		if (events[id] !== undefined) {
			delete events[id];
			return true;
		}
		return false;
	};

	that.tick = function() {
	
		var ev;
		
		//Copy all events, to prevent events queued in current event loop to be executed
		var currentEvents = [];
		for (e in events) {
			if (events.hasOwnProperty(e) && !events[e].paused) {
				currentEvents[e] = events[e];
			}
		}
		
		for (e in currentEvents) {
			if (currentEvents.hasOwnProperty(e)) {
				ev =  currentEvents[e];
				if (ev.delay-- <= 0)  {
					ev.fun();
					that.detach(e);
				}
			}
		}
		
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





CALC.animate = function(object, args, duration, interpolate, delay, callback, evtHandle) {

	for (a in args) {
		if (args[a] === undefined) delete args[a];
	}
	
	callback = callback || function(){};
	interpolate = interpolate || CALC.interpolations.linear;
	delay = delay || 0;

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
			CALC.scheduler.attach(step, 0, evtHandle);
		}
		else {
			CALC.scheduler.attach(callback, 0, evtHandle);
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

	var evtHandle = CALC.scheduler.attach(start, delay, evtHandle);
	return evtHandle;
}


CALC.rotate = function(object, args, timing, callback, evtHandle) {
	timing = timing || {};
	return CALC.animate(object.rotation, {
		x: args.x,
		y: args.y,
		z: args.z
	}, timing.duration, timing.interpolation, timing.delay, callback, evtHandle);
};

CALC.translate = function(object, args, timing, callback, evtHandle) {
	timing = timing || {};
	return CALC.animate(object.position, {
		x: args.x,
		y: args.y,
		z: args.z
	}, timing.duration, timing.interpolation, timing.delay, callback, evtHandle);
};

CALC.fade = function(material, args, timing, callback, evtHandle) {
	timing = timing || {};
	return CALC.animate(material, {
		opacity: args.opacity
	}, timing.duration, timing.interpolation, timing.delay, callback, evtHandle);
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

