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

	// add to current level enemies
	Game.level.enemies.push(this);

	this._update = function(elapsedTime){
		var speed = this.moveSpeed * elapsedTime;

		if(!this.dying)
			this.vel = this.vel.add(Game.player.pos.sub(this.pos).normalize().scale(0.4));

		this.vel = this.vel.scale(this.drag);
		this.pos = this.pos.add(this.vel);

		if(this.health <= 0 && !this.dying)
			this.die();

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
			this.addAnimation(new TurnRed(this, 3.3), false);

			var d = this.pos.sub(Game.player.pos).normalize().scale(13.0);
			this.vel = this.vel.add(d);
			this.health -= 1;
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

Bear.prototype = new GameObject;
Bear.constructor = Bear;