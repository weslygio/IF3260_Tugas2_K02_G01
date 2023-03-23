import Vec3 from "./lib/Vec3.js"
import Point3 from "./lib/Point3.js"
import initShaderProgram from "./lib/shader_utils.js"

const slider_rx = document.getElementById("rx");
const slider_ry = document.getElementById("ry");
const slider_rz = document.getElementById("rz");
const slider_sc = document.getElementById("sc");
const slider_tx = document.getElementById("tx");
const slider_ty = document.getElementById("ty");
const slider_tz = document.getElementById("tz");
const slider_cr = document.getElementById("cr");
const slider_cg = document.getElementById("cg");
const slider_cb = document.getElementById("cb");

var rx = 0.0;
var ry = 0.0;
var rz = 0.0;
var sc = 1.0;
var tx = 0.0;
var ty = 0.0;
var tz = 0.0;
var cr = 0.5;
var cg = 0.5;
var cb = 0.5;

var projectionType = "Perspective"
var z = -4.0;

slider_rx.oninput = function() {
    rx = this.value * Math.PI;
}

slider_ry.oninput = function() {
    ry = this.value * Math.PI;
}

slider_rz.oninput = function() {
    rz = this.value * Math.PI;
}

slider_sc.oninput = function() {
    sc = Math.pow(Math.E, 0.2 * this.value);
}

slider_tx.oninput = function() {
    tx = -this.value;
}

slider_ty.oninput = function() {
    ty = -this.value;
}

slider_tz.oninput = function() {
    tz = -this.value;
}

slider_cr.oninput = function() {
    cr = this.value;
}

slider_cg.oninput = function() {
    cg = this.value;
}

slider_cb.oninput = function() {
    cb = this.value;
}

document.getElementById("dropdown").addEventListener("change", updateProjection);
function updateProjection() {
    var dropdown = document.getElementById("dropdown");
    projectionType = dropdown.value;
    console.log(projectionType);
    // Do something with the selected value here
  }

window.onload = async () => {
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector('#glcanvas');
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext('webgl');

    // Error alert
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    // Shader program
    const vsSource = await (await fetch("glsl/vert.glsl", {cache: "no-cache"})).text();
    const fsSource = await (await fetch("glsl/frag.glsl", {cache: "no-cache"})).text();
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Collect all the info needed to use the shader program.
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'a_v4Position'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'a_v4Color'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'a_v3Normal'),
        },
        uniformLocations: {
            worldMatrix: gl.getUniformLocation(shaderProgram, 'u_m4World'),
            worldProjectionMatrix: gl.getUniformLocation(shaderProgram, 'u_m4WorldProjection'),
            worldInverseTransposeMatrix: gl.getUniformLocation(shaderProgram, 'u_m4WorldInverseTranspose'),
            lightWorldPosition: gl.getUniformLocation(shaderProgram, 'u_v4LightWorldPosition'),
            ambientProduct: gl.getUniformLocation(shaderProgram, 'u_v4AmbientProduct'),
            diffuseProduct: gl.getUniformLocation(shaderProgram, 'u_v4DiffuseProduct'),
            specularProduct: gl.getUniformLocation(shaderProgram, 'u_v4SpecularProduct'),
            shininess: gl.getUniformLocation(shaderProgram, 'u_fShininess'),
        }
    };

    // Get object information
    const objectInfo = await initObject(gl);
    function render() {
        
        // Reset canvas
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.5, 1.0, 1.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set camera perspective animation
        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const angle = 45;

        // const projectionMatrix2 = mat4.create();
        // mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        // mat4.translate(projectionMatrix, projectionMatrix, [0, 0, z]);

        var projectionMatrix = new Matrix();
        projectionMatrix.fill(projectionMatrix.projection(projectionType, fieldOfView, aspect, zNear, zFar,angle));
        projectionMatrix.translate(0, 0, z);

        // console.log(projectionMatrix);
        // console.log(projectionType);

        // Draw the object
        drawObject(gl, programInfo, objectInfo, projectionMatrix);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

// Initialize object
async function initObject(gl) {
    const model = JSON.parse(await (await fetch("../test/pyramid.json", {cache: "no-cache"})).text());
    const object = modelToObject(model);

    // Positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.positions), gl.STATIC_DRAW);

    // Normals
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.normals), gl.STATIC_DRAW);

    // Colors
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.colors), gl.STATIC_DRAW);

    console.log(object);

    return {
        length: object.length,
        positions: positionBuffer,
        normals: normalBuffer,
        colors: colorBuffer
    };
}

// Draw object
function drawObject(/** @type {WebGLRenderingContext} */ gl, programInfo, buffers, projectionMatrix) {
    gl.useProgram(programInfo.program);
    
    // const worldMatrix = mat4.create();
    //mat4.translate(worldMatrix, worldMatrix, [tx, ty, tz]);
    // mat4.rotateX(worldMatrix, worldMatrix, rx);
    // mat4.rotateY(worldMatrix, worldMatrix, ry);
    // mat4.rotateZ(worldMatrix, worldMatrix, rz);

    var worldMatrix = new Matrix();
    var worldProjectionMatrix = new Matrix();

    // const worldProjectionMatrix = mat4.create();
    // mat4.multiply(worldProjectionMatrix, projectionMatrix, worldMatrix);

    worldMatrix.translate(tx, ty, tz);
    worldMatrix.xRotate(rx);
    worldMatrix.yRotate(ry);
    worldMatrix.zRotate(rz);

    // console.log(worldMatrix.elements)

    worldProjectionMatrix.elements = projectionMatrix.multiply(worldMatrix.elements);

    // console.log(worldProjectionMatrix.elements);

    // const worldInverseTransposeMatrix = mat4.create();
    // mat4.invert(worldInverseTransposeMatrix, worldMatrix);
    // mat4.transpose(worldInverseTransposeMatrix, worldInverseTransposeMatrix);

    var worldInverseTransposeMatrix = new Matrix();
    worldInverseTransposeMatrix.elements = worldMatrix.invert().transpose().elements;
    
    // Position attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positions);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    // Normal attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normals);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
    
    // Color attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);

    // Uniforms
    gl.uniformMatrix4fv(programInfo.uniformLocations.worldMatrix, false, worldMatrix.elements);
    gl.uniformMatrix4fv(programInfo.uniformLocations.worldProjectionMatrix, false, worldProjectionMatrix.elements);
    gl.uniformMatrix4fv(programInfo.uniformLocations.worldInverseTransposeMatrix, false, worldInverseTransposeMatrix.elements);
    gl.uniform4fv(programInfo.uniformLocations.lightWorldPosition, [tx,ty,tz,1]);
    gl.uniform4fv(programInfo.uniformLocations.ambientProduct, [0.2, 0.2, 0.2, 1.0]);
    gl.uniform4fv(programInfo.uniformLocations.diffuseProduct, [cr, cg, cb, 1.0]);
    gl.uniform4fv(programInfo.uniformLocations.specularProduct, [cr, cg, cb, 1.0]);
    gl.uniform1f(programInfo.uniformLocations.shininess, 200);
    
    // Draw Array
    gl.drawArrays(gl.TRIANGLES, 0, buffers.length);
}

function modelToObject(model) {
    const object = {};
    object.length = model.geometry.indices.length;
    object.positions = getGeometry(model);
    object.normals = getNormal(model);
    object.colors = getColor(model);
    return object;
}

function getGeometry(model) {
    const positions = [];
    for (let i = 0; i < model.geometry.indices.length; i++) {
        const idx = model.geometry.indices[i];
        positions.push(model.geometry.positions[idx*3], model.geometry.positions[idx*3+1], model.geometry.positions[idx*3+2]);
    }
    return positions;
}

// Normal 
function getNormal(model) {
    const normals = [];
    for (let i = 0; i < model.geometry.indices.length; i += 3) {
        const idx_p1 = model.geometry.indices[i];
        const idx_p2 = model.geometry.indices[i+1];
        const idx_p3 = model.geometry.indices[i+2];

        const p1 = new Point3(model.geometry.positions[idx_p1*3], model.geometry.positions[idx_p1*3+1], model.geometry.positions[idx_p1*3+2]);
        const p2 = new Point3(model.geometry.positions[idx_p2*3], model.geometry.positions[idx_p2*3+1], model.geometry.positions[idx_p2*3+2]);
        const p3 = new Point3(model.geometry.positions[idx_p3*3], model.geometry.positions[idx_p3*3+1], model.geometry.positions[idx_p3*3+2]);

        const v1 = Vec3.fromPoints(p1, p2);
        const v2 = Vec3.fromPoints(p2, p3);
        const n = Vec3.cross(v1, v2).normalize();
        for (let j = 0; j < 3; j++) {
            normals.push(n.u1, n.u2, n.u3);
        }
    }
    return normals;
}

function getColor(model) {
    const colors = [];
    model.geometry.indices.forEach(_ => colors.push(0.8, 0.5, 0.5, 1.0));    // Hardcode color
    return colors;
}

