function GameObject(args) {
	if(!args) args = {};

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

	this.update = function(){};
	this.render = function(){};
}

GameObject.prototype._canvas = undefined;
GameObject.prototype._context = undefined;