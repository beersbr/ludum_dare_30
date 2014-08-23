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

/**
 Rectangle aggregate Object
*/
function Rect(x, y, w, h){
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 1;
	this.h = h || 1;
}

/**
 Vector aggregate Object
*/
function Vector(x, y){
	this.x = x || 0;
	this.y = y || 0;

	this.z = 0;

	this.length = function(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};
}

Object.defineProperty(Vector.prototype, "w", {
	get: function(){
		return this.x;
	},
	set: function(v){
		this.x = v;
	}
});

Object.defineProperty(Vector.prototype, "h", {
	get: function(){
		return this.y;
	},
	set: function(v){
		this.y = v;
	}
});

Vector.prototype.add = function(vec){
	return (new Vector(this.x + vec.x, this.y + vec.y));
}

Vector.prototype.sub = function(vec){
	return (new Vector(this.x - vec.x, this.y - vec.y));
}

Vector.prototype.mul = function(vec){
	return (new Vector(this.x * vec.x, this.y * vec.y));
}

Vector.prototype.div = function(vec){
	return (new Vector(this.x / vec.x, this.y / vec.y));
}

Vector.prototype.scale = function(s){
	return (new Vector(this.x * s, this.y * s));
}


