
function GameObject(args){
	this.class 		= "gameobject";
	this.image 		= args.image 	|| new Image;
	this.pos 		= args.pos 		|| new Vector;
	this.size 		= args.size 	|| new Vector;

	/**
	 * getRect
	 * 
	 * This method is used for collision. It can be
	 * overridden for bigger/smaller collision AABB's.
	 */
	this.getRect = function(){
		return (new Rect(this.pos.x, this.pos.y, this.size.w, this.size.h));
	};
}

function GameEntity(args){
	GameObject.call(this, args);

	this.class 		= "gameentity";
	this.vel 		= args.vel 		|| new Vector;
	this.drag 		= args.drag 	|| 0.85;
}





IDS = 0;
function GameObject(args) {
	if(!args) args = {};

	this.id = IDS += 1;
	this.image = args.image || null;
	this.dead = false;
	this.dying = false;

	this.animations = [];

	this.addAnimation = function(anim, last){
		this.animations.push(anim);

		anim.done(function(id){
			var i = this.animations.find(function(e){ return e.id == id });

			if(last){
				this.dead = true;
			}

			this.animations.splice(i, 1);
		});
	}

	this.safePos = function(){
		if(this.vel.x > 0)
			this.vel.x = Math.min(this.vel.x, 19.0)
		if(this.vel.y > 0)
			this.vel.y = Math.min(this.vel.y, 19.0)

		if(this.vel.x < 0)
			this.vel.x = Math.max(this.vel.x, -19.0)
		if(this.vel.y < 0)
			this.vel.y = Math.max(this.vel.y, -19.0)
	}

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
		(args.w || 40), 
		(args.h || 40)
	)

	this.getRect = function(){
		return new Rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
	}

	this.die = function(){
		this.dead = true;
	}

	this._update = function(t){}
	this._render = function(){}

	this.update = function(t){
		this.safePos();
		this._update(t);  

		for(var i in this.animations){
			this.animations[i].update(t);
		}
	};

	this.render = function(){
		this.context.save();
		this._render();

		for(var i in this.animations){
			this.animations[i].render();
		}
		this.context.restore();
	};
	this.onCollide = function(go){};
}

GameObject.prototype._collidable = false;
GameObject.prototype._renderable = false;

GameObject.collisionList = [];
GameObject.renderList = [];


GameObject.prototype._canvas = undefined;
GameObject.prototype._context = undefined;

Object.defineProperty(GameObject.prototype, "center", {
	get: function(){
		return (new Vector(this.pos.x + (this.size.w/2), this.pos.y + (this.size.h/2)));
	},
	readonly: true
});

Object.defineProperty(GameObject.prototype, "collidable", {
	get: function(){
		return _collidable;
	},
	set: function(v){
		// console.log("SETTING COLLIDABLE: ", this, v);

		if(v === true){
			this._collidable = true;
			GameObject.collisionList.push(this);
		}else{
			var idx = GameObject.collisionList.find(function(o){ return o.id == this.id }.bind(this));
			if(idx >= 0)
				GameObject.collisionList.splice(idx, 1);
			
			this._collidable = false;
		}
	}
});

Object.defineProperty(GameObject.prototype, "renderable", {
	get: function()	{
		return _renderable;
	},
	set: function(v){
		if(v === true){
			this._renderable = true;

		}else{
			this._renderable = false;
		}
	}
});
