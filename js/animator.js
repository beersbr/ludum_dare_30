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
function Animation(scope, totalTime){

	this.id = AID++;

	this.done = false;
	this.scope = scope;

	this.update = function(t){
		this._update.bind(scope)(t, totalTime);
		totalTime -= t;
		if(totalTime <= 0)
			this.done = true;
	}

	this.render = function(){
		this._render.bind(scope);
	}

	this.done = function(){

	}
}

AID = 0;
function Animation(image, callback){
	this.id = AID++;

	this.image = image;
	this.canvas = $("<canvas width='"+this.image.width+"px' height'"+this.image.height+"px'>")[0];
	this.context = this.canvas.getContext('2d');
	this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height);

	this.pixelData = this.context.getImageData(0, 0, this.image.width, this.image.height);
	

	this.up = callback;

	var _done = function(){};
	this.frames = 0;

	this.update = function(t){

		for(var i = 0; i < this.pixelData.data.length; i+=4){
			var a = this.up([this.pixelData.data[i], 
							 this.pixelData.data[i+1], 
							 this.pixelData.data[i+2], 
							 this.pixelData.data[i+3]], 
							 t, this);

			this.pixelData.data[i]   = a[0];
			this.pixelData.data[i+1] = a[1];
			this.pixelData.data[i+2] = a[2];
			this.pixelData.data[i+3] = a[3];

		}
		this.frames++;
	}

	this.render = function(c, x, y, w, h){
		var canvas = $("<canvas width='"+this.image.width+"px' height'"+this.image.height+"px'>")[0];
		var context = canvas.getContext('2d');
		context.putImageData(this.pixelData, 0, 0);

		c.drawImage(canvas, 0, 0, 40, 40, x, y, w, h);
	}


	this.finished = function(){
		_done()
	}

	this.done = function(cb){
		_done = cb;
	}
}