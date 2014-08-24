
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

	this.getRect = function(){
		return (new Rect(this.pos.x + 5, this.pos.y + 5, this.size.w-10, this.size.h-10));
	}

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
		if(o instanceof Crow){
			v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v);	
		}
	}
}

Player.prototype = new GameObject;
Player.constructor = Player;



/******************************
 *	Tile
 ******************************/
function Tile(args){
	if(!args) args = {};

	GameObject.call(this, args);

	this.update = function(t){

	};

	// this.render = function(){
	// 	this.context.save();
	// 	this.context.fillStyle = "rgb(255, 0, 255)";
	// 	this.context.fillRect(this.pos.x + 10, this.pos.y + 10, this.size.w - 20, this.size.h - 20);
	// 	this.context.restore();

	// }

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
 *	Door
 ******************************/

function Door(args){
	if(!args) args = {};

	GameObject.call(this, args);
	this.image = Game.assets['tile-wood'];
	this.collidable = true;

	this.update = function(go){

	}

	this.render = function(){
		this.context.drawImage(this.image, this.pos.x, this.pos.y, this.size.w, this.size.h);
	}

	this.getRect = function(){
		var scale = 5;
		return (new Rect(this.pos.x+scale, this.pos.y+scale, this.size.w-(scale*2), this.size.h-(scale*2)));
	}

	this.onCollide = function(o){
		if(! (o instanceof Player))
			return;

		Game.nextLevel();
	}
}

Door.prototype = new GameObject;
Door.constructor = Door;


/******************************
 *	Item
 ******************************/
function Item(args){
	if(!args) args = {};	

	GameObject.call(this, args);

	this.image = args.image;
	this.collidable = true;

	this.sizeMod = 10;
	this.scale = 0.0;
	this.sizeFactor = 1.0;
	this.rotate = 0

	this._update = function(t){
		this.scale += t*2.5;
		this.sizeFactor = Math.cos(this.scale) * this.sizeMod;

		this.rotate += 2*t;
	}

	this._render = function(){
		this.context.translate(this.center.x, this.center.y);
		this.context.rotate(this.rotate);

		var nw = this.sizeFactor + this.size.w;
		var nh = this.sizeFactor + this.size.h;

		this.context.drawImage(this.image,
			0, 0, 40, 40,
			0-nw/2, 0-nh/2,
			nw, nh);

		// this.context.drawImage(this.image, 0, 0, 40, 40, 
		// 	this.pos.x, this.pos.y, this.sizeFactor + this.size.w, this.sizeFactor + this.size.h);
	}

	this.onCollide = function(o){
		if(!(o instanceof Player))
			return;		
	}

}
ItemHeart.prototype = new GameObject;
ItemHeart.constructor = ItemHeart;


function ItemHeart(args){
	GameObject.call(this, args);
	Item.call(this, args);

	this.image = Game.assets['item-heart'];
	this.size = new Vector(25, 25);

	this.onCollide = function(o){
		if(!(o instanceof Player))
			return;

		o.health += 1;

		for(var i = 0; i < Math.randomInt(10, 20); i++){
			var p = GenerateParticle(this.pos.x, this.pos.y, 0, Game.assets['particle-plus']);
			Game.pushGameObject(p)
		}

		this.die();
	}


	this.die = function(){
		this.addAnimation(new Shrink(this, 0.5), true);
		this.collidable = false;
		this.dying = true;


		var selfId = this.id;
	}

}

Item.prototype = new GameObject;
Item.constructor = Item;


/******************************
 *	GAME Level
 ******************************/
function GameLevel(level){

	var width = 800;
	var height = 600;
	var tileSize = 40;

	var horizCount = width/tileSize;
	var vertCount = height/tileSize;

	this.level = level;

	this.canvas = $("<canvas width='"+width+"' height='"+height+"' />")[0];
	this.image = this.canvas;
	this.context = this.canvas.getContext('2d');

	this.tiles = [];
	this.enemies = [];

	this.generateLevelImage = function(){
		var self = this;
		$.ajax({url:"json/"+this.level,dataType:"json",success:function(mapJson){
			
			// Place tiles
			var mapTiles = mapJson.tiles;
			for(var r in mapTiles) {
				for(var c in mapTiles[r]) {
					w = c.replace("col-","") - 1;
					h = r.replace("row-","") - 1;

					var x = w*tileSize;
					var y = h*tileSize+40;

					var t = new Tile({
						x: x,
						y: y,
						w: 40,
						h: 40,
						state: mapTiles[r][c].state,
						isDoor: (mapTiles[r][c].door == 1)
					});

					if(mapTiles[r][c].door == 1){
						Game.door1 = t;
					}
					Game.pushGameObject(t);

					self.context.drawImage(Game.assets[mapTiles[r][c]['image']],
						0, 0, 40, 40,
						w*tileSize, h*tileSize+40, tileSize, tileSize);
				}
			}
			
			// Add items
			mapItems = mapJson.items;
			for(var i in mapItems) {
				
			}
			
			// Add enemies
			var mapEnemies = mapJson.enemies;
			for(var e in mapEnemies) {
				// Check likelyhood of spawn
				var rnd = (Math.floor(Math.random() * 1000) + 1) / 1000
				if(mapEnemies[e].probability < rnd) break;
				var enemy = new window[mapEnemies[e].name]({
					x: 40 * mapEnemies[e].location[0], y: 40 * mapEnemies[e].location[1],
					w: mapEnemies[e].location[2],  h: mapEnemies[e].location[3],
					image: Game.assets[mapEnemies[e].image]
				});

				Game.gameObjects.push(enemy);				

			}
		
		}});
	}

	this.load = function(){
		// TODO: this will all be based on the level json
		var player = new Player({
			x: 100, y: 100,
			w: 40,  h: 40
		});

		Game.gameObjects.push(player)
		Game.player = player;
/*
		var bear = new Bear({
			x: 400, y: 500,
			w: 40,  h: 40,
			image: Game.assets["enemy-bear"]
		});

		Game.gameObjects.push(bear);
*/		
		var crow = new Crow({
			x: 700, y: 200,
			w: 40,  h: 40,
			image: Game.assets["enemy-crow"]
		});

		Game.gameObjects.push(crow);

		var item = new ItemHeart({
			x: 400, y: 300,
			w: 40, h: 40
		});

		Game.gameObjects.push(item);

	}

	this.update = function(t){

		if(this.enemies.length == 0){
			this.enemiesDead();
			
		}
	}

	this.render = function(){

	}

	this.enemiesDead = function(){


		var door = new Door({x: Game.door1.pos.x, y: Game.door1.pos.y, w: 40, h: 40});


		var idx = Game.gameObjects.find(function(o){
			return (o.id == Game.door1.id);
		});
		Game.door1.collidable = false;
		Game.gameObjects.splice(idx, 1);

		Game.pushGameObject(door);

		this.update = function(){};
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

	var _gameObjects = [];

	Object.defineProperty(game, "gameObjects", {
		get: function(){
			return _gameObjects;
		},
		set: function(){
			_gameObjects = [];
		}
	})

	// game.gameObjects = gameObjects;

	game.assetHandler = new AssetHandler();
	game.assets = {};

	game.level = undefined;
	game.player = undefined;

	game.levels = [
	"map-1-1.json",
	"map-1-2.json",
	"map-2-1.json",
	"map-4-1.json"
	]

	game.currentLevel = -1;

	game.nextLevel = function(){
		_gameObjects = [];
		GameObject.collisionList = [];

		game.currentLevel += 1;
		game.level = new GameLevel(game.levels[game.currentLevel]);
		game.load();
	}

	game.pushGameObject = function(ob){
		_gameObjects.push(ob);
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
		game.assetHandler.prepare("enemy-crow", "img/enemy-crow.png", "image");
		game.assetHandler.prepare("item-heart", "img/item-heart.png", "image");

		game.assetHandler.load().done(function(h){
			game.assets = h;
			game.nextLevel();
		});		
	}

	/**
	 Load the game. Organize the resources so the game can start
	*/
	game.load = function(){


		// game.level = new GameLevel(game.levels[game.currentLevel]);
		game.level.generateLevelImage();

		game.level.load();

		currentFrameTime = Time.timestamp;
		game.run();
	}

	game.update = function(t){
		var elapsedTime = (t/1000);

		for(var i in _gameObjects){
			_gameObjects[i].update(elapsedTime);
		}

		for(var i in _gameObjects){
			if(_gameObjects[i].dead)
				_gameObjects.splice(i, 1);
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

		game.level.update();
	}

	game.render = function(){

		CONTEXT.drawImage(game.level.image, 0, 0, WIDTH, HEIGHT);

		for(var i = 1; i < _gameObjects.length; i++){
			_gameObjects[i].render();
		}

		game.player.render();

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