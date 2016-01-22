# simple-stopwatch

## install

Load the script from the browser:

```html
<script type="text/javascript" src="simple-stopwatch/index.js"></script>
```

Or install using npm:

```
$ npm install simple-stopwatch
```

## usage

Use from the window:

```js
simpleStopwatch().start();
```

Or use a CommonJS module loader and namespace it:

```js
var stopwatch = require('simple-stopwatch');

stopwatch().start();
```

Start a basic count:

```js
simpleStopwatch().on('tick', function (time) {
	
	console.log(time);

}).start();
```

Start a count and stop after 10 seconds:

```js
simpleStopwatch(10000).on('tick', function (time) {
	
	console.log(time);

}).on('dong', function (time) {
	
	console.log(time, 'dong!');

}).start();
```

Format the time as seconds:milliseconds:

```js
simpleStopwatch(10000, '%s:%ms').on('tick', function (time) {
	
	console.log(time);

}).on('dong', function (time) {
	
	console.log(time, 'dong!');

}).start();
```

Format the time as a countdown to the duration:

```js
simpleStopwatch(10000, '%ds:%dms').on('tick', function (time) {
	
	console.log(time);

}).on('dong', function (time) {
	
	console.log(time, 'dong!');

}).start();
```

## formats

For formatting times, use printf-style strings:

```
%h /* hours */
%m /* minutes */
%s /* seconds */
%ms /* milliseconds */

%dh /* hours until duration */
%dm /* minutes until duration */
%ds /* seconds until duration */
%dms /* milliseconds until duration */
```

Note that, in order to use countdown formatting, you need to have set a duration for the stopwatch.