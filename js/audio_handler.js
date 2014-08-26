var AUDIO = (function(){
	var audio = {};
	
	audio.sounds = {};

	audio.voices = 16;
	audio.voiceTags = [];
	audio.voiceIndex = 0;

	audio.songs = {};

	audio.song = null;

	audio.setHit = function(key, src){
		audio.sounds[key] = src;
	}

	audio.setSong = function(key, src){
		audio.songs[key] = src;
	}

	audio.playHit = function(key){
		audio.voiceTags[audio.voiceIndex] = new Audio(audio.sounds[key].src);
		audio.voiceTags[audio.voiceIndex].volume = 0.05;
		audio.voiceTags[audio.voiceIndex].play();
		audio.voiceIndex = (audio.voiceIndex+1)%audio.voices;
	}

	audio.playSong = function(key){
		audio.song = audio.songs[key]
		audio.song.volume = 0.08;
		audio.song.loop = true;
		audio.song.play();
	}


	return audio;
}());