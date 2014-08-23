function Animator(args){
	this.frameSize = 40; // size in pixels of each frame (we are using squares)

	this.totalFrames = args.frames || 1;
	this.currentFrame = 0;

	this.imageSrc = args.src;
	this.image = new Image();

	this.isLoaded = false;
	this.loadedPromise = new Promise();

	this.image.onload = (function(){
		this.isLoaded = true;
		this.loadedPromise.resolve();
	}).bind(this);

	this.doneLoading = function(fn){
		this.loadedPromise.done(fn);
		return this.loadedPromise;
	}

	this.update = function(){
		this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
	}

	this.render = function(){

	}
}