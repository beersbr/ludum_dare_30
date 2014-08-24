function Animator(args){
	this.frameSize = 40; // size in pixels of each frame (we are using squares)

	this.totalFrames = args.frames || 1;
	this.currentFrame = 0;

	this.imageSrc = args.src;
	this.image = args.image;

	this.updateFn

	this.update = function(){
		this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
	};

	this.render = function(){

	}
}


AID = 0;
function Animation(scope, totalTime, construct){

	this.id = AID++;

	this.done = false;
	this.scope = scope;
	_done = function(){};

	this.state = {};

	construct.bind(scope)(this.state)

	this.update = function(t){
		this._update.bind(scope)(t, totalTime, this.state);

		totalTime -= t;
		if(totalTime <= 0){
			this.done = true;
		}

		if(this.done)
			_done.bind(this)(this.id);
	}

	this.render = function(){
		this._render.bind(scope)(this.state);
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
		var canvas = $("<canvas width='"+s.image.width+"px' height'"+s.image.height+"px'>")[0];
		var context = canvas.getContext('2d');
		context.putImageData(s.pixelData, 0, 0);

		this.context.drawImage(canvas, 0, 0, 40, 40, this.pos.x, this.pos.y, this.size.w, this.size.h);
	}
}

function Shrink(scope, totalTime){

	Animation.call(this, scope, totalTime, function(s){
		s.shrinkRate = (this.size.w/totalTime);
		console.log(s.shrinkRate);
	});

	this._update = function(t, timeLeft, s){
		var d = s.shrinkRate * t;
		this.size.w -= d;
		this.size.h -= d;

		this.pos.x += d/2;
		this.pos.y += d/2;
	}

	this.render = function(t, timeLeft, s){

	}

}