/******************************
 *	Bear 
 ******************************/
function Bear(args){
	if(!args) args = {};

	GameObject.call(this, args);

	this.moveSpeed = 25; // pixels per second
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

	// add to current level enemies
	Game.level.enemies.push(this);

	this._update = function(elapsedTime){
		var speed = this.moveSpeed * elapsedTime;

		if(!this.dying)
			this.vel = this.vel.add(Game.player.pos.sub(this.pos).normalize().scale(speed));

		this.vel = this.vel.scale(this.drag);
		this.pos = this.pos.add(this.vel);

		if(this.health <= 0 && !this.dying)
			this.die();

		if(this.pos.x < 0 || this.pos.x > 800 || this.pos.y < 0 || this.pos.y > 600){
			console.error("BEAR POS: ", this.pos);
			this.dead = true;
		}

	};

	this._render = function(){
		this.context.drawImage(this.image, 0, 0, 40, 40, this.pos.x, this.pos.y, this.size.w, this.size.h);
	}

	this.onCollide = function(o){
		if(o instanceof Tile){
			if(o.tileState != "solid")
				return;

			var v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v);
		}

		if(o instanceof Bullet){
			AUDIO.playHit("hit-bear");
			this.addAnimation(new TurnRed(this, 0.3), false);

			var d = this.pos.sub(Game.player.pos).normalize().scale(8.0);
			this.vel = this.vel.add(d);
			this.health -= 1;
		}
	}

	this.die = function(){

		this.addAnimation(new Shrink(this, 0.5), true);
		// this._update = function(){};
		this.collidable = false;
		this.dying = true;


		// TODO: move into game
		var selfId = this.id;
		var idx = Game.level.enemies.find(function(id){ return (selfId == id.id);})
		Game.level.enemies.splice(idx, 1);
	}

}

Bear.prototype = new GameObject;
Bear.constructor = Bear;

/******************************
 *	Crow 
 ******************************/
function Crow(args){
	if(!args) args = {};

	GameObject.call(this, args);

	this.image = args.image || Game.assets['enemy-crow'];

	this.moveSpeed = 11; // pixels per second
	this.shootSpeed = 0; // per second
	this.bulletSpeed = 0; // pixels per second
	this.bulletDamage = 0;

	this.health = 1;
	this.armor = 0;
	this.trinkets = [];
	this.items = [];

	this.drag = 0.97;

	this.shootTime = 0;
	this.canShoot = false;

	this.collidable = true;

	this.animations = [];

	this.attacking = false;
	this.atackSpeed = 88;

	this.attackTime = 1.4;
	this.findTime = 2.0
	this.spawiningTIme = 0.5;

	this.updateState = args.updateState || "finding"; // ["attacking", "finding"]

	switch(this.updateState){
		case "finding": this.stateTime = this.findTime; break;
		case "spawning": this.stateTime = this.spawiningTIme; break;
		case "attacking": this.stateTime = this.attackingTime; break;	
	}
	

	this.dir = new Vector;

	// add to current level enemies
	Game.level.enemies.push(this);

	this._update = function(elapsedTime){
		var speed = this.moveSpeed * elapsedTime;

		if(!this.dying){

			this.stateTime -= elapsedTime;

			if(this.updateState == "attacking"){
				this.moveSpeed = 18;
				this.vel = this.vel.add(this.dir.scale(speed));

				if(this.stateTime <= 0){
					this.updateState = "finding";
					this.stateTime = this.findTime;
				}
			}
			else if(this.updateState == "finding"){
				this.moveSpeed = 1;
				this.vel = this.vel.add(Game.player.pos.sub(this.pos).normalize().scale(speed));
				this.dir = Game.player.pos.sub(this.pos).normalize();

				if(this.stateTime <= 0){
					for(var i = 0; i < 30; i++)
						Game.pushGameObject(GenerateParticle(this.center.x, this.center.y, 0, Game.assets['particle-red']));

					this.updateState = "attacking";
					this.stateTime = this.attackTime;
				}
			}
			else if(this.updateState == "spawning"){
				this.moveSpeed = 4;
				this.vel = this.vel.add(this.vel.normalize().scale(speed));

				if(this.stateTime <= 0){
					for(var i = 0; i < 10; i++)
						Game.pushGameObject(GenerateParticle(this.center.x, this.center.y, 0, Game.assets['particle-green']));

					this.updateState = "finding";
					this.stateTime = this.attackTime;
				}
			}
		}

		this.vel = this.vel.scale(this.drag);
		this.pos = this.pos.add(this.vel);

		if(this.health <= 0 && !this.dying)
			this.die();

	};

	this.toRect = function(){
		return (new Rect(this.pos.x + 5, this.pos.y + 5, this.size.w -10, this.size.h -10));
	}

	this._render = function(){
		this.context.drawImage(this.image, 0, 0, 40, 40, this.pos.x, this.pos.y, this.size.w, this.size.h);
	}

	this.onCollide = function(o){
		if(o instanceof Tile){
			if(o.tileState != "solid")
				return;

			var v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v);
		}

		if(o instanceof Bullet){
			AUDIO.playHit("hit-bear");
			this.addAnimation(new TurnRed(this, 0.3), false);

			var d = this.center.sub(o.center).normalize().scale(5.0);
			this.vel = this.vel.add(d);
			this.health -= 1;
		}

		if(o instanceof Player){
			var d = this.pos.sub(Game.player.pos).normalize().scale(5.0);
			this.vel = this.vel.add(d);
		}

	}

	this.animationDieUpdate = function(t){
		this.timeLeft -= t;
		if(this.timeLeft < 0)
			this.dead = true;

		var d = (40/1.5)*t

		this.size.w -= d;
		this.size.h -= d;

		this.pos.x += d/2;
		this.pos.y += d/2;

		for(var i in this.animations){
			this.animations[i].update(t);
		}
	}

	this.animationDieRender = function(){
		for(var i in this.animations){
			this.animations[i].render();
		}
	}

	this.die = function(){

		this.addAnimation(new Shrink(this, 0.5), true);
		// this._update = function(){};
		this.collidable = false;
		this.dying = true;


		// TODO: move into game
		var selfId = this.id;
		var idx = Game.level.enemies.find(function(id){ return (selfId == id.id);})
		Game.level.enemies.splice(idx, 1);
	}

}

Crow.prototype = new GameObject;
Crow.constructor = Crow;


/******************************
 *	Snake 
 ******************************/
function Snake(args){
	if(!args) args = {};

	GameObject.call(this, args);

	this.moveSpeed = 30; // pixels per second
	this.shootSpeed = 0; // per second
	this.bulletSpeed = 0; // pixels per second
	this.bulletDamage = 0;

	this.health = 2;
	this.armor = 0;
	this.trinkets = [];
	this.items = [];

	this.drag = 0.85;

	this.shootTime = 0;
	this.canShoot = false;

	this.collidable = true;

	this.animations = [];

	this.zagTime = 0.5;
	this.updateTime = this.zagTime;
	this.zagRand = ["rotate90", "rotate270"];
	this.zagFn = this.zagRand[Math.randomInt(0, 1)];


	this.image = Game.assets['enemy-snake'] || args.image;

	// add to current level enemies
	Game.level.enemies.push(this);

	this._update = function(elapsedTime){
		var speed = this.moveSpeed * elapsedTime;

		if(!this.dying){
			this.vel = this.vel.add(Game.player.pos.sub(this.pos).normalize().scale(speed));

			var dir = Game.player.center.sub(this.center).normalize();
			dir = dir[this.zagFn]().scale(0.5);
			this.vel = this.vel.add(dir);
		}

		this.updateTime -= elapsedTime;
		if(this.updateTime <= 0){
			this.zagFn = this.zagRand[Math.randomInt(0, 1)];	
			this.updateTime = this.zagTime;
		}

		this.vel = this.vel.scale(this.drag);
		this.pos = this.pos.add(this.vel);

		if(this.health <= 0 && !this.dying)
			this.die();

		if(this.pos.x < 0 || this.pos.x > 800 || this.pos.y < 0 || this.pos.y > 600){
			this.dead = true;
		}

	};

	this._render = function(){
		this.context.drawImage(this.image, 0, 0, 40, 40, this.pos.x, this.pos.y, this.size.w, this.size.h);
	}

	this.onCollide = function(o){
		if(o instanceof Tile){
			var v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v);
		}

		if(o instanceof Bullet){
			AUDIO.playHit("hit-bear");
			this.addAnimation(new TurnRed(this, 0.3), false);

			var d = this.pos.sub(Game.player.pos).normalize().scale(8.0);
			this.vel = this.vel.add(d);
			this.health -= 1;
		}
	}

	this.die = function(){

		this.addAnimation(new Shrink(this, 0.5), true);
		// this._update = function(){};
		this.collidable = false;
		this.dying = true;


		// TODO: move into game
		var selfId = this.id;
		var idx = Game.level.enemies.find(function(id){ return (selfId == id.id);})
		Game.level.enemies.splice(idx, 1);
	}

}

Snake.prototype = new GameObject;
Snake.constructor = Snake;

/******************************
 *	Walrus 
 ******************************/
function Walrus(args){
	if(!args) args = {};

	GameObject.call(this, args);

	this.moveSpeed = 10; // pixels per second
	this.shootSpeed = 0; // per second
	this.bulletSpeed = 0; // pixels per second
	this.bulletDamage = 0;

	this.health = 5;
	this.armor = 0;
	this.trinkets = [];
	this.items = [];

	this.drag = 0.85;

	this.shootTime = 0;
	this.canShoot = false;

	this.collidable = true;

	this.animations = [];

	// add to current level enemies
	Game.level.enemies.push(this);

	this._update = function(elapsedTime){
		var speed = this.moveSpeed * elapsedTime;

		if(!this.dying)
			this.vel = this.vel.add(Game.player.pos.sub(this.pos).normalize().scale(speed));

		this.vel = this.vel.scale(this.drag);
		this.pos = this.pos.add(this.vel);

		if(this.health <= 0 && !this.dying)
			this.die();

		if(this.pos.x < 0 || this.pos.x > 800 || this.pos.y < 0 || this.pos.y > 600){
			console.error("WALRUS POS: ", this.pos);
			this.dead = true;
		}

	};

	this._render = function(){
		this.context.drawImage(this.image, 0, 0, 40, 40, this.pos.x, this.pos.y, this.size.w, this.size.h);
	}

	this.onCollide = function(o){
		if(o instanceof Tile){
			if(o.tileState != "solid")
				return;

			var v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v);
		}

		if(o instanceof Bullet){
			AUDIO.playHit("hit-bear");
			this.addAnimation(new TurnRed(this, 0.3), false);

			var d = this.pos.sub(Game.player.pos).normalize().scale(8.0);
			this.vel = this.vel.add(d);
			this.health -= 1;
		}
	}

	this.die = function(){

		this.addAnimation(new Shrink(this, 0.5), true);
		// this._update = function(){};
		this.collidable = false;
		this.dying = true;


		// TODO: move into game
		var selfId = this.id;
		var idx = Game.level.enemies.find(function(id){ return (selfId == id.id);})
		Game.level.enemies.splice(idx, 1);
	}

}

Walrus.prototype = new GameObject;
Walrus.constructor = Walrus;


/******************************
 *	Bear BOSS
 ******************************/
function BearBoss(args){
	if(!args) args = {};

	GameObject.call(this, args);


	// look here
	this.size = new Vector(80, 80);

	this.moveSpeed = 15; // pixels per second
	this.shootSpeed = 0; // per second
	this.bulletSpeed = 0; // pixels per second
	this.bulletDamage = 0;

	this.health = 25;
	this.totalHealth = this.health;
	this.armor = 0;
	this.trinkets = [];
	this.items = [];

	this.drag = 0.85;

	this.shootTime = 0;
	this.canShoot = false;

	this.collidable = true;

	this.animations = [];

	this.crowChance = 0.01;


	// add to current level enemies
	Game.level.enemies.push(this);

	this._update = function(elapsedTime){
		var speed = this.moveSpeed * elapsedTime;

		if(!this.dying)
			this.vel = this.vel.add(Game.player.pos.sub(this.pos).normalize().scale(speed));

		this.vel = this.vel.scale(this.drag);
		this.pos = this.pos.add(this.vel);

		if(this.health <= 0 && !this.dying)
			this.die();

		if(this.pos.x < 0 || this.pos.x > 800 || this.pos.y < 0 || this.pos.y > 600){
			console.error("BEAR POS: ", this.pos);
			this.dead = true;
		}

		if(Math.random() < this.crowChance){
			var c = new Crow({
				x: this.center.x,
				y: this.center.y,
				ax: Math.random() * 10,
				ay: Math.random() * 10,
				updateState: "spawning"
			});
			Game.pushGameObject(c);
		}

	};

	this._render = function(){
		this.context.drawImage(this.image, 0, 0, 80, 80, this.pos.x, this.pos.y, this.size.w, this.size.h);
		this.context.save();
		this.context.fillStyle = "rgb(200, 50, 50)";
		var w = (this.size.w*(this.health/this.totalHealth));
		var tw = this.size.w - w;
		this.context.fillRect(this.pos.x+(tw/2), this.pos.y-15, w, 5);
		this.context.restore();
	}

	this.onCollide = function(o){
		if(o instanceof Tile){
			if(o.tileState != "solid")
				return;
			
			var v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v);
		}

		if(o instanceof Bullet){
			AUDIO.playHit("hit-bear");
			this.addAnimation(new TurnRed(this, 0.3), false);

			var d = this.pos.sub(Game.player.pos).normalize().scale(3.0);
			this.vel = this.vel.add(d);
			this.health -= 1;
		}
	}

	this.die = function(){

		this.addAnimation(new Shrink(this, 0.5), true);
		// this._update = function(){};
		this.collidable = false;
		this.dying = true;


		// Spawns heart
		var item = new ItemHeart({
			x: this.pos.x, y: this.pos.y,
			w: 40,  h: 40,
			image: Game.assets['ItemHeart']
		});

		Game.gameObjects.push(item);				
		

		if(Math.random() < this.crowChance){
			var c = new Crow({
				x: this.center.x,
				y: this.center.y,
				ax: Math.random() * 10,
				ay: Math.random() * 10,
				updateState: "spawning"
			});
			Game.pushGameObject(c);
		}



		// TODO: move into game
		var selfId = this.id;
		var idx = Game.level.enemies.find(function(id){ return (selfId == id.id);})
		Game.level.enemies.splice(idx, 1);
	}

}

BearBoss.prototype = new GameObject;
BearBoss.constructor = BearBoss;




/******************************
 *	Boss SNAKEPIT
 ******************************/
function SnakePitBoss(args){
	if(!args) args = {};

	GameObject.call(this, args);


	// look here
	this.size = new Vector(40, 40);

	this.moveSpeed = 0; // pixels per second
	this.shootSpeed = 0; // per second
	this.bulletSpeed = 0; // pixels per second
	this.bulletDamage = 0;

	this.health = 25;
	this.totalHealth = this.health;
	this.armor = 0;
	this.trinkets = [];
	this.items = [];

	this.drag = 0;

	this.shootTime = 0;
	this.canShoot = false;

	this.collidable = true;

	this.animations = [];

	this.snakeChance = 0.05;


	// add to current level enemies
	Game.level.enemies.push(this);

	this._update = function(elapsedTime){
		var speed = this.moveSpeed * elapsedTime;

		if(!this.dying)
			this.vel = this.vel.add(Game.player.pos.sub(this.pos).normalize().scale(speed));

		this.vel = this.vel.scale(this.drag);
		this.pos = this.pos.add(this.vel);

		if(this.health <= 0 && !this.dying)
			this.die();

		if(this.pos.x < 0 || this.pos.x > 800 || this.pos.y < 0 || this.pos.y > 600){
			console.error("BEAR POS: ", this.pos);
			this.dead = true;
		}

		if(Math.random() < this.snakeChance){
			var s = new Snake({
				x: this.center.x,
				y: this.center.y,
				ax: Math.random() * 10,
				ay: Math.random() * 10,
				updateState: "spawning"
			});
			Game.pushGameObject(s);
		}

	};

	this._render = function(){
		this.context.drawImage(this.image, 0, 0, 40, 40, this.pos.x, this.pos.y, this.size.w, this.size.h);

		this.context.save();
		this.context.fillStyle = "rgb(200, 50, 50)";
		var w = (this.size.w*(this.health/this.totalHealth));
		var tw = this.size.w - w;
		this.context.fillRect(this.pos.x+(tw/2), this.pos.y-15, w, 5);
		this.context.restore();
	}

	this.onCollide = function(o){
		if(o instanceof Tile){
			if(o.tileState != "solid")
				return;
			
			var v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v);
		}

		if(o instanceof Bullet){
			AUDIO.playHit("hit-bear");
			this.addAnimation(new TurnRed(this, 0.3), false);

			var d = this.pos.sub(Game.player.pos).normalize().scale(3.0);
			this.vel = this.vel.add(d);
			this.health -= 1;
		}
	}

	this.die = function(){

		this.addAnimation(new Shrink(this, 0.5), true);
		// this._update = function(){};
		this.collidable = false;
		this.dying = true;


		// Spawns heart
		var item = new ItemHeart({
			x: this.pos.x, y: this.pos.y,
			w: 40,  h: 40,
			image: Game.assets['ItemHeart']
		});
		
		Game.gameObjects.push(item);				
		

		// TODO: move into game
		var selfId = this.id;
		var idx = Game.level.enemies.find(function(id){ return (selfId == id.id);})
		Game.level.enemies.splice(idx, 1);
	}

}

SnakePitBoss.prototype = new GameObject;
SnakePitBoss.constructor = SnakePitBoss;


/******************************
 *	Dragon  SUPER BOSS
 ******************************/
function DragonBoss(args){
	if(!args) args = {};

	GameObject.call(this, args);


	// look here
	this.size = new Vector(160, 160);

	this.moveSpeed = 15; // pixels per second
	this.shootSpeed = 0; // per second
	this.bulletSpeed = 0; // pixels per second
	this.bulletDamage = 0;

	this.health = 100;
	this.totalHealth = this.health;
	this.armor = 0;
	this.trinkets = [];
	this.items = [];

	this.drag = 0.85;

	this.shootTime = 1;
	this.canShoot = true;

	this.collidable = true;

	this.animations = [];

	// add to current level enemies
	Game.level.enemies.push(this);

	this._update = function(elapsedTime){
		var speed = this.moveSpeed * elapsedTime;

		if(!this.dying)
			this.vel = this.vel.add(Game.player.pos.sub(this.pos).normalize().scale(speed));

		this.vel = this.vel.scale(this.drag);
		this.pos = this.pos.add(this.vel);

		if(this.health <= 0 && !this.dying)
			this.die();

		if(this.pos.x < 0 || this.pos.x > 800 || this.pos.y < 0 || this.pos.y > 600){
			console.error("DRAGON POS: ", this.pos);
			this.dead = true;
		}
	};

	this._render = function(){
		this.context.drawImage(this.image, 0, 0, 160, 160, this.pos.x, this.pos.y, this.size.w, this.size.h);

		this.context.save();
		this.context.fillStyle = "rgb(200, 50, 50)";
		var w = (this.size.w*(this.health/this.totalHealth));
		var tw = this.size.w - w;
		this.context.fillRect(this.pos.x+(tw/2), this.pos.y-15, w, 5);
		this.context.restore();
	}

	this.onCollide = function(o){
		if(o instanceof Tile){
			if(o.tileState != "solid")
				return;
			
			var v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v);
		}

		if(o instanceof Bullet){
			AUDIO.playHit("hit-bear");
			this.addAnimation(new TurnRed(this, 0.3), false);

			var d = this.pos.sub(Game.player.pos).normalize().scale(3.0);
			this.vel = this.vel.add(d);
			this.health -= 1;
		}
	}

	this.die = function(){

		this.addAnimation(new Shrink(this, 0.5), true);
		// this._update = function(){};
		this.collidable = false;
		this.dying = true;


		// TODO: move into game
		var selfId = this.id;
		var idx = Game.level.enemies.find(function(id){ return (selfId == id.id);})
		Game.level.enemies.splice(idx, 1);
	}

}

DragonBoss.prototype = new GameObject;
DragonBoss.constructor = DragonBoss;