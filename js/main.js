
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

	this.health = args.health || 3;
	this.armor = args.armor || 0;
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

		if(o instanceof ItemHeart){
			this.health += 1;
			StatusBar.addHealth();
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
		return false;
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

		var nw = Math.max(this.sizeFactor + this.size.w, 1);
		var nh = Math.max(this.sizeFactor + this.size.h, 1);

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
		$.ajax({url:"json/"+this.level,dataType:"json", async:false,success:function(mapJson){
			
			
			var health = 0;
			if(Game.player)
				health = Game.player.health

			// TODO: this will all be based on the level json
			var player = new Player({
				x: mapJson.playerStart[0], y: mapJson.playerStart[1],
				w: 40,  h: 40,
				health: health
			});

			Game.gameObjects.push(player)
			Game.player = player;

			StatusBar.setHealth(player.health);
			StatusBar.setArmor(player.armor);
			
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
						isDoor: (mapTiles[r][c].door == true)
					});

					if(mapTiles[r][c].door == true){
						console.log("DOOR");
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
				// Check likelyhood of spawn
				var rnd = (Math.floor(Math.random() * 1000) + 1) / 1000
				if(mapItems[i].probability < rnd) break;
				var item = new window[mapItems[i].name]({
					x: 40 * mapItems[i].location[0], y: 40 * mapItems[i].location[1],
					w: mapItems[i].location[2],  h: mapItems[i].location[3],
					image: Game.assets[mapItems[i].image]
				});

				Game.gameObjects.push(item);				
				
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
 *	Status bar
 ******************************/
var StatusBar = (function(){
	var status = {};

	var WIDTH = 800;
	var HEIGHT = 40;
	var tileWidth = 40;

	var healthBarWidth = 20;
	var armorBarWidth = 20;

	var healthOffset = tileWidth+5;

	var healthBars = 0;
	var armorBars = 0;

	var CANVAS = $("<canvas width='"+WIDTH+"px' height='"+HEIGHT+"px' >")[0];
	var CONTEXT = CANVAS.getContext('2d');



	status.init = function(args){
		status.healthImage = args.healthImage;
		status.armorImage = args.armorImage;
		status.barImage = args.barImage;

		CONTEXT.drawImage(status.barImage, 0, 0, WIDTH, HEIGHT);
	}

	status.setHealth = function(hp){
		renderBar();
		healthBars = hp;
		renderHealth();
	}

	status.setArmor = function(ar){
		renderBar();
		armorBars = ar;
		renderHealth();	
	}

	status.addHealth = function(){
		renderBar();
		healthBars += 1;

		renderHealth();
	}

	status.removeHealth = function(){
		renderbar();
		healthBars -= 1;
		renderHealth();
	}

	status.addArmor = function(){
		renderBar();
		armorBars += 1;
		renderHealth();
	}

	status.removeArmor = function(){
		renderBar();
		armorBars -= 1;
		renderHealth();
	}

	function renderHealth(){
		for(var i = 0; i < healthBars; i++){
			CONTEXT.drawImage(status.healthImage, healthOffset+(20*i)+5, 0, 20, 40);
		}
		renderArmor();
	}

	function renderArmor(){

		var armorOffset = healthOffset+(5*healthBars) + 5;
		for(var i = 0; i < armorBars; i++){
			CONTEXT.drawImage(status.armorImage, armorOffset+(20*i)+5, 0, 20, 40);
		}
	}

	function renderBar(){
		CONTEXT.drawImage(status.barImage, 0, 0, WIDTH, HEIGHT);
	}

	status.render = function(context){
		// CONTEXT.drawImage(status.barImage, 0, 0, 800, 40);
		context.drawImage(CANVAS, 0, 0, WIDTH, HEIGHT);
	}

	return status;
}());

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
	"map-1-3.json",
	"map-1-4.json",
	"map-2-1.json",
	"map-4-1.json"
	]

	game.currentLevel = -1;

	game.nextLevel = function(){
		_gameObjects = [];
		GameObject.collisionList = [];

		game.currentLevel += 1;
		game.level = new GameLevel(game.levels[game.currentLevel]);
		game.level.generateLevelImage();
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


		$.ajax({ url: "./json/images.json" }).success(function(e){
			for(var k in e)
				this.assetHandler.prepare(k, e[k], "image");
		}.bind(game));


		game.assetHandler.load().done(function(h){
			game.assets = h;

			StatusBar.init({
				healthImage: game.assets['status-health-bar'],
				armoreImage: game.assets['status-armore-bar'],
				barImage: game.assets['status-bar']
			})

			game.nextLevel();
		});	
	}

	/**
	 Load the game. Organize the resources so the game can start
	*/
	game.load = function(){


		// game.level = new GameLevel(game.levels[game.currentLevel]);
		

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

		// move the enemies away from each other
		for(var i = 0; i < game.level.enemies.length; i++){
			var o = game.level.enemies[i];
			var dir = new Vector();

			for(var j = 0; j < game.level.enemies.length; j++){
				if (i == j) continue;

				var p = game.level.enemies[j];
				var diff = o.center.sub(p.center).normalize().scale(0.02);
				dir = dir.add(diff);
			}

			o.vel = o.vel.add(dir);
		}

		// the heavy collision detection step :(
		for(var i = 0; i < GameObject.collisionList.length; i++){
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
					if(p.onCollide(o) === false) break;
					if(o.onCollide(p) === false) break;
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

		StatusBar.render(CONTEXT);

		
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