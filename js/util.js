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

// returns index of found object
Array.prototype.find = function(fn){
	var r = -1;
	for(var i in this){
		if(fn.call(this, this[i])){
			r = i;
			break;
		}
	}
	return r;
};

Object.defineProperty(Array.prototype, "find", { enumerable: false });

// returns an array of the indexes of the found objects
Array.prototype.findIndex = function(fn){
	var r = [];
	for(var i in this){
		if(fn.call(this, this[i]))
			r.push(parseInt(i));
	}
	return r;
}

Object.defineProperty(Array.prototype, "findIndex", { enumerable: false });

/**
returns random integer between l and h
*/
Math.randomInt = function(l, h) {
	return Math.floor(Math.random()*(h-l+1)+l);
}

Math.sign = function(n) {
	return (n / Math.abs(n));
}

Number.prototype.toRadians = function() {
	return (this*(Math.PI/180));
}

Number.prototype.toDegrees = function() {
	return ((this/180)*Math.PI);
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
 Line aggregate Object
*/
function Line(p1, p2){
	this.p1 = new Vector(p1.x, p1.y);
	this.p2 = new Vector(p2.x, p2.y);
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

Object.defineProperty(Rect.prototype, "center", {
	readonly: true,
	get: function(){
		return (new Vector(this.x + this.w/2, this.y + this.h/2));
	}
});

function rectLineCollide(r, l){
	
}

function rectPointCollide(r, v){
	if(r.x > v.x) return false;
	if(r.x + r.w < v.x) return false;
	if(r.y > v.y) return false;
	if(r.y+r.h < v.y) return false;
	return true;
}

function rectCollide(r1, r2){
	if(r1.x > r2.x+r2.w) return false;
	if(r1.x+r1.w < r2.x) return false;
	if(r1.y > r2.y+r2.h) return false;
	if(r1.y+r1.h < r2.y) return false;
	return true;
}

// returns a vector that will move r1 out of r2 :: untested
function uncollide(r1, r2){
	var closest = new Vector((r1.w+r2.w)/2, (r1.h+r2.h)/2);

	var c1 = r1.center;
	var c2 = r2.center;
	var cd = c1.sub(c2);
	var sign = new Vector(Math.sign(cd.x), Math.sign(cd.y));
	var cdAbs = cd.abs();
	var diff = closest.sub(cdAbs);
	var vMin = diff.smallP();

	vMin = vMin.mul(sign);
	return vMin;
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

Vector.prototype.normalize = function(){
	var len = this.length();

	if(len < 0)
		throw "LENGTH < 1 on vector...";

	if(len == 0)
		return (new Vector());

	return (new Vector(this.x/len, this.y/len));
}

Vector.prototype.abs = function(){
	return new Vector(Math.abs(this.x), Math.abs(this.y));
}

// returns new vector containing the smallest parameter
Vector.prototype.smallP = function(){
	if(this.x < this.y)
		return new Vector(this.x, 0);
	else
	 	return new Vector(0, this.y);
}

Vector.prototype.rotate90 = function(){
	// var m = [[0, -1], [1, 0]];
	return (new Vector(this.y*-1, this.x));
}

Vector.prototype.rotate270 = function(){
	return (new Vector(this.y, this.x*-1));
}

