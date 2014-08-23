function ParticleEmitter(){

}

function Particle(args){
	this.lifeTime = args.lifeTime || Math.randomInt(80, 120);

	this.dir = args.dir;
	// this.speed = Math.randomInt(args.speed || 10;

	this.vel = new Vector(
		(args.vx || 0), 
		(argx.vy || 0)
	);

	this.size = new Vector(
		(args.w || 20),
		(args.h || 20)
	);

	this.updateFn = function(){};

	this.update = function(t){
		updateFn.bind(this)(t);
	}

	this.render = function(){
		
	}
}