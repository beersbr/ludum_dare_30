
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

	this.draw = function(){

	}

}

function GameObject(args) {
	if(!args) args = {};

	this.x = args.x || 0;
	this.y = args.y || 0;
	this.vx = args.vx || 0;
	this.vy = args.vy || 0;

	this.update = function(){};
	this.render = function(){};
}

GameObject.prototype._canvas = undefined;
GameObject.prototype._context = undefined;


function Player(args){
	if(!args) args = {};

	this.x = args.x;
	this.y = args.y;

	this.update = function(){

	}
}

Player.prototype = new GameObject;
Player.constructor = Player;

/******************************
 *	GAME 
 ******************************/
var Game = (function(){
	var game = {};

	var WIDTH = 800;
	var HEIGHT = 600;

	var DOCUMENT = $(document);
	var WINDOW = $(window);

	var CANVAS = undefined;
	var CONTEXT = undefined;

	var startTime = Time.timestamp;
	var frameTime = 0.0;

	var gameObjects = [];

	game.init = function(){
		var CANVAS = $("#game")[0];
		var CONTEXT = CANVAS.getContext("2d");

		GameObject.prototype._canvas = CANVAS;
		GameObject.prototype._context = CONTEXT;

		Object.defineProperty(GameObject.prototype, "canvas", {
			get: function(){
				return this._canvas;
			},
			readonly: true
		});
		Object.defineProperty(GameObject.prototype, "context", {
			get: function(){
				return this._context;
			},
			readonly: true
		});
	}

	game.load = function(){

	}

	game.update = function(){

	}

	game.render = function(){

	}

	game.run = function(){

		requestAnimFrame(game.run);
	}

	return game;
}());