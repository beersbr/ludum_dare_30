
GetId.ids = 1;
function GetId(){
	return GetId.ids++;
}

function GameObject(args){
	this.class 		= "gameobject";
	this.pos 		= args.pos 		|| new Vector;
	this.size 		= args.size 	|| new Vector;

	this.vel 		= args.vel 		|| new Vector;

	this.id 		= GetId();
	this.type 		= args.type		|| console.log

	var components = {};


	this.update = function(timestep){

	}

	this.getComponent = function(familyId){
		return (components[familyId]);
	}

	this.setComponent = function(newComponent){
		newComponent.owner = this;
		components[newComponent.familyId] = newComponent;
	}

	
	this.clearComponents = function(){
		components = {};
	}
}

/***************************************
 *  Base Component
 ***************************************/
function Component(args){
	this.type 		= args.type 		|| console.warn("No Name");
	this.owner 		= args.owner 		|| console.warn("No Owner");
	this.familyId	= args.family 		|| console.warn("No Family");

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

function ComponentSimpleRectDrawable(args){
	if(!args) args = {};
	args.type = "SimpleRectDrawable";

	ComponentDrawable.call(this, args);

	this.render = function(context){
		context.save();
		context.fillStyle = "rgb(255, 0, 255)";
		context.fillRect(this.owner.pos.x, this.owner.pos.y, this.owner.size.w, this.owner.size.h);
		context.restore();
	}
}

function ComponentImageDrawable(args){
	if(!args) args = {};
	args.type = "ImageDrawable";

	ComponentDrawable.call(this, args);

	this.image = args.image || console.warn("No Image set for");
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
 *  Controllable Base Component
 ***************************************/
function ComponentControllable(args){
	if(!args) args = {};

	args.type = "Controllable";
	args.family = "Controllable";

	Component.call(this, args);

	this.update = function(){};
}


function ComponentKeyboardControllable(args){
	if(!args) args = {};

	args.type = "KeyboardControllable";

	ComponentControllable.call(this, args);

	var keyboard = KEYBOARD;
	this.acceleration = args.acceleration || new Vector(50, 50);

	this.update = function(timestep){
		var scaledTimestep = timestep/1000;
		var scaledAcceleration = this.acceleration.scale(scaledTimestep);

		if(keyboard.isKeyDown('a')){
			this.owner.vel.x -= scaledAcceleration.x;
		}
		if(keyboard.isKeyDown('d')){
			this.owner.vel.x += scaledAcceleration.x;	
		}
		if(keyboard.isKeyDown('w')){
			this.owner.vel.y -= scaledAcceleration.y;	
		}
		if(keyboard.isKeyDown('s')){
			this.owner.vel.y += scaledAcceleration.y;	
		}

		var drag = 0.85;
		this.owner.vel = this.owner.vel.scale(drag);
		this.owner.pos = this.owner.pos.add(this.owner.vel);
	}
}

/***************************************
 *  Tile Base Component
 ***************************************/
 

/***************************************
 *  Scene Manger
 ***************************************/

function SceneManager(args){
	if(!args) args = {};

	this.canvas 	= args.canvas 	|| undefined;
	this.context 	= args.context 	|| undefined;

	// nine sections on the screen
	this.numSections = 9;
	this.sectionRows = 3;
	this.sectionCols = 3;

	this.sceneWidth = 800;
	this.sceneHeight = 600;

	this.sections = [];

	this.sectionWidth = this.sceneWidth/this.sectionCols;
	this.sectionHeight = this.sceneHeight/this.sectionRows;

	this.sceneGetSection = function(go){
		var pos = go.pos;
		var cellX = this.sectionWidth % pos.x;
		var cellY = this.sectionHeight % pos.y;

		var sceneSection = cellX+(cellY*cellX);
		this.sections[sceneSection] = this.sections[sceneSection] || [];
		this.sections[sceneSection].push(go);
	};

	this.scene = undefined;

	this.gameObjects = [];


	this.update = function(timestep){
		for(var i = 0; i < this.gameObjects.length; i++){
			var c = this.gameObjects[i].getComponent("Controllable");

			if(c) c.update(timestep);
		}
	}

	this.render = function(){
		var gl = this.context;
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		// this.context.save();
		// this.context.fillStyle = "rgb(0, 0, 0)";
		// this.context.fillRect(0, 0, 800, 600);
		// this.context.restore();

		for(var i = 0; i < this.gameObjects.length; i++){
			var c = this.gameObjects[i].getComponent("Drawable");

			if(c) c.render(this.context);
		}
	}

	this.addGameObject = function(go){
		this.gameObjects.push(go);
	}

	this.removeGameObject = function(id){
		this.gameObject.findIndex(function(idx){ return idx.id == id; });
	}
}


function Scene(){

	this.run = function(){

	};

	this.update = function(){
			
	};

	this.draw = function(){

	}
}