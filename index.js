(function () {

  var root = this; 

  if (typeof module !== 'undefined' && module.exports)
    module.exports = factory;
  else
    root.simpleStopwatch = factory;

  function factory (dur, fmt, res, pad) {

    return new SimpleStopwatch(dur, fmt, res, pad);

  }

  function SimpleStopwatch (dur, fmt, res, pad) {

    /* private vars */

    var self = this;

    var resolution = res || 1000;
    var duration = dur || 0;
    var format = fmt || (dur ? '%dh:%dm:%ds' : '%h:%m:%s');
    var padding = pad || 0;

    var milliseconds;
    var started;
    var timeout;

    var events = {};

    /* public methods */

    function start () {

      if (!running()) {

        started = new Date().getTime();

        if (milliseconds)
          tick(resolution - (milliseconds % resolution));
        else
          tick();

      }

      emit('start resume', [time()]);

      return self;

    }

    function stop () {

      untick();

      emit('stop pause', [time()]);

      return self;

    }

    function toggle () {

      if (running())
        stop();
      else
        start();

      return self;

    }

    function reset () {

      var wasRunning = running();

      untick();

      started = undefined;
      milliseconds = 0;

      if (wasRunning)
        start();

      emit('reset', [time(0)]);

      return self;

    }

    function on (event, handler) {

      event = event.split(' ');

      for (var i = 0; i < event.length; i++) {

        if (event[i].length) {

          if (!events[event[i]])
            events[event[i]] = [handler];
          else
            events[event[i]].push(handler);

        }
      }

      return self;

    }

    function off (event, handler) {

      event = event.split(' ');

      for (var i = 0; i < event.length; i++) {
        
        if (events[event[i]]) {

          for (var j = 0; j < events[event[i]].length; j++) {

            if (events[event[i]][j] == handler)
              events[event[i]].splice(j, 1),
              j--;

          }
        }
      }

      return self;

    }

    function current () {

      if (running()) {

        return new Date().getTime() - started + (milliseconds || 0);

      } else {

        return milliseconds || 0;

      }
    }

    function running () {

      return typeof timeout != 'undefined';

    }

    function time (mill, dur, fmt, p) {

      if (typeof mill == 'undefined')
        mill = current();

      if (!dur)
        dur = duration;

      if (!fmt)
        fmt = format;

      if (typeof p == 'undefined')
        p = padding;

      var milliseconds = dMilliseconds = parseInt( mill % 1000 );
      var seconds = dSeconds = parseInt( (mill / 1000) % 60 ) ;
      var minutes = dMinutes = parseInt( ((mill / (1000 * 60)) % 60) );
      var hours   = dHours = parseInt( ((mill / (1000 * 60 * 60)) % 24) );

      if (dur) {

        var dMill = dur - mill;

        dMilliseconds = parseInt( dMill % 1000 );
        dSeconds = parseInt( (dMill / 1000) % 60 ) ;
        dMinutes = parseInt( ((dMill / (1000 * 60)) % 60) );
        dHours   = parseInt( ((dMill / (1000 * 60 * 60)) % 24) );

      }

      return fmt.replace(/%dms/g, padNumber(dMilliseconds, p))
        .replace(/%ds/g, padNumber(dSeconds, p))
        .replace(/%dm/g, padNumber(dMinutes, p))
        .replace(/%dh/g, padNumber(dHours, p))
        .replace(/%ms/g, padNumber(milliseconds, p))
        .replace(/%s/g, padNumber(seconds, p))
        .replace(/%m/g, padNumber(minutes, p))
        .replace(/%h/g, padNumber(hours, p));

    }

    /* private methods */

    function emit (event, args) {

      event = event.split(' ');

      for (var i = 0; i < event.length; i++) {

        if (events[event[i]]) {

          for (var j = 0; j < events[event[i]].length; j++) {

            events[event[i]][j].apply(self, args);

          }
        }
      }
    }

    function padNumber (n, p) {

      for (var i = 0; i < p; i++) {

        var max = Math.pow(10, i + 1);

        if (parseInt(n) < max)
          n = '0' + n;

      }

      return n;

    }

    function alias (event) {

      return function (handler) {

        on(event, handler);

        return self;

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

      emit('dong', [time(duration)]);

    }

    /* expose public methods */

    self.start = self.resume = start;
    self.stop = self.pause = stop;
    self.toggle = toggle;
    self.reset = reset;
    self.on = on;
    self.off = off;
    self.time = time;
    self.current = current;
    self.running = running;
    self.padding = padding;

    self.started = self.resumed = alias('start');
    self.stopped = self.paused = alias('stop');
    self.ticked = alias('tick');
    self.donged = self.ended = alias('dong');

    self.duration = function (dur) {

      if (typeof dur == 'undefined') {
        return duration; 
      } else {
        duration = dur;
        return self; 
      }
    }

    self.format = function (fmt) {

      if (typeof fmt == 'undefined') {
        return format;
      } else {
        format = fmt;
        return self;
      }
    }

    self.resolution = function (res) {

      if (typeof res == 'undefined') {
        return resolution;
      } else {
        resolution = res;
        return self;
      }
    }

    self.padding = function (pad) {

      if (typeof pad == 'undefined') {
        return padding;
      } else {
        padding = pad;
        return self;
      }
    }

    return self;

  }

})();