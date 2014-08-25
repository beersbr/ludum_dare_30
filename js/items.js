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

	this.drag = 0.98;

	this._update = function(t){
		this.scale += t*2.5;
		this.sizeFactor = Math.cos(this.scale) * this.sizeMod;

		this.rotate += 2*t;

		this.vel = this.vel.scale(this.drag);
		this.pos = this.pos.add(this.vel);
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

	this.toRect = function(){
		return (new Rect(this.pos.x + 8, this.pos.y+8, this.size.w-16, this.size.h-16));
	}

	this.onCollide = function(o){

		if(o instanceof Tile){
			var v = uncollide(this.getRect(), o.getRect());
			this.vel = this.vel.add(v.scale(2.0));
		}

		if(!(o instanceof Player))
			return;
	}

}
ItemHeart.prototype = new GameObject;
ItemHeart.constructor = ItemHeart;


/******************************
 *	Heart Item
 ******************************/
function ItemHeart(args){
	GameObject.call(this, args);
	Item.call(this, args);

	this.image = Game.assets['item-heart'];
	this.size = new Vector(25, 25);

	this.__update = this._update;
	this._update = function(t){
		this.__update(t);

		
	}

	this.__onCollide = this.onCollide;
	this.onCollide = function(o){
		this.__onCollide(o);

		if(o instanceof Bullet){
			var dir = this.center.sub(o.center).normalize();
			this.vel = this.vel.add(dir.scale(10));
		}

		if(!(o instanceof Player))
			return;

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
	}
}


/******************************
 *	Armor Item
 ******************************/
function ItemArmor(args){
	GameObject.call(this, args);
	Item.call(this, args);

	this.image = Game.assets['item-heart'];
	this.size = new Vector(25, 25);

	this.onCollide = function(o){
		if(!(o instanceof Player))
			return;

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
	}
}


/******************************
 *	MoveSpeed Item
 ******************************/
function ItemMoveSpeed(args){
	GameObject.call(this, args);
	Item.call(this, args);

	this.image = Game.assets['item-heart'];
	this.size = new Vector(25, 25);

	this.onCollide = function(o){
		if(!(o instanceof Player))
			return;

		for(var i = 0; i < Math.randomInt(10, 20); i++){
			var p = GenerateParticle(this.pos.x, this.pos.y, 0, Game.assets['particle-purple']);
			Game.pushGameObject(p)
		}

		this.die();
	}


	this.die = function(){
		this.addAnimation(new Shrink(this, 0.5), true);
		this.collidable = false;
		this.dying = true;
	}
}


/******************************
 *	Shoot Speed Item
 ******************************/
function ItemShootSpeed(args){
	GameObject.call(this, args);
	Item.call(this, args);

	this.image = Game.assets['item-heart'];
	this.size = new Vector(25, 25);

	this.onCollide = function(o){
		if(!(o instanceof Player))
			return;

		for(var i = 0; i < Math.randomInt(10, 20); i++){
			var p = GenerateParticle(this.pos.x, this.pos.y, 0, Game.assets['particle-purple']);
			Game.pushGameObject(p)
		}

		this.die();
	}


	this.die = function(){
		this.addAnimation(new Shrink(this, 0.5), true);
		this.collidable = false;
		this.dying = true;
	}
}


/******************************
 *	Shoot Damage Item
 ******************************/
function ItemShootDamage(args){
	GameObject.call(this, args);
	Item.call(this, args);

	this.image = Game.assets['item-attack-power'];
	this.size = new Vector(25, 25);

	this.onCollide = function(o){
		if(!(o instanceof Player))
			return;

		for(var i = 0; i < Math.randomInt(10, 20); i++){
			var p = GenerateParticle(this.pos.x, this.pos.y, 0, Game.assets['particle-purple']);
			Game.pushGameObject(p)
		}

		this.die();
	}


	this.die = function(){
		this.addAnimation(new Shrink(this, 0.5), true);
		this.collidable = false;
		this.dying = true;
	}
}

// var ItemHeart = ItemShootDamage;

Item.prototype = new GameObject;
Item.constructor = Item;