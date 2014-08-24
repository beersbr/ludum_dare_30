function Animator(args){
	this.frameSize = 40; // size in pixels of each frame (we are using squares)

	this.totalFrames = args.frames || 1;
	this.currentFrame = 0;

	this.imageSrc = args.src;
	this.image = args.image;

	this.update = function(){
		this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
	}

	this.render = function(){

	}
}