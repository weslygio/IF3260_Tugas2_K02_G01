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

void main() {
    vec3 v3WorldPosition = (u_m4World * a_v4Position).xyz;
    vec3 v3WorldLight = u_v4LightWorldPosition.xyz;

    v_v3SurfaceNormal = mat3(u_m4WorldInverseTranspose) * a_v3Normal;
    v_v3SurfaceToLight = v3WorldLight - v3WorldPosition;
    v_v3SurfaceToViewer = -v3WorldPosition;
    gl_Position = u_m4WorldProjection * a_v4Position;
}