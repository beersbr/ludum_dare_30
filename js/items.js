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

Item.prototype = new GameObject;
Item.constructor = Item;