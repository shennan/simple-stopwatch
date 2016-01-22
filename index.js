(function () {

  var root = this; 

  if (typeof module !== 'undefined' && module.exports)
    module.exports = factory;
  else
    root.simpleStopwatch = factory;

  function factory (dur, fmt, res) {

    return new SimpleStopwatch(dur, fmt, res);

  }

  function SimpleStopwatch (dur, fmt, res) {

    /* private vars */

    var self = this;

    var resolution = res || 1000;
    var duration = dur || 0;
    var format = fmt || (dur ? '%dh:%dm:%ds' : '%h:%m:%s');

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

    function time (mill, dur, fmt) {

      if (typeof mill == 'undefined')
        mill = current();

      if (!dur)
        dur = duration;

      if (!fmt)
        fmt = format;

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

      return fmt.replace(/%dms/g, dMilliseconds)
        .replace(/%ds/g, dSeconds)
        .replace(/%dm/g, dMinutes)
        .replace(/%dh/g, dHours)
        .replace(/%ms/g, milliseconds)
        .replace(/%s/g, seconds)
        .replace(/%m/g, minutes)
        .replace(/%h/g, hours);

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

    self.start = self.resume = start;
    self.stop = self.pause = stop;
    self.reset = reset;
    self.on = on;
    self.off = off;
    self.time = time;
    self.current = current;

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

    return self;

  }

})();