
var AID = 0;
function Animation(scope, totalTime, construct){

	this.id = AID++;

	this.done = false;
	this.scope = scope;
	var _done = function(){};

	this.state = {};

	construct.bind(this.scope)(this.state)

	this.update = function(t){
		this._update.bind(this.scope)(t, totalTime, this.state);

		totalTime -= t;
		if(!isFinite(totalTime))
			this.done = true;
		
		if(totalTime <= 0){
			this.done = true;
		}

		if(this.done == true)
			_done.bind(this.scope)(this.id);			
	}

	this.render = function(){
		this._render.bind(this.scope)(this.state);
	}

	this.done = function(cb){
		_done = cb;
	}
}

function TurnRed(scope, totalTime){
	Animation.call(this, scope, totalTime, function(s){
		s.image = this.image;
		s.canvas = $("<canvas width='"+s.image.width+"px' height'"+s.image.height+"px'>")[0];
		s.context = s.canvas.getContext('2d');
		s.context.drawImage(s.image, 0, 0, s.image.width, s.image.height);
		s.pixelData = s.context.getImageData(0, 0, s.image.width, s.image.height);
		s.rate = 255/totalTime;
		s.total = 255;
	});

	this._update = function(t, timeLeft, s){
		s.total -= s.rate*t;

		for(var i = 0; i < s.pixelData.data.length; i+=4){
			s.pixelData.data[i] = s.total;

		}
	}

	this._render = function(s){
		var canvas = $("<canvas width='"+s.image.width+"px' height='"+s.image.height+"px'>")[0];
		var context = canvas.getContext('2d');
		context.putImageData(s.pixelData, 0, 0);
		this.context.drawImage(canvas, 0, 0, this.image.width, this.image.height, this.pos.x, this.pos.y, this.size.w, this.size.h);
	}
}

function Shrink(scope, totalTime){

	Animation.call(this, scope, totalTime, function(s){
		s.shrinkRate = (this.size.w/totalTime);
	});

	this._update = function(t, timeLeft, s){
		var d = s.shrinkRate * t;
		this.size.w -= d;
		this.size.h -= d;

		this.size.w = Math.max(this.size.w, 1);
		this.size.h = Math.max(this.size.h, 1);

		this.pos.x += d/2;
		this.pos.y += d/2;
	}

	this.render = function(t, timeLeft, s){

	}
}