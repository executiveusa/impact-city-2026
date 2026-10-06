import * as THREE from "three";

/**
 * Clay material prototype (04-art-direction): hand-pressed surface via procedural
 * value-noise normal wobble, soft roughness, slight warm subsurface-ish wrap,
 * plus a uDecay uniform that desaturates and darkens the object (record-decay mask).
 */
export interface ClayMaterial extends THREE.MeshStandardMaterial {
  userData: { uDecay: { value: number } };
}

export function makeClayMaterial(base: THREE.Color): ClayMaterial {
  const mat = new THREE.MeshStandardMaterial({ color: base, roughness: 0.92, metalness: 0 }) as ClayMaterial;
  const uDecay = { value: 0 };
  mat.userData.uDecay = uDecay;
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uDecay = uDecay;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vClayPos;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvClayPos = position;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
varying vec3 vClayPos;
uniform float uDecay;
float clayHash(vec3 p){ p = fract(p*0.3183099+.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float clayNoise(vec3 x){ vec3 i=floor(x); vec3 f=fract(x); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(clayHash(i),clayHash(i+vec3(1,0,0)),f.x),mix(clayHash(i+vec3(0,1,0)),clayHash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(clayHash(i+vec3(0,0,1)),clayHash(i+vec3(1,0,1)),f.x),mix(clayHash(i+vec3(0,1,1)),clayHash(i+vec3(1,1,1)),f.x),f.y),f.z); }`
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
{ vec3 q = vClayPos*9.0; float e=0.05;
  float n0=clayNoise(q); vec3 g=vec3(clayNoise(q+vec3(e,0,0))-n0, clayNoise(q+vec3(0,e,0))-n0, clayNoise(q+vec3(0,0,e))-n0)/e;
  normal = normalize(normal + 0.06*g); }`
      )
      .replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
{ float l = dot(gl_FragColor.rgb, vec3(0.299,0.587,0.114));
  vec3 erased = vec3(l)*vec3(0.78,0.8,0.82);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, erased, uDecay) * (1.0 - 0.25*uDecay); }`
      );
  };
  return mat;
}
