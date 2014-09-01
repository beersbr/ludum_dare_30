

var GAME = (function(){
	var game = {};

	var currentTime = +(new Date);
	var lastTime = +(new Date);


	game.player = undefined;
	game.scene = new SceneManager;


	function Initialize(){
		game.scene.canvas = $("canvas#game")[0];
		game.scene.context = game.scene.canvas.getContext('2d');		

		game.player = new GameObject({
			pos: new Vector(300, 300),
			size: new Vector(40, 40)
		});

		game.player.setComponent(new ComponentSimpleRectDrawable);
		game.scene.addGameObject(game.player);
	}

	function GameLoop(){
		lastTime = currentTime;
		currentTime = +(new Date);

		var timeStep = currentTime - lastTime;

		game.scene.render();

		requestAnimFrame(GameLoop);
	}

	game.run = GameLoop;
	game.init = Initialize;

	return game;
}());