
/******************************
 *	Bullet
 ******************************/
function Bullet(args){
	if(!args) args = {};

	GameObject.call(this, args);

	// this.pos = new Vector(args.x, args.y);
	this.size = new Vector(20, 20);
	this.pos = new Vector(this.pos.x - this.size.w/2, this.pos.y - this.size.h/2);
	// this.vel = new Vector(this.)

	this.image = Game.assets["particle-ball"];
	this.damage = args.damage || 0;
	this.speed = args.speed || 120;
	this.liveTime = 6.0;
	this.startLife = Time.timestamp;
	this.timeLived = 0.0;

	this.update = function(t){
		var power = this.speed*t;
		var vel = new Vector(this.vel.x * power, this.vel.y * power);
		this.pos = this.pos.add(vel);

		if((Time.timestamp - this.startLife)/1000 > this.liveTime)
			this.die();
	}

	this.render = function(){
		this.context.save();
		this.context.drawImage(this.image, 
			0, 0, this.size.w, this.size.h,
			this.pos.x, this.pos.y, this.size.w, this.size.h);
		this.context.restore();
	}

	this.toRect = function(){
		return (new Rect(this.pos.x + 5, this.pos.y + 5, this.size.w - 10, this.size.h -10));
	}

	this.onCollide = function(go){
		if(go instanceof Bullet)
			return;

		if(go instanceof Player)
			return;

		if(go instanceof Item)
			return;

		if(go instanceof Tile){
			if(go.tileState != "solid")
				return;
		}

		this.collidable = false;

		for(var i = 0; i < 3; i++){
			var c = this.center;
			Game.pushGameObject(GenerateParticle(
				c.x, c.y, 0, Game.assets['particle-blue']
			));
		}
		

		this.die();


	}

	this.collidable = true;
}

Bullet.prototype = new GameObject;
Bullet.constructor = Bullet;