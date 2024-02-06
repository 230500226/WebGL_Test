//display errors in the browser
function showError(errorText) {
    const errorBoxDiv = document.getElementById('error-box'); //find error box
    const errorSpan = document.createElement('p');    //create span (paragraph element) to store error tex
    errorSpan.innerText = errorText; //add error text
    errorBoxDiv.appendChild(errorSpan); //add error text to the box
    console.error(errorText); //console.log(errorText) for redundant error message
}

const canvas = document.getElementById("IDcanvas");
if (!canvas){
    showError("Can't find canvas reference"); //error from typo or pre loaded canvas
    return;
}

const gl = canvas.getContext("webgl2");
if (!gl){
    showError("Can't find webgl2 support"); //error from browser support for webgl2
    return;
}

// Vertex shader source code
const vertexShaderSourceCode = `#version 300 es
precision mediump float;
in vec2 vertexPosition;
void main() {
    gl_Position = vec4(vertexPosition, 0.0, 1.0);
}`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSourceCode);
gl.compileShader(vertexShader);

if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
    const errorMessage = gl.getShaderInfoLog(vertexShader);
    showError('Compile vertex error: ' + errorMessage);
    return;
}

// Fragment shader source code
const fragmentShaderSourceCode = `#version 300 es
precision mediump float;
out vec4 outColor;
void main() {
    outColor = vec4(0.0, 1.0, 1.0, 1.0); // Neon blue color
}`;

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
gl.compileShader(fragmentShader);

if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
    const errorMessage = gl.getShaderInfoLog(fragmentShader);
    showError('Compile fragment error: ' + errorMessage);
    return;
}

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const errorMessage = gl.getProgramInfoLog(helloTriangleProgram);
    showError(`Failed to link GPU program: ${errorMessage}`);
    return;
  }

const squarePosition = gl.getAttribLocation(program, "vertexPosition");
 if (squarePosition < 0) {
    showError(`Failed to get attribute location for vertexPosition`);
    return;
  }
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -0.8, -0.8,
    0.8, -0.8,
    -0.8,  0.8,
    -0.8,  0.8,
    0.8, -0.8,
    0.8,  0.8]), gl.STATIC_DRAW);
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

gl.enableVertexAttribArray(squarePosition);

gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

gl.vertexAttribPointer(squarePosition, 2, gl.FLOAT, false, 0, 0);

gl.drawArrays(gl.TRIANGLES, 0, 6);
