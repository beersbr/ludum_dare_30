
/******************************
 *	Bullet
 ******************************/
function Bullet(args){
	if(!args) args = {};

	GameObject.call(this, args);

	// this.pos = new Vector(args.x, args.y);
	this.size = new Vector(20, 20);
	this.pos = new Vector(this.pos.x - this.size.w/2, this.pos.y - this.size.h/2);
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

	this.onCollide = function(go){
		if(go instanceof Bullet)
			return;

		if(go instanceof Player)
			return;

		this.collidable = false;
		this.die();

	}

	this.collidable = true;
}

Bullet.prototype = new GameObject;
Bullet.constructor = Bullet;



/******************************
 *	Player 
 ******************************/
function Player(args){
	if(!args) args = {};

	GameObject.call(this, args);

	this.hv = new Vector(0, 0);

	this.moveSpeed = 66; // pixels per second
	this.shootSpeed = 2.5; // per second
	this.bulletSpeed = 400; // pixels per second
	this.bulletDamage = 1;

	this.health = 3;
	this.armor = 0;
	this.trinkets = [];
	this.items = [];

	this.drag = 0.85;

	this.shootTime = 0;
	this.canShoot = true;

	this.collidable = true;

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

		var bulletVel = this.vel.scale(0.06);

		if(KEYBOARD.isKeyDown('up_arrow')){
			this.shoot((new Vector(0, -1)).add(bulletVel));
		}
		if(KEYBOARD.isKeyDown('down_arrow')){
			this.shoot((new Vector(0, 1)).add(bulletVel));
		}
		if(KEYBOARD.isKeyDown('left_arrow')){
			this.shoot((new Vector(-1, 0)).add(bulletVel));
		}
		if(KEYBOARD.isKeyDown('right_arrow')){
			this.shoot((new Vector(1, 0)).add(bulletVel));
		}

		// this.pos = this.pos.add(this.hv);
		// this.hv = new Vector();
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
			x: this.center.x,
			y: this.center.y,
			vx: vdir.x,
			vy: vdir.y,
			speed: this.bulletSpeed
		}));
	};

	this.onCollide = function(o){
		if(o instanceof Tile){
			var v = uncollide(this.getRect(), o.getRect());
			// this.hv = v; //this.vel.add(v.scale(0.1));
			this.pos = this.pos.add(v);
		}
		if(o instanceof Bear){
			v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v);	
		}
	}

}

Player.prototype = new GameObject;
Player.constructor = Player;



/******************************
 *	Bear 
 ******************************/
function Bear(args){
	if(!args) args = {};

	GameObject.call(this, args);

	this.moveSpeed = 66; // pixels per second
	this.shootSpeed = 0; // per second
	this.bulletSpeed = 0; // pixels per second
	this.bulletDamage = 0;

	this.health = 3;
	this.armor = 0;
	this.trinkets = [];
	this.items = [];

	this.drag = 0.85;

	this.shootTime = 0;
	this.canShoot = false;

	this.collidable = true;

	this.animations = [];

	this.update = function(elapsedTime){
		var speed = this.moveSpeed * elapsedTime;

		this.vel = this.vel.add(Game.player.pos.sub(this.pos).normalize().scale(0.4));

		this.vel = this.vel.scale(this.drag);
		this.pos = this.pos.add(this.vel);

		for(var i in this.animations)
			this.animations[i].update(elapsedTime);

	};

	this.render = function(){
		this.context.save();
		this.context.drawImage(this.image, 0, 0, 40, 40, this.pos.x, this.pos.y, this.size.w, this.size.h);

		for(var i in this.animations){
			this.animations[i].render(this.context, this.pos.x, this.pos.y, 40, 40);
			// this.context.putImageData(this.animations[i].pixelData, this.pos.x, this.pos.y);
		}

		this.context.restore();
	};

	this.shoot = function(vdir){
		if(!this.canShoot) return;

		this.canShoot = false;

		Game.pushGameObject(new Bullet({
			x: this.center.x,
			y: this.center.y,
			vx: vdir.x,
			vy: vdir.y,
			speed: this.bulletSpeed
		}));
	};

	this.onCollide = function(o){
		if(o instanceof Tile){
			var v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v);
		}

		if(o instanceof Bullet){
			var anim = new Animation(this.image, function(p, t, c){
				// p[3] = 100;				
				// if(p[3] == 0) return p;

				if(c.frames == 0)
					p[0] = 255;

				p[0] -= 20;

				if(c.frames > 13)
					c.finished();

				return p;
			});

			var self = this;
			anim.done(function(){
				var i = self.animations.find(function(a){
					return (this.id == a.id)
				})
				self.animations.splice(i, 1);
			});

			this.animations.push(anim);
		}
	}

}

Bear.prototype = new GameObject;
Bear.constructor = Bear;


/******************************
 *	Tile
 ******************************/
function Tile(args){
	if(!args) args = {};

	GameObject.call(this, args);

	this.update = function(t){

	};

	this.onCollide = function(go){
		// console.log(this, "Collided with: ", go);
	}

	if(args.state != "passable"){
		this.collidable = true;
	}
}

Tile.prototype = new GameObject;
Tile.constructor = Tile;

/******************************
 *	GAME Level
 ******************************/
function GameLevel(){

	var width = 800;
	var height = 600;
	var tileSize = 40;

	var horizCount = width/tileSize;
	var vertCount = height/tileSize;

	this.canvas = $("<canvas width='"+width+"' height='"+height+"' />")[0];
	this.image = this.canvas;
	this.context = this.canvas.getContext('2d');

	this.tiles = [];

	this.generateLevelImage = function(){
		var self = this;
		$.ajax({url:"json/map-1-1.json",dataType:"json",success:function(mapJson){
			for(var r in mapJson) {
				for(var c in mapJson[r]) {
					w = c.replace("col-","") - 1;
					h = r.replace("row-","") - 1;

					var x = w*tileSize;
					var y = h*tileSize+40;

					var t = new Tile({
						x: x,
						y: y,
						w: 40,
						h: 40,
						state: mapJson[r][c].state
					});
					Game.pushGameObject(t);

					self.context.drawImage(Game.assets[mapJson[r][c]['image']],
						0, 0, 40, 40,
						w*tileSize, h*tileSize+40, tileSize, tileSize);
				}
			}
		}});
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
	game.player = undefined;


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
		Particle.prototype._canvas = CANVAS;
		Particle.prototype._context = CONTEXT;

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

		Object.defineProperty(Particle.prototype, "canvas", {
			get: function(){
				return this._canvas;
			},
			readonly: true
		});
		Object.defineProperty(Particle.prototype, "context", {
			get: function(){
				return this._context;
			},
			readonly: true
		});


		$.ajax({ url: "./json/tiles.json" }).success(function(e){
			for(var k in e)
				this.assetHandler.prepare(k, e[k], "image");
		}.bind(game));

		game.assetHandler.prepare("particle-plus", "img/particle-plus.png", "image");
		game.assetHandler.prepare("particle-ball", "img/particle-ball.png", "image");
		game.assetHandler.prepare("status-bar", "img/status-bar.png", "image");
		game.assetHandler.prepare("enemy-bear", "img/enemy-bear.png", "image");

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

		game.player = player;


		var bear = new Bear({
			x: 400, y: 500,
			w: 40,  h: 40,
			image: Game.assets["enemy-bear"]
		});

		gameObjects.push(bear)

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

		// the heavy collision detection step :(
		for(var i in GameObject.collisionList){
			var o = GameObject.collisionList[i];
			if(o.dead){
				GameObject.collisionList.splice(i, 1);
				i -= 1;
				continue;
			}

			for(var j = parseInt(i)+1; j < GameObject.collisionList.length; j++){
				var p = GameObject.collisionList[j];

				// lol: get rect!
				if(rectCollide(o.getRect(), p.getRect())){
					p.onCollide(o);
					o.onCollide(p);
				}
			}

		}
	}

	game.render = function(){

		CONTEXT.drawImage(game.level.image, 0, 0, WIDTH, HEIGHT);

		for(var i = 1; i < gameObjects.length; i++){
			gameObjects[i].render();
		}

		gameObjects[0].render();

		CONTEXT.drawImage(game.assets['status-bar'], 0, 0, 800, 40);
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