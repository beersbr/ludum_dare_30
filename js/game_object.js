
IDS = 0;
function GameObject(args) {
	if(!args) args = {};

	this.id = IDS += 1;

	this.dead = false;

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
		(args.w || 0), 
		(args.h || 0)
	)

	this.getRect = function(){
		return new Rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
	}

	this.die = function(){
		this.dead = true;
	}

	this.update = function(){};
	this.render = function(){};
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
		if(v === true){
			this._collidable = true;
			GameObject.collisionList.push(this);
		}else{
			var idx = GameObject.collisionList.find(this);
			if(dx >= 0)
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
