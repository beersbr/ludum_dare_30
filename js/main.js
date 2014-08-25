
/******************************
 *	Player 
 ******************************/
function Player(args){
	if(!args) args = {};

	GameObject.call(this, args);

	this.hv = new Vector(0, 0);

	this.moveSpeed = 50; // pixels per second
	this.shootSpeed = 5.8; // per second
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

	this.image = Game.assets['player-guy'];

	this.wasHit = false;
	this.safeTime = 0.8;
	this.hitTime = this.safeTime;

	this._update = function(elapsedTime){

		if(this.health <= 0)
			this.die();

		if(this.wasHit){
			this.hitTime -= elapsedTime;
			if(this.hitTime <= 0)
				this.wasHit = false;
		}

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

	this.die = function(){

		// DIED
		Game.currentLevel = -1;
		Game.nextLevel();
		// start over
	}

	this._render = function(){
		this.context.drawImage(this.image, this.pos.x, this.pos.y, this.size.w, this.size.h);
	};

	this.shoot = function(vdir){
		if(!this.canShoot) return;

		AUDIO.playHit("hit-shoot");

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

			//if(o.tileState == "slick") apply drag mod

			if(o.tileState != "solid")
				return;
				
			var v = uncollide(this.getRect(), o.getRect());

			if(o.tileDamage) {
				if(!this.wasHit){
					AUDIO.playHit("hit-ouch");
					this.health -= o.tileDamage;
					StatusBar.removeHealth({amount:o.tileDamage});
					this.addAnimation(new TurnRed(this, 0.8), false);

					this.wasHit = true;
					this.hitTime = this.safeTime;

					var ret = this.center.sub(o.center).normalize().scale(10.0);
					this.vel = this.vel.add(ret);
				}
			}


			this.pos = this.pos.add(v);
		}

		if(o instanceof DragonBoss){
			v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v);	

			if(this.wasHit) return;

			AUDIO.playHit("hit-ouch");

			this.health -= 3;
			StatusBar.removeHealth({amount:3});
			this.addAnimation(new TurnRed(this, 0.8), false);

			this.wasHit = true;
			this.hitTime = this.safeTime;
		}

		if(o instanceof BearBoss){
			v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v);	

			if(this.wasHit) return;

			AUDIO.playHit("hit-ouch");

			this.health -= 2;
			StatusBar.removeHealth({amount:2});
			this.addAnimation(new TurnRed(this, 0.8), false);

			this.wasHit = true;
			this.hitTime = this.safeTime;
		}

		if(o instanceof Bear){
			v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v);	

			if(this.wasHit) return;

			AUDIO.playHit("hit-ouch");

			this.health -= 1;
			StatusBar.removeHealth();
			this.addAnimation(new TurnRed(this, 0.8), false);

			this.wasHit = true;
			this.hitTime = this.safeTime;
		}

		if(o instanceof Crow){
			v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v);	

			if(this.wasHit) return;

			AUDIO.playHit("hit-ouch");

			this.health -= 1;
			StatusBar.removeHealth();
			this.addAnimation(new TurnRed(this, 0.8), false);

			this.wasHit = true;
			this.hitTime = this.safeTime;
		}

		if(o instanceof Snake){
			v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v);	

			if(this.wasHit) return;

			this.health -= 1;
			StatusBar.removeHealth();
			this.addAnimation(new TurnRed(this, 0.8), false);

			this.wasHit = true;
			this.hitTime = this.safeTime;
		}

		if(o instanceof Walrus){
			v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v);	

			if(this.wasHit) return;

			this.health -= 2;
			StatusBar.removeHealth({amount:2});
			this.addAnimation(new TurnRed(this, 0.8), false);

			this.wasHit = true;
			this.hitTime = this.safeTime;
		}

		if(o instanceof ItemHeart){
			AUDIO.playHit("hit-item");
			this.health += 1;
			StatusBar.addHealth();
		}

		if(o instanceof ItemArmor){
			AUDIO.playHit("hit-item");
			this.armor += 1;
			StatusBar.addArmor();
		}

		if(o instanceof ItemMoveSpeed){
			AUDIO.playHit("hit-item");
			this.MoveSpeed += 3;
			// StatusBar.addHealth();
		}

		if(o instanceof ItemShootSpeed){
			AUDIO.playHit("hit-item");
			this.shootSpeed += 0.2;
			// StatusBar.addHealth();
		}
	}
}

Player.prototype = new GameObject;
Player.constructor = Player;


/******************************
 *	GameState Player Died
 ******************************/


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

	this.tileState = args.state;
	this.tileDamage = args.damage;

	if(this.tileState == "solid")
		this.collidable = true;
}

Tile.prototype = new GameObject;
Tile.constructor = Tile;


/******************************
 *	Door
 ******************************/

function Door(args){
	if(!args) args = {};

	GameObject.call(this, args);
	this.image = Game.assets['door-basic'];
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

		// debugger;
		Game.nextLevel();
		return false;
	}
}

Door.prototype = new GameObject;
Door.constructor = Door;


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
			
			StatusBar.name = mapJson.name;
			AUDIO.playSong("song-jungle");

			var health = 0;
			if(Game.player){
				health = Game.player.health
				
				if(Game.player.health <= 0)
					health = 3;

			}

			

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
						isDoor: (mapTiles[r][c].door == true),
						damage: mapTiles[r][c].damage
					});

					if(mapTiles[r][c].door == true){
						console.log("DOOR");
						Game.door1 = t;
					}
					Game.pushGameObject(t);

					self.context.drawImage(Game.assets[mapTiles[r][c]['image']],
						0, 0, 40, 40,
						w*tileSize, h*tileSize+40, tileSize, tileSize);
					
					// Add items
					mapItems = mapTiles[r][c].items;
					
					for(var i in mapItems) {
						console.log(i,mapItems[i]);
						// Check likelyhood of spawn
						var rnd = (Math.floor(Math.random() * 1000) + 1) / 1000
						if(mapItems[i].probability < rnd) break;
						var item = new window[mapItems[i].name]({
							x: x, y: y,
							w: 40,  h: 40,
							image: Game.assets[mapItems[i].image]
						});
		
						Game.gameObjects.push(item);				
						
					}
					
					
					// Add enemies
					var mapEnemies = mapTiles[r][c].enemies;
					for(var e in mapEnemies) {
						// Check likelyhood of spawn
						var rnd = (Math.floor(Math.random() * 1000) + 1) / 1000
						if(mapEnemies[e].probability < rnd) break;
						var enemy = new window[mapEnemies[e].name]({
							x: x, y: y,
							w: 40,  h: 40,
							image: Game.assets[mapEnemies[e].image]
						});
		
						Game.gameObjects.push(enemy);				
		
					}									
				}
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

		AUDIO.playHit('hit-open');

		var door = new Door({x: Game.door1.pos.x, y: Game.door1.pos.y, w: 40, h: 40});

		var x = door.center.x;
		var y = door.center.y;

		var c = Math.randomInt(20, 50);

		for(var i = 0; i < 50; i++)
			Game.pushGameObject(GenerateParticle(x, y, 0, Game.assets['particle-green']));

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

	status.name = "";

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

	status.removeHealth = function(args){
		if(!args) args = {};
		args.amount = args.amount || 1;
		renderBar();
		healthBars -= args.amount;
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
		
		// CONTEXT.fillRect(0, 0, WIDTH, HEIGHT);

		CONTEXT.save();
		CONTEXT.drawImage(status.barImage, 0, 0, 800, 40);
		renderHealth();

		CONTEXT.font = "10px PressStart2P";
		CONTEXT.fillStyle = "rgb(0, 0, 0)";
		var lenText = CONTEXT.measureText(status.name).width;
		CONTEXT.fillText(status.name, WIDTH-lenText-18, 26);
		context.drawImage(CANVAS, 0, 0, WIDTH, HEIGHT);

		CONTEXT.restore();
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
		set: function(v){
			_gameObjects = v;
		}
	})

	running = false;

	// game.gameObjects = gameObjects;

	game.assetHandler = new AssetHandler();
	game.assets = {};

	game.level = undefined;
	game.player = undefined;

	game.levels = [
	// "map-1-1.json",
	// "map-1-2.json",
	// "map-1-3.json",
	// "map-1-4.json",
	// "map-1-5.json",
	"map-2-1.json",
	"map-2-2.json",
	"map-2-3.json",
	"map-2-4.json",
	"map-3-1.json",
	"map-3-2.json",
	"map-4-1.json",
	"map-4-2.json",
	"map-4-5.json"
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

		// game.assetHandler.prepare("bear-growl", "sounds/bear-growl.mp3", "audio");
		// game.assetHandler.prepare("bear-roar", "sounds/bear-growl.mp3", "audio");

		game.assetHandler.prepare("song-jungle", "sounds/jungle-tune.mp3", "audio");
		// game.assetHandler.prepare("song-jungle2", "sounds/jungle-tune2.aif", "audio");
		game.assetHandler.prepare("song-sand", "sounds/sand-tune.mp3", "audio");

		game.assetHandler.prepare("hit-bear", "sounds/hit-bear.wav", "audio");
		game.assetHandler.prepare("hit-open", "sounds/hit-open.wav", "audio");
		game.assetHandler.prepare("hit-shoot", "sounds/hit-shoot.wav", "audio");
		game.assetHandler.prepare("hit-ouch", "sounds/hit-ouch.wav", "audio");
		game.assetHandler.prepare("hit-item", "sounds/hit-item.wav", "audio");

		game.assetHandler.load().done(function(h){
			game.assets = h;

			for(var k in game.assets){
				if(k.slice(0, 4) == "hit-")
					AUDIO.setHit(k, game.assets[k]);

				if(k.slice(0, 5) == "song-")
					AUDIO.setSong(k, game.assets[k]);
			}
			

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

		if(!running){
			running = true;
			game.run();
		}
			
	}

	game.update = function(t){
		var elapsedTime = (t/1000);

		for(var i = 0; i < _gameObjects.length; i++){
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