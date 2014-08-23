function ParticleEmitter(x, y, dirRangeL, dirRangeH, speedL, speedH, lifeH, lifeL, emitRate, rotateRateL, rotateRateH, scaleL, scaleH, image, updateFn){
	this.pos = new Vector(x, y);

	this.dirL = dirRangeL || 0;
	this.dirH = dirRangeH || 360;

	this.speedL = speedL || 1;
	this.speedH = speedH || 100;

	this.lifeH = lifeH;
	this.lifeL = lifeL;

	this.emitRate = emitRate || 10; // per second

	this.rotateRateL = rotateRateL || 0; // per second
	this.rotateRateH = rotateRateH || 1;

	this.scaleL = scaleL || 0.5;
	this.scaleH = scaleH || 1.5;

	this.image = image;

	this.particles = [];
	this.emitTime = 0.0;

	var canEmit = false;

	this.start = function(){
		canEmit = true;
	}

	this.stop = function(){
		canEmit = false;
	}

	this.update = function(t){

		for(var i in this.particles){
			this.particles[i].update(t);
		}

		if(!canEmit)
			return;

		this.emitTime += t;
		// find out how many times the rate has been passed.. might need to emit more than one
		if(this.emitTime >= (1000/this.emitRate/1000)){
			this.emit();
			this.emitTime = 0.0;
		}
		
	};

	this.emit = function(){
		var dir = Math.randomInt(this.dirL, this.dirH);
		this.particles.push(new Particle({
			x: this.pos.x,
			y: this.pos.y,
			vx: Math.cos(dir.toRadians()),
			vy: Math.sin(dir.toRadians()),
			lifeTime: Math.randomInt(this.lifeL, this.lifeH),
			rotateRate: Math.randomInt(this.rotateRateL, this.rotateRateH),
			speed: Math.randomInt(this.speedL, this.speedH),
			scale: Math.randomInt(this.scaleL, this.scaleH),
			image: this.image,
		}));
	}

	this.render = function(){
		for(var i in this.particles) {
			this.particles[i].render();
		}

		for(var i in this.particles) {
			if(this.particles[i].dead)
				this.particles.splice(i, 1);
		}
	};
}

function Particle(args){
	this.lifeTime = args.lifeTime;
	this.rotateRate = args.rotateRate;
	this.speed = args.speed; // pixels per second
	this.scale = args.scale;
	this.image = args.image;

	this.pos = new Vector(args.x, args.y);

	this.vel = new Vector(
		(args.vx || 0),
		(args.vy || 0)
	);

	this.vel = this.vel.normalize().scale(this.speed);

	this.size = new Vector(
		(args.w || 20),
		(args.h || 20)
	);

	this.rotation = 0;

	this.lived = 0.0;
	this.dead = false;
	this.die = function(){
		this.dead = true;
	}

	if(!args.image)
		throw "NO IMAGE FOR PARTICLE.";

	this.updateFn = function(){};

	this.update = function(t){
		this.lived += t;
		this.rotation += (this.rotateRate*t);
		this.pos = this.pos.add(this.vel.scale(t));

		if(this.lived >= this.lifeTime)
			this.die();

		// updateFn.bind(this)(t);
	}

	this.render = function(){
		this.context.save();
		this.context.translate(this.pos.x + this.size.w/2, this.pos.y + this.size.h/2);
		this.context.rotate(this.rotation);

		// TODO: add scaling in here.
		this.context.drawImage(this.image, -this.size.w/2, -this.size.h/2, this.size.w, this.size.h);
		this.context.restore();
	}
}

Particle.prototype._canvas = undefined;
Particle.prototype._context = undefined;



//var s = SimpleEmitter(400, 400, Game.assets["particle-plus"]); Game.pushGameObject(s);

// Game.pushGameObject(new Particle({ lifeTime: 3.0, rotateRate: 2, speed: 200, scale: 1.0, x: 300, y: 300, vx: 1.0, image: Game.assets["particle-plus"]}));

// var s = SimpleEmitter(400, 400, Game.assets["particle-plus"]); Game.pushGameObject(s); s.start();


function SimpleEmitter(x, y, image){
	// x, y, dirRangeL, dirRangeH, speedL, speedH, lifeH, lifeL, emitRate, rotateRateL, rotateRateH, scaleL, scaleH, image, updateFn){
	var emitter = new ParticleEmitter(
		x, y,
		0, 360,
		100, 200,
		0.8, 1.2,
		60,
		0.1, 3,
		0.5, 1.5,
		image,
		function(){}
		);

	return emitter;
}




