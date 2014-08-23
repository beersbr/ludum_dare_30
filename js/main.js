
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

function GameObject(args) {
	if(!args) args = {};

	this.pos = new Vector(
		(args.x || 0), 
		(args.y || 0)
	);

	// velocity
	this.vel = new Vector(
		(args.vx || 0), 
		(args.vy || 0)
	);

	this.size = new Vector(
		(args.w || 0), 
		(args.h || 0)
	)

	this.getRect = function(){
		return new Rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
	}

	this.update = function(){};
	this.render = function(){};
}

GameObject.prototype._canvas = undefined;
GameObject.prototype._context = undefined;


function Player(args){
	if(!args) args = {};

	GameObject.call(this, args);

	this.moveSpeed = 60;
	this.shootSpeed = 100;
	this.bulletSpeed = 300;
	this.bulletDamage = 1;

	this.health = 3;
	this.armor = 0;
	this.trinkets = [];
	this.items = [];

	this.drag = 0.87;

	this.update = function(elapsedTime){
		var speed = this.moveSpeed * elapsedTime;

		if(KEYBOARD.isKeyDown('a')){
			this.vel.x -= speed;
		}
		if(KEYBOARD.isKeyDown('d')){
			this.vel.x += speed;
		}
		if(KEYBOARD.isKeyDown('w')){
			this.vel.y -= speed;
		}
		if(KEYBOARD.isKeyDown('s')){
			this.vel.y += speed;
		}

		this.vel = this.vel.scale(this.drag);
		this.pos = this.pos.add(this.vel);

	}

	this.render = function(){
		this.context.save();
			this.context.fillStyle = "rgb(255, 0, 255)";
			this.context.strokeStyle = "rgb(100, 0, 100)";
			this.context.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
			this.context.strokeRect(this.pos.x, this.pos.y, this.size.w, this.size.h);

		this.context.restore();
	}
}

Player.prototype = new GameObject;
Player.constructor = Player;


function GameLevel(){

	var width = 800;
	var height = 600;
	var tileSize = 40;

	var horizCount = width/tileSize;
	var vertCount = height/tileSize;

	this.canvas = $("<canvas width='"+width+"' height='"+height+"' />")[0];
	this.image = this.canvas;
	this.context = this.canvas.getContext('2d');


	this.generateLevelImage = function(){
		for(var w = 0; w < horizCount; w++){
			for(var h = 0; h < vertCount; h++){
				this.context.drawImage(Game.assets["wood-tile"],
					0, 0, 40, 40,
					w*tileSize, h*tileSize, tileSize, tileSize);
			}
		}
	}
}



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
	var currentFrameTime = 0.0;

	var gameObjects = [];

	game.assetHandler = new AssetHandler();
	game.assets = {};

	game.level = undefined;

	/**
	 Initialize resources. Images, sounds so load can init objects
	*/
	game.init = function(){
		CANVAS = $("#game")[0];
		CONTEXT = CANVAS.getContext("2d");

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

		game.assetHandler.prepare("wood-tile", "img/tile-wood-1.png", "image");
		game.assetHandler.load().done(function(h){
			game.assets = h;
			game.load();
		});
	}

	/**
	 Load the game. Organize the resources so the game can start
	*/
	game.load = function(){

		game.level = new GameLevel();
		game.level.generateLevelImage();

		var player = new Player({
			x: 100, y: 100,
			w: 40,  h: 40
		});

		gameObjects.push(player)

		currentFrameTime = Time.timestamp;
		game.run();
	}

	game.update = function(t){
		var elapsedTime = (t/1000);

		for(var i in gameObjects){
			gameObjects[i].update(elapsedTime);
		}

	}

	game.render = function(){

		// clear the background
		// CONTEXT.save();
		// CONTEXT.fillStyle = "rgb(0, 0, 0)";
		// CONTEXT.fillRect(0, 0, WIDTH, HEIGHT);
		// CONTEXT.restore();

		CONTEXT.drawImage(game.level.image, 0, 0, WIDTH, HEIGHT);


		for(var i in gameObjects){
			gameObjects[i].render();
		}
	}

	game.run = function(){
		lastFrameTime = currentFrameTime;
		currentFrameTime = Time.timestamp;
		var elapsedFrameTime = currentFrameTime - lastFrameTime;

		game.update(elapsedFrameTime);
		game.render();

		requestAnimFrame(game.run);
	}

	return game;
}());