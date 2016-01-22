(function () {

  var root = this; 

  if (typeof module !== 'undefined' && module.exports)
    module.exports = factory;
  else
    root.simpleStopwatch = factory;

  function factory (dur, res, fmt) {

    return new SimpleStopwatch(dur, res, fmt);

  }

  function SimpleStopwatch (dur, res, fmt) {

  	/* private vars */

  	var self = this;

  	var resolution = res || 1000;
  	var duration = dur || 0;
  	var format = fmt || '%m:%s:%ms';

  	var milliseconds;
  	var started;
  	var timeout;

  	var events = {};

  	/* public methods */

  	function start () {

  		started = new Date().getTime();

  		if (milliseconds)
  			tick(resolution - (milliseconds % resolution));
  		else
  			tick();

  		emit('start');

  		return self;

  	}

  	function stop () {

  		untick();

  		emit('stop');

  		return self;

  	}

  	function reset () {

  		untick();

  		started = undefined;
  		milliseconds = 0;

  		emit('reset');

  		return self;

  	}

  	function on (event, handler) {

  		if (!events[event])
  			events[event] = [handler];
  		else
  			events[event].push(handler);

  		return self;

  	}

  	function off (event, handler) {

  		if (events[event]) {

  			for (var i = 0; i < events[event].length; i++) {

  				if (events[event][i] == handler)
  					events[event].splice(i, 1),
  					i--;

  			}
  		}

  		return self;

  	}

  	function current () {

  		if (timeout) {

  			return new Date().getTime() - started + (milliseconds || 0);

  		} else {

  			return milliseconds || 0;

  		}
  	}

  	function time (mill) {

  		var c = typeof mill == 'undefined' ? current() : mill;

  		var ms = Math.floor(((c % 1000) / 1000) * 100);
			var s = (c - (c %= 1000)) / 1000;
			var m = (s - (s %= 60)) / 60;
			var h = (m - (m %= 60)) / 60;

			ms = ms < 10 ? '0' + ms : ms;
			s = s < 10 ? '0' + s : s;
			m = m < 10 ? '0' + m : m;
			h = h < 10 ? '0' + h : h;

			return format.replace(/%ms/g, ms).replace(/%s/g, s).replace(/%m/g, m).replace(/%h/g, h);

  	}

  	/* private methods */

  	function emit (event, args) {

  		if (events[event]) {

  			for (var i = 0; i < events[event].length; i++) {

  				events[event][i].apply(self, args);

  			}
  		}
  	}

  	function tick (remaining) {

  		var c = current();
  		var next = remaining || resolution;

  		emit('tick', [time(c)]);

  		if (!duration || c + next < duration)
  			timeout = setTimeout(tick, next);
  		else
  			timeout = setTimeout(dong, duration - c);

  	}

  	function untick () {

  		milliseconds = current();

  		if(timeout)
  			clearTimeout(timeout),
  			timeout = undefined;

  	}

  	function dong () {

  		milliseconds = duration;

  		if(timeout)
  			clearTimeout(timeout),
  			timeout = undefined;

  		emit('dong', [duration]);

  	}

  	/* expose public methods */

  	self.start = start;
  	self.stop = stop;
  	self.reset = reset;
  	self.on = on;
  	self.off = off;
  	self.time = time;
  	self.current = current;
  	
  	self.duration = function (dur) { duration = dur; }
  	self.resolution = function (res) { resolution = res; }
  	self.format = function (fmt) { format = fmt; }

  	return self;

  }

})();