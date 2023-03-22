#version 100

attribute vec4 a_v4Position;
attribute vec3 a_v3Normal;

uniform mat4 u_m4World;
uniform mat4 u_m4WorldProjection;
uniform mat4 u_m4WorldInverseTranspose;
uniform vec4 u_v4LightWorldPosition;

varying mediump vec3 v_v3SurfaceNormal;
varying mediump vec3 v_v3SurfaceToLight;
varying mediump vec3 v_v3SurfaceToViewer;

uniform float u_fudgeFactor;

void main() {
    // Adjust the z to divide by
    vec4 position =  u_m4WorldProjection * a_v4Position;
    float zToDivideBy = 1.0 + position.z * u_fudgeFactor;

    vec3 v3WorldPosition = (u_m4World * a_v4Position).xyz;
    vec3 v3WorldLight = u_v4LightWorldPosition.xyz;

    v_v3SurfaceNormal = mat3(u_m4WorldInverseTranspose) * a_v3Normal;
    v_v3SurfaceToLight = v3WorldLight - v3WorldPosition;
    v_v3SurfaceToViewer = -v3WorldPosition;
    gl_Position = vec4(position.xy / zToDivideBy, position.zw);
}