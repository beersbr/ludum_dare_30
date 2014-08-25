function AssetHandler(){

	this.loaded = 0;
	this.shouldLoad = 0;

	this.hash = {};

	var _finished = function(){};
	var promise = new Promise();

	this.prepare = function(key, itemPath, type) {

		switch(type) {
			case "image": {
				var img = new Image;
				img.onload = (function(){
					this.loaded += 1;

					if(this.loaded == this.shouldLoad)
						promise.resolve(this.hash);

				}).bind(this);

				img.src = itemPath;
				this.hash[key] = img;

				break;
			}

			case "audio": {
				var audio = new Audio;
				// audio.preload = "auto";
				$(audio).attr("preload", "auto");

				audio.onloadeddata = (function(){
					this.loaded += 1;

					if(this.loaded == this.shouldLoad)
						promise.resolve(this.hash);

				}).bind(this);

				audio.src = itemPath;
				$(audio).data("data-path", itemPath);
				this.hash[key] = audio;
				break;
			}

			default:{
				console.error("Could not load asset type of:", type);
			}
		}


		this.shouldLoad += 1;
	}

	this.load = function(){
		return promise;
	}
}