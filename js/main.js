

var GAME = (function(){
	var game = {};

	var currentTime = +(new Date);
	var lastTime = +(new Date);


	game.player = undefined;
	game.scene = new SceneManager;

	game.gl = undefined;
	game.meshes = [];

	function Initialize(){
		game.scene.canvas = $("canvas#game")[0];
		game.scene.context = game.scene.canvas.getContext('webgl');
		game.gl = game.scene.context;

		initViewport(game.gl, 800, 600);
		initPerspective(game.gl, 800, 600);

		var vs = getShader("simple.vs");
		var fs = getShader("simple.fs");
		
		var verts = [];
		for(var j = 3; j >= -3; j--){
			for(var i = -3; i <= 3; i++){
				var r = (parseFloat(Math.randomInt(0, 4)-2))/8;
				verts.push(i, j, r);
			}
		}

		// normals
		for(var i = 0; i < verts.length; ++i){
			

			var v1 = vec3.create(verts[i[0]], verts[i[1]], verts[i[2]]);
			var v2 = vec3.create(verts[i[3]], verts[i[3]], verts[i[3]]);
			var v3 = vec3.create();
			vec3.dot(v3, v1, v2);

		}

		// element array 

		var w = 7;
		var h = 7;
		var elems = [];

		for(var i = 0; i < (verts.length/3)-w; i++){
			var r = Math.floor(i/7); 
			elems.push(i, i+w);
			if(i == ((r*w) + w - 1))
				elems.push(i+w, ((i+1 > 48)? 48 : i+1));
		}

		var colors = [];
		var cr = 0.4;
		var cg = 0.4;
		var cb = 0.4;
		for(var i = 0; i < verts.length/3; i++){
			colors.push(cr, cg, cb);
			colors.push(cr, cg, cb);
			colors.push(cr, cg, cb);

			// cr = Math.random();
			// cg = Math.random();
			// cb = Math.random();
		}

		var shader = new ShaderProgram(game.gl, vs, fs);
		var m = new Mesh({
			gl: game.gl,
			shader: shader,
			vertices: verts,
			elements: elems,
			colors: colors
		});

		game.meshes.push(m);

		// game.player = new GameObject({
		// 	pos: new Vector(300, 300),
		// 	size: new Vector(40, 40),
		// });

		// game.player.setComponent(new ComponentSimpleRectDrawable);
		// game.player.setComponent(new ComponentKeyboardControllable);
		// game.scene.addGameObject(game.player);
	}

	function GameLoop(){
		lastTime = currentTime;
		currentTime = +(new Date);

		var timeStep = currentTime - lastTime;

		game.scene.update(timeStep);
		game.scene.render();

		for(var m in game.meshes){
			var mm = game.meshes[m];
			mm.render(game.gl, {projectionMatrix: game.gl.perspective});
		}

		requestAnimFrame(GameLoop);
	}

	game.run = GameLoop;
	game.init = Initialize;

	return game;
}());