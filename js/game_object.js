
GetId.ids = 1;
function GetId(){
	return GetId.ids++;
}

function GameObject(args){
	this.class 		= "gameobject";
	this.pos 		= args.pos 		|| new Vector;
	this.size 		= args.size 	|| new Vector;

	this.id 		= GetId();
	this.type 		= args.type		|| console.log

	/**
	 * getRenderRect
	 *
	 * This method is used for the size of rendering. Should you need a smaller render area.
	*/
	this.getRenderRect = function(){
		return (new Rect(this.pos.x, this.pos.y, this.size.w, this.size.h));
	};

	/**
	 * getRect
	 * 
	 * This method is used for collision. It can be
	 * overridden for bigger/smaller collision AABB's.
	 */
	this.getCollisionRects = function(){
		return [(new Rect(this.pos.x, this.pos.y, this.size.w, this.size.h))];
	};


	this.getComponent = function(familyId){
		return (components[familyId]);
	}

	this.setComponent = function(newComponent){
		componenets[newComponent.familyId] = newComponent;
	}

	var components = {};
	this.clearComponents = function(){
		components = {};
	}


}

/***************************************
 *  Base Component
 ***************************************/
function Component(args){
	this.type 		= args.type 		|| console.error("No Name");
	this.owner 		= args.owner 		|| console.error("No Owner");
	this.familyId	= args.family 		|| console.error("No Family");
	this.CoponentId = args.component 	|| console.error("No Component");

	this.update = function(timestep){};
}

/***************************************
 *  Render Base Component
 ***************************************/
function ComponentDrawable(args){
	if(!args) args = {};

	args.type = "Drawable";
	args.family = "Drawable";

	Component.call(this, args);

	this.size = new Vector;
	this.render = function(context){};
}

/***************************************
 *  Collider Base Component
 ***************************************/
function ComponentCollidable(args){
	if(!args) args = {};

	args.type = "Collidable";
	args.family = "Collidable";

	Component.call(this, args);

	// the array of collisiion rectangles
	this.rects = [];

	this.onCollide = function(context){};
}


/***************************************
 *  Scene Manger
 ***************************************/

function SceneManager(args){
	if(!args) args = {};

	this.canvas 	= args.canvas 	|| undefined;
	this.context 	= args.context 	|| undefined;

	// nine sections on the screen

	this.sections = [];
	this.objects = [];
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
