var AUDIO = (function(){
	var audio = {};
	
	audio.voices = 16;

	audio.index = 0;
	audio.tags = [];
	for(var i = 0; i < audio.voices; i++){
		var a = new Audio();
		a.preload = true;
		audio.tags.push(a);
	}
		

	audio.play = function(audioSrc){

	}


	return audio;
}());