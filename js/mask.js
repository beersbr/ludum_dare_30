requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
     window.webkitRequestAnimationFrame ||
     window.mozRequestAnimationFrame ||
     window.oRequestAnimationFrame ||
     window.msRequestAnimationFrame ||
     function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
       window.setTimeout(callback, 1000/60);
     };
})();

function Preload(kv, cb){
	var total = 0, done = 0;
	var assets = {};

	function onLoad(){
		done += 1;
		if(total == done)
			cb(assets);
	}

	function onError(){
		done += 1;
		console.error("Could not load image: ", this);
		if(total == done)
			cb(assets);
	}

	for(var k in kv){
		total += 1;
		assets[k] = new Image();
		assets[k].onload = onLoad.bind(assets[k]);
		assets[k].onerror = onError.bind(assets[k]);
		assets[k].src = kv[k];
	}

	return assets;
}

var assets = Preload({
	"ice": "./img/tile-ice-1.png",
	"grass": "./img/tile-grass-1.png",
	"mask-hori": "./img/pixel-mask-hori.png",
	"mask-vert": "./img/pixel-mask-vert.png",
	"mask-right-bottom": "./img/pixel-mask-right-bottom.png",
	"mask-left-bottom": "./img/pixel-mask-left-bottom.png",
	"mask-right-top": "./img/pixel-mask-right-top.png",
	"mask-left-top": "./img/pixel-mask-left-top.png",
},
function(assets){
	// console.log("Running: ", assets);

	var t = document.getElementById('tiles');
	for(var a in assets){
		assets[a].draggable = true;
		t.appendChild(assets[a]);
	}
	// run();
});

var canvas = undefined;
var context = undefined; 

function maskImage(top, bottom, mask){

	var maskCanvas = document.createElement("canvas");
	maskCanvas.width = 40;
	maskCanvas.height = 40;
	var maskContext = maskCanvas.getContext('2d');
	maskContext.drawImage(mask, 0, 0, 40, 40);
	var maskImage = maskContext.getImageData(0, 0, 40, 40);


	var topCanvas = document.createElement("canvas");
	topCanvas.width = 40;
	topCanvas.height = 40;
	var topContext = topCanvas.getContext('2d');
	topContext.drawImage(top, 0, 0, 40, 40);
	var topImage = topContext.getImageData(0, 0, 40, 40);

	for(var i = 0; i < topImage.data.length; i += 4){
		var tr = topImage.data[i];
		var tg = topImage.data[i+1];
		var tb = topImage.data[i+2];
		var ta = topImage.data[i+3];

		var mr = maskImage.data[i];
		var mg = maskImage.data[i+1];
		var mb = maskImage.data[i+2];
		var ma = maskImage.data[i+3];

		
		if(ma > 0){
			// console.log(i, mr, mg, mb, ma);
			maskImage.data[i] = tr;
			maskImage.data[i+1] = tg;
			maskImage.data[i+2] = tb;
			maskImage.data[i+3] = 255;
		}
	}

	maskContext.putImageData(maskImage, 0, 0);

	var mergedCanvas = document.createElement("canvas");
	mergedCanvas.width = 40;
	mergedCanvas.height = 40;
	var mergedContext = mergedCanvas.getContext('2d');

	mergedContext.drawImage(bottom, 0, 0, 40, 40);
	mergedContext.drawImage(maskCanvas, 0, 0, 40, 40);

	context.drawImage(mergedCanvas,0, 0, 40, 40, 0, 0, 400, 400);

	var s = document.getElementById("save");
	s.href = mergedCanvas.toDataURL();

	return mergedCanvas;
}

var run = function(){
	requestAnimFrame(run);
}

window.onload = function(){
	canvas = document.getElementById("canvas");
	context = canvas.getContext('2d');

	var top = document.getElementById("top");
	var bottom = document.getElementById("bottom");
	var mask = document.getElementById("mask");

	

	top.addEventListener("dragover", function(e){
		e.stopPropagation();
		e.preventDefault();
	}, false);

	top.addEventListener("drop", function(e){
		e.preventDefault();
		e.stopPropagation();
	}, false);
};