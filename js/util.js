requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
     window.webkitRequestAnimationFrame ||
     window.mozRequestAnimationFrame ||
     window.oRequestAnimationFrame ||
     window.msRequestAnimationFrame ||
     function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
       window.setTimeout(callback, 1000/60);
     };
})();

/**
returns random integer between l and h
*/
Math.randomInt = function(l, h) {
	return Math.floor(Math.random()*(h-l+1)+l);
}

var Time = {};
Object.defineProperty(Time, "timestamp", {
	get: function(){
		return (+new Date);
	}
});

/**
promise constructor
*/
function Promise(){
	var _done = function(){};
	var _resolved = false;

	var _data = undefined;

	this.done = function(fn){
		_done = fn;
		if(_resolved)
			_done(_data);
	}

	this.resolve = function(d){
		_data = d;
		_done(_data);
	}
}