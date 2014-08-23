
function Bullet(args){
	if(!args) args = {};

	GameObject.call(this, args);

	// this.pos = new Vector(args.x, args.y);
	this.size = new Vector(20, 20);
	// this.vel = new Vector(this.)

	this.image = Game.assets["particle-ball"];
	this.damage = args.damage || 0;
	this.speed = args.speed || 120;
	this.liveTime = 6.0;
	this.startLife = Time.timestamp;
	this.timeLived = 0.0;

	this.update = function(t){
		var power = this.speed*t;
		var vel = new Vector(this.vel.x * power, this.vel.y * power);
		this.pos = this.pos.add(vel);

		if((Time.timestamp - this.startLife)/1000 > this.liveTime)
			this.die();
	}

	this.render = function(){
		this.context.save();
		this.context.drawImage(this.image, 
			0, 0, this.size.w, this.size.h,
			this.pos.x, this.pos.y, this.size.w, this.size.h);
		this.context.restore();
	}

}

Bullet.prototype = new GameObject;
Bullet.constructor = Bullet;

function Player(args){
	if(!args) args = {};

	GameObject.call(this, args);

	this.moveSpeed = 65; // pixels per second
	this.shootSpeed = 2.5; // per second
	this.bulletSpeed = 300; // pixels per second
	this.bulletDamage = 1;

	this.health = 3;
	this.armor = 0;
	this.trinkets = [];
	this.items = [];

	this.drag = 0.85;

	this.shootTime = 0;
	this.canShoot = true;

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

		// handle being able to shoot SUPER EFFING FAST
		if(!this.canShoot){
			if((this.shootTime += elapsedTime) >= (1000/this.shootSpeed/1000)){
				this.canShoot = true;
				this.shootTime = 0;
			}
		}

		if(KEYBOARD.isKeyDown('up_arrow')){
			this.shoot(new Vector(0, -1));
		}
		if(KEYBOARD.isKeyDown('down_arrow')){
			this.shoot(new Vector(0, 1));
		}
		if(KEYBOARD.isKeyDown('left_arrow')){
			this.shoot(new Vector(-1, 0));
		}
		if(KEYBOARD.isKeyDown('right_arrow')){
			this.shoot(new Vector(1, 0));
		}

		this.vel = this.vel.scale(this.drag);
		this.pos = this.pos.add(this.vel);

	};

	this.render = function(){
		this.context.save();
			this.context.fillStyle = "rgb(255, 0, 255)";
			this.context.strokeStyle = "rgb(100, 0, 100)";
			this.context.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
			this.context.strokeRect(this.pos.x, this.pos.y, this.size.w, this.size.h);

		this.context.restore();
	};

	this.shoot = function(vdir){
		if(!this.canShoot) return;

		this.canShoot = false;

		Game.pushGameObject(new Bullet({
			x: this.pos.x,
			y: this.pos.y,
			vx: vdir.x,
			vy: vdir.y,
			speed: this.bulletSpeed
		}));
	};

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
		var tile = "";
		for(var w = 0; w < horizCount; w++){
			for(var h = 0; h < vertCount; h++){
				if(w < horizCount / 2) tile = "tile-sand";
				else if(w == horizCount / 2) tile = "tile-sand-grass-1";
				else tile = "tile-grass";
				this.context.drawImage(Game.assets[tile],
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


	game.pushGameObject = function(ob){
		gameObjects.push(ob);
	}

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

		game.assetHandler.prepare("tile-wood", "img/tile-wood-1.png", "image");
		game.assetHandler.prepare("tile-sand", "img/tile-sand-1.png", "image");
		game.assetHandler.prepare("tile-grass", "img/tile-grass-1.png", "image");
		game.assetHandler.prepare("tile-sand-grass-1", "img/tile-merge-grass-sand-1.png", "image");
		game.assetHandler.prepare("particle-plus", "img/particle-plus.png", "image");
		game.assetHandler.prepare("particle-ball", "img/particle-ball.png", "image");
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

		for(var i in gameObjects){
			if(gameObjects[i].dead)
				gameObjects.splice(i, 1);
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