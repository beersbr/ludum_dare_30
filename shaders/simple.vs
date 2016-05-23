precision mediump float;
attribute vec3 vertexColor;
attribute vec3 vertexPos;
attribute vec3 normalVec;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec4 f_color;
varying vec3 vNormal;

void main(void) {
	// Return the transformed and projected vertex value

	gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
	f_color = vec4(vertexColor, 1.0);
}