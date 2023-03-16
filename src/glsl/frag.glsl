#version 100

precision mediump float;

// Light-Material model
uniform vec4 u_v4AmbientProduct;
uniform vec4 u_v4DiffuseProduct;
uniform vec4 u_v4SpecularProduct;
uniform float u_fShininess;
 
varying mediump vec3 v_v3SurfaceNormal;
varying mediump vec3 v_v3SurfaceToLight;
varying mediump vec3 v_v3SurfaceToViewer;
 
void main() {
    /*----Modified Phong Lighting Model----*/

    vec4 fColor;
    vec3 v_v3SurfaceNormal_N = normalize(v_v3SurfaceNormal);
    vec3 v_v3SurfaceToLight_N = normalize(v_v3SurfaceToLight);
    vec3 v_v3SurfaceToViewer_N = normalize(v_v3SurfaceToViewer);
    vec3 v3Halfway_N = normalize(v_v3SurfaceToLight_N + v_v3SurfaceToViewer_N);

    // Light Attenuation
    const float a = 0.2;
    const float b = 0.1;
    const float c = 0.5;
    float fDistance = distance(vec3(0,0,0), v_v3SurfaceToLight);
    float fAttenuation = 1.0/(a + b * fDistance + c * fDistance * fDistance);

    // Ambient Color
    vec4 ambient = u_v4AmbientProduct;

    // Diffuse Color
    float Kd = max(dot(v_v3SurfaceToLight_N, v_v3SurfaceNormal_N), 0.0);
    vec4 diffuse = fAttenuation * Kd * u_v4DiffuseProduct;

    // Specular Color
    float Ks = pow(max(dot(v_v3SurfaceNormal_N, v3Halfway_N), 0.0), u_fShininess);
    vec4 specular = fAttenuation * Ks * u_v4SpecularProduct;
    if (dot(v_v3SurfaceToLight_N, v_v3SurfaceNormal_N) < 0.0) {
        specular = vec4(0.0, 0.0, 0.0, 1.0);
    }

    fColor = ambient + diffuse + specular;
    fColor.a = 1.0;
    gl_FragColor = fColor;
}