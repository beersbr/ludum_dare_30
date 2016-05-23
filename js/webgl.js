function initWebgl(canvas){
	var gl = null;
	try{
		gl = canvas.getContext("webgl");
	}
	catch(e){
		console.error("Could not create weblg canvas!");
	}

	if(!gl){
		throw new Error("Browser does not support webgl");
	}

	return gl;
}

function initViewport(gl, w, h){
	gl.viewport(0, 0, w, h);
}

function initPerspective(gl, w, h){
	var p = mat4.create();
	mat4.perspective(p, Math.PI/4, w/h, 1, 100000);
	gl.perspective = p;
	return p;
}

function combineArrays(ar1, ar2){
	var dst = new Float32Array(ar1.length+ar2.length);
	dst.set(ar1);
	dst.set(ar2, ar1.length);
}

function Mesh(args){
	var gl = args.gl || console.error("NO GL SPECIFIED");
	this.shader = args.shader || null;

	this.bufferId = gl.createBuffer();
	this.elementBufferId = gl.createBuffer();
	this.colorBufferId = gl.createBuffer();

	this.modelMatrix = args.modelMatrix || mat4.create();
	mat4.translate(this.modelMatrix, this.modelMatrix, [0, 0, -10]);
	this.shader = args.shader || undefined;
	
	this.vertSize = 3;

	// this is for the verts to make ssure they are always a float 32
	this._vertices = new Float32Array;
	Object.defineProperty(this, "vertices", {
		get: function(){
			return this._vertices;
		},
		set: function(v){
			this._vertices = new Float32Array(v);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
			gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.STATIC_DRAW);
			this._length = this._vertices.length/this.vertSize;
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		}
	});

	this._elements = new Uint16Array;
	Object.defineProperty(this, "elements", {
		get: function(){
			return this._elements;
		},
		set: function(v){
			this._elements = new Uint16Array(v);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBufferId);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._elements, gl.STATIC_DRAW);
			// this._length = this._elements.length/this.vertSize;
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		}
	});

	this._colors = new Uint32Array;
	Object.defineProperty(this, "colors", {
		get: function(){
			return this._colors;
		},
		set: function(v){
			this._colors = new Float32Array(v);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBufferId);
			gl.bufferData(gl.ARRAY_BUFFER, this._colors, gl.STATIC_DRAW);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		}
	});

	this._length = 0;
	Object.defineProperty(this, "length", {
		get: function(){
			return this._length;
		},
		set: function(v){
			console.warn("cannot set value of readonly property");
		}
	});

	this.vertices = args.vertices || [];
	this.elements = args.elements || [];
	this.colors = args.colors || [];
	 // default 3 nums per vert at size of (4)
	

	this.render = function(GL, args){
		var gl = GL || gl;
		if(!args) args = {};

		gl.useProgram(this.shader.program);
		this.shader.enableAllAttributes();

		gl.uniformMatrix4fv(this.shader.getUniform("modelViewMatrix"), false, this.modelMatrix);
		gl.uniformMatrix4fv(this.shader.getUniform("projectionMatrix"), false, args.projectionMatrix);

		if(this.vertices.length != 0){
			gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
			gl.vertexAttribPointer(this.shader.getAttribute("vertexPos"), this.vertSize, gl.FLOAT, false, 0, 0);
		}
		if(this.colors.length != 0){
			gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBufferId);
			gl.vertexAttribPointer(this.shader.getAttribute("vertexColor"), 3, gl.FLOAT, false, 0, 0);
		}

		if(this.elements.length != 0){
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBufferId);
			gl.drawElements(gl.TRIANGLE_STRIP, this.elements.length, gl.UNSIGNED_SHORT, 0);
		}
		else
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.length);

	}
}

function getShader(shaderName){
	var s = "";
	$.ajax({
		url: "/shaders/"+shaderName,
		async: false,
		success: function(e){
			s = e;
		}
	});

	return s;
}


function ShaderProgram(gl, v, f){
	this.gl = gl;
	this.vertexProgram = "" || v;
	this.fragmentProgram = "" || f;

	this.vertex = this.gl.createShader(gl.VERTEX_SHADER);
	this.fragment = this.gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(this.vertex, this.vertexProgram);
	gl.compileShader(this.vertex);

	if(!gl.getShaderParameter(this.vertex, gl.COMPILE_STATUS)) {
		console.error(gl.getShaderInfoLog(this.vertex));
		return null;
	}

	gl.shaderSource(this.fragment, this.fragmentProgram);
	gl.compileShader(this.fragment);

	if(!gl.getShaderParameter(this.fragment, gl.COMPILE_STATUS)) {
		console.error(gl.getShaderInfoLog(this.fragment));
		return null;
	}

	this.program = gl.createProgram();

	gl.attachShader(this.program, this.vertex);
	gl.attachShader(this.program, this.fragment);
	gl.linkProgram(this.program);


	 if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
		console.error("Could not initialise shaders");
	}


	this.uniforms = {};
	this.getUniform = function(name){
		if(!this.uniforms[name])
			this.uniforms[name] = gl.getUniformLocation(this.program, name);
		return this.uniforms[name];
	}

	this.attributes = {};
	this.getAttribute = function(name){
		if(this.attributes[name] == undefined){
			this.attributes[name] = gl.getAttribLocation(this.program, name);
			console.log("ENABLE: ", name, this.attributes[name]);
			this.enableAttribute(name);
		}
		return this.attributes[name];
		
	}

	this.enableAllAttributes = function(){
		for(var i in this.attributes){
			gl.enableVertexAttribArray(this.attributes[i]);
		}
	}

	this.enableAttribute = function(name){
		return gl.enableVertexAttribArray(this.attributes[name]);
	}

	this.disableAttribute = function(name){
		return gl.disableVertexAttribArray(this.attributes[name]);
	}

}