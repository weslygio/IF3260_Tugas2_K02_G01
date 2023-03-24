import Matrix from "./lib/MatrixClass.js"
import Vec3 from "./lib/Vec3.js"
import Point3 from "./lib/Point3.js"
import initShaderProgram from "./lib/shader_utils.js"

const button_help = document.getElementById("help-button");
const modal_help = document.getElementById("help-modal");
const close_help = document.getElementById("help-close");
const button_reset = document.getElementById("reset-button");
const checkbox_shading = document.getElementById("shading-toggle");

const slider_orx = document.getElementById("orx");
const slider_ory = document.getElementById("ory");
const slider_orz = document.getElementById("orz");

const slider_otx = document.getElementById("otx");
const slider_oty = document.getElementById("oty");
const slider_otz = document.getElementById("otz");

const slider_osx = document.getElementById("osx");
const slider_osy = document.getElementById("osy");
const slider_osz = document.getElementById("osz");

const slider_crd = document.getElementById("crd");
const slider_crx = document.getElementById("crx");
const slider_cry = document.getElementById("cry");
const dropdown_cpj = document.getElementById("cpj");

const slider_lrd = document.getElementById("lrd");
const slider_lrx = document.getElementById("lrx");
const slider_lry = document.getElementById("lry");
const picker_lcl = document.getElementById("lcl");

// Help Modal
button_help.onclick = function() {
    modal_help.style.display = "block";
}

close_help.onclick = function() {
    modal_help.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal_help) {
        modal_help.style.display = "none";
    }
}

button_reset.onclick = resetDefault;
resetDefault();

function resetDefault() {
    checkbox_shading.checked = true;

    slider_orx.value = 0.09;
    slider_ory.value = -0.10;
    slider_orz.value = 0.0;

    slider_otx.value = 0.0;
    slider_oty.value = 0.0;
    slider_otz.value = 0.0;

    slider_osx.value = 0.0;
    slider_osy.value = 0.0;
    slider_osz.value = 0.0;
    
    slider_crd.value = 10.0;
    slider_crx.value = 0.0;
    slider_cry.value = 0.0;
    dropdown_cpj.value = "Perspective";

    slider_lrd.value = 0.0;
    slider_lrx.value = 0.0;
    slider_lry.value = 0.0;
    picker_lcl.value = "#ffffff";

    document.getElementById('orx_val').innerHTML = slider_orx.value;
    document.getElementById('ory_val').innerHTML = slider_ory.value;
    document.getElementById('orz_val').innerHTML = slider_orz.value;

    document.getElementById('otx_val').innerHTML = slider_otx.value;
    document.getElementById('oty_val').innerHTML = slider_oty.value;
    document.getElementById('otz_val').innerHTML = slider_otz.value;

    document.getElementById('osx_val').innerHTML = slider_osx.value;
    document.getElementById('osy_val').innerHTML = slider_osy.value;
    document.getElementById('osz_val').innerHTML = slider_osz.value;

    document.getElementById('crd_val').innerHTML = slider_crd.value;
    document.getElementById('crx_val').innerHTML = slider_crx.value;
    document.getElementById('cry_val').innerHTML = slider_cry.value;

    document.getElementById('lrd_val').innerHTML = slider_lrd.value;
    document.getElementById('lrx_val').innerHTML = slider_lrx.value;
    document.getElementById('lry_val').innerHTML = slider_lry.value;
}

function colorToArray(color) {
    return [
        parseInt(color.slice(1, 3), 16) / 255,
        parseInt(color.slice(3, 5), 16) / 255,
        parseInt(color.slice(5, 7), 16) / 255,
        1.0
    ];
}


/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#glcanvas');
/** @type {WebGLRenderingContext} */
const gl = canvas.getContext('webgl');
var objectInfo;

window.onload = async () => {
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
            lightAttenuation: gl.getUniformLocation(shaderProgram, 'u_v3LightAttenuation'),
            ambientProduct: gl.getUniformLocation(shaderProgram, 'u_v4AmbientProduct'),
            diffuseProduct: gl.getUniformLocation(shaderProgram, 'u_v4DiffuseProduct'),
            specularProduct: gl.getUniformLocation(shaderProgram, 'u_v4SpecularProduct'),
            shininess: gl.getUniformLocation(shaderProgram, 'u_fShininess'),
            useLighting: gl.getUniformLocation(shaderProgram, 'u_bUseLighting'),
        }
    };

    // Lighting model
    const lightInfo = {
        ambient: [0.2, 0.2, 0.2, 1.0],
        diffuse: colorToArray(picker_lcl.value),
        specular: colorToArray(picker_lcl.value),
        attenuation: [0.5, 0.025, 0.1],
    }

    function render() {
        // Reset canvas
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.5, 1.0, 1.0, 0.6);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Update light
        lightInfo.diffuse = colorToArray(picker_lcl.value);
        lightInfo.specular = colorToArray(picker_lcl.value);

        // Set camera perspective
        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const angle = 45;

        var projectionMatrix = new Matrix();
        projectionMatrix.fill(projectionMatrix.projection(dropdown_cpj.value, fieldOfView, aspect, zNear, zFar, angle));

        // Move Camera
        var fPosition = [0, 0, 0];
        var cameraMatrix = new Matrix();
        
        cameraMatrix.xRotate(slider_crx.value*Math.PI);
        cameraMatrix.yRotate(slider_cry.value*Math.PI);
        cameraMatrix.translate(0, 0, slider_crd.value);
        
        var cameraPosition = [
            cameraMatrix.elements[12],
            cameraMatrix.elements[13],
            cameraMatrix.elements[14],
        ];
        
        var up = [0, 1, 0];
        cameraMatrix.elements = cameraMatrix.lookAt(cameraPosition, fPosition, up);

        cameraMatrix.elements = cameraMatrix.invert().elements;
        projectionMatrix.fill(projectionMatrix.multiply(cameraMatrix.elements));

        // Draw the object if object is loaded
        if (objectInfo) {
            drawObject(programInfo, lightInfo, projectionMatrix);
        }

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

const openDesign = document.getElementById('open-design');
openDesign.openDesign = (e) => {
    var input = document.createElement('input');
    input.type = 'file';
    input.setAttribute('accept', 'application/json, .txt');
    input.onchange = e => {
        var file = e.target.files[0];

        if(!file){
            return;
        }

        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        reader.onload = readerEvent => {
            var content = readerEvent.target.result;
            // temp_objects = JSON.parse(content);
            objectInfo = initObject(gl, content);
        }
    }
    input.click();
}

// Initialize object
function initObject(gl, content) {
    const model = JSON.parse(content);
    const object = modelToObject(model);

    // Positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.positions), gl.STATIC_DRAW);

    // Normals
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.normals), gl.STATIC_DRAW);

    return {
        length: object.length,
        positions: positionBuffer,
        normals: normalBuffer,
        material: object.material,
    };
}

// Draw object
function drawObject(programInfo, lightInfo, projectionMatrix) {
    gl.useProgram(programInfo.program);

    // Object
    var worldMatrix = new Matrix();
    var worldProjectionMatrix = new Matrix();

    worldMatrix.translate(slider_otx.value, slider_oty.value, slider_otz.value);
    worldMatrix.xRotate(slider_orx.value * Math.PI);
    worldMatrix.yRotate(slider_ory.value * Math.PI);
    worldMatrix.zRotate(slider_orz.value * Math.PI);
    worldMatrix.scale(
        Math.pow(Math.E, slider_osx.value), 
        Math.pow(Math.E, slider_osy.value), 
        Math.pow(Math.E, slider_osz.value)
    );

    worldProjectionMatrix.elements = projectionMatrix.multiply(worldMatrix.elements);

    var worldInverseTransposeMatrix = new Matrix();
    worldInverseTransposeMatrix.elements = worldMatrix.invert().transpose().elements;

    // Lighting
    var u = slider_lrx.value * Math.PI;
    var v = slider_lry.value * Math.PI;
    var lightWorldPosition = [
        slider_lrd.value * Math.sin(u) * Math.cos(v), 
        slider_lrd.value * Math.sin(v), 
        slider_lrd.value * Math.cos(u) * Math.cos(v), 
        1.0
    ];

    const vecmult = (a, b) => a.map((val, idx) => val * b[idx])
    var ambientProduct = vecmult(lightInfo.ambient, objectInfo.material.ambient);
    var diffuseProduct = vecmult(lightInfo.diffuse, objectInfo.material.diffuse);
    var specularProduct = vecmult(lightInfo.specular, objectInfo.material.specular);
    
    // Position attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, objectInfo.positions);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    // Normal attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, objectInfo.normals);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);

    // Uniforms
    gl.uniformMatrix4fv(programInfo.uniformLocations.worldMatrix, false, worldMatrix.elements);
    gl.uniformMatrix4fv(programInfo.uniformLocations.worldProjectionMatrix, false, worldProjectionMatrix.elements);
    gl.uniformMatrix4fv(programInfo.uniformLocations.worldInverseTransposeMatrix, false, worldInverseTransposeMatrix.elements);
    gl.uniform4fv(programInfo.uniformLocations.lightWorldPosition, lightWorldPosition);
    gl.uniform3fv(programInfo.uniformLocations.lightAttenuation, lightInfo.attenuation);
    gl.uniform4fv(programInfo.uniformLocations.ambientProduct, ambientProduct);
    gl.uniform4fv(programInfo.uniformLocations.diffuseProduct, diffuseProduct);
    gl.uniform4fv(programInfo.uniformLocations.specularProduct, specularProduct);
    gl.uniform1f(programInfo.uniformLocations.shininess, objectInfo.material.shininess);
    gl.uniform1f(programInfo.uniformLocations.useLighting, checkbox_shading.checked);
    
    // Draw Array
    gl.drawArrays(gl.TRIANGLES, 0, objectInfo.length);
}

function modelToObject(model) {
    const object = {};
    object.length = model.geometry.indices.length;
    object.positions = getPosition(model);
    object.normals = getNormal(model);
    object.material = getMaterial(model);
    return object;
}

function getPosition(model) {
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

function getMaterial(model) {
    const material = {};
    material.ambient = model.material.ambient;
    material.diffuse = model.material.diffuse;
    material.specular = model.material.specular;
    material.shininess = model.material.shininess;
    return material;
}
