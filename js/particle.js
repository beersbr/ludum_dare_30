function ParticleEmitter(){

}

function Particle(args){
	this.lifeTime = args.lifeTime || Math.randomInt(80, 120);
	this.vel = new Vector(
		(args.vx || 0), 
		(argx.vy || 0)
	);

	this.updateFn = function(){};

	this.update = function(t){
		updateFn.bind(this)(t);
	}

	this.render = function(){
		
	}
}