import * as THREE from 'three';
import {makeReflection} from './reflection.js';

const vertex = `
uniform float time;
varying vec3 world;
void main(){
  world=(modelMatrix*vec4(position,1.)).xyz;
  vec2 p=world.xz;
  float wave=.16*sin(dot(p,vec2(.062,.091))+time*.82)+.09*sin(dot(p,vec2(-.135,.109))+time*1.22);
  world.y+=wave;
  gl_Position=projectionMatrix*viewMatrix*vec4(world,1.);
}`;

const fragment = `
uniform sampler2D normals, bathy, skyMap, surf, mirrorMap;
uniform mat4 mirrorMatrix;
uniform vec3 sunDir, sunTint, haze;
uniform float time;
varying vec3 world;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.543);}
float noise2(vec2 p){vec2 i=floor(p), f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
vec3 skyColor(vec3 d){
  vec2 uv=vec2(atan(d.z,d.x)*.15915494+.5,asin(clamp(d.y,-1.,1.))*.31830989+.5);
  return texture2D(skyMap,uv).rgb;
}
void main(){
  vec2 p=world.xz;
  vec3 eye=normalize(cameraPosition-world);
  float dist=length(cameraPosition-world);
  vec2 n0=texture2D(normals,p*.009+time*vec2(.0042,-.002)).xy-.5;
  vec2 n1=texture2D(normals,vec2(-p.y,p.x)*.028+time*vec2(.002,-.003)).xy-.5;
  vec2 n2=texture2D(normals,p*.078+time*vec2(-.009,-.002)).xy-.5;
  float fade=1.-smoothstep(130.,820.,dist);
  vec2 normal=(n0*.69+n1*.42+n2*(.09+.2*fade))*(.38+.62*fade);
  normal+=vec2(.012*sin(p.x*.09+time),.022*cos(p.y*.09+time*.83));
  vec3 N=normalize(vec3(normal.x,1.,normal.y));
  vec3 R=reflect(-eye,N); R.y=max(.016,R.y);
  vec2 buv=(p+vec2(220.))/440.;
  float depth=27., coast=42.;
  if(all(greaterThanEqual(buv,vec2(0.))) && all(lessThanEqual(buv,vec2(1.)))){
    vec2 shore=texture2D(bathy,buv).rg;
    depth=clamp(24.-shore.r*72.+world.y,0.,35.);
    coast=shore.g*42.;
  }
  float shoal=exp(-depth*.23);
  float mottled=noise2(p*.031+normal);
  vec3 body=mix(vec3(.006,.058,.074),vec3(.024,.225,.178),max(shoal,exp(-coast*.095))*(.54+.46*mottled));
  float fres=.055+.49*pow(1.-clamp(dot(N,eye),0.,1.),4.6);
  vec3 environment=skyColor(normalize(R));
  vec4 clip=mirrorMatrix*vec4(world.x,0.,world.z,1.);
  vec2 projected=clip.xy/max(.01,clip.w)*.5+.5;
  vec2 uv=projected+normal*(.016+.065/(1.+dist*.015));
  float edge=clamp(min(min(uv.x,uv.y),min(1.-uv.x,1.-uv.y))*18.,0.,1.);
  vec3 mirror=texture2D(mirrorMap,clamp(uv,.001,.999)).rgb;
  environment=mix(environment,mirror,edge*(1.-smoothstep(450.,1250.,dist))*.89);
  vec3 col=mix(body,environment*vec3(.59,.71,.75),fres);
  float spec=pow(max(dot(normalize(sunDir+eye),N),0.),clamp(740.-dist*.22,120.,740.));
  col+=sunTint*(2.5*spec);
  float variation=noise2(p*.16);
  vec2 flow=vec2(.065,-.033)*time;
  vec3 lace=texture2D(surf,(p+flow+normal*.95)*.065).rgb;
  vec3 threads=texture2D(surf,(p-flow*1.2+normal*.67)*.111).rgb;
  float wobble=1.1*sin(p.x*.26+p.y*.13-time*.25)+1.5*(variation-.5);
  float breaker=.5+.5*cos((coast+wobble)*1.46+time*1.26);
  float envelope=exp(-coast*.245)*(1.-smoothstep(10.,16.,coast));
  float wash=envelope*(.19+lace.r*.64+lace.g*.26+threads.r*.38+breaker*.35);
  float comb=smoothstep(.64,.97,breaker)*exp(-coast*.31)*(.04+.60*lace.r+.30*threads.g)*(.5+.5*variation);
  float windChop=smoothstep(.69,.86,noise2(p*.105-flow*.13))*smoothstep(.54,.74,texture2D(normals,p*.045+flow*.02).g)*.17;
  float broken=.22+.78*smoothstep(.16,.79,noise2(p*.19+flow*.4)*.68+noise2(p*.61)*.32);
  float spume=clamp((wash+comb)*broken+windChop*fade,0.,.95);
  col=mix(col,vec3(.65,.76,.71)*(1.+.20*threads.b),spume);
  col=mix(col,haze,1.-exp(-dist*.00019));
  gl_FragColor=vec4(col,1.);
  #include <tonemapping_fragment>
  vec3 horizon=skyColor(normalize(vec3(-eye.x,.008,-eye.z)));
  gl_FragColor.rgb=mix(gl_FragColor.rgb,horizon,smoothstep(1200.,8200.,dist)*.91);
  #include <colorspace_fragment>
}`;

export function createOcean(scene,heightAt) {
  const size=400, raster=new Uint8Array(size*size*2), shore=new Float32Array(size*size);
  const spacing=440/size,diag=spacing*Math.SQRT2;
  for(let j=0;j<size;j++) for(let i=0;i<size;i++) {
    const k=j*size+i,h=heightAt((i+.5)*spacing-220,(j+.5)*spacing-220);
    raster[k*2]=Math.round(255*THREE.MathUtils.clamp((h+24)/72,0,1));
    shore[k]=h>-.16?0:42;
  }
  // Two chamfer passes give the surf its distance to the real shoreline and exposed rocks.
  for(let y=1;y<size;y++)for(let x=1;x<size-1;x++){
    const k=y*size+x;
    shore[k]=Math.min(shore[k],shore[k-1]+spacing,shore[k-size]+spacing,shore[k-size-1]+diag,shore[k-size+1]+diag);
  }
  for(let y=size-2;y>=0;y--)for(let x=size-2;x>0;x--){
    const k=y*size+x;
    shore[k]=Math.min(shore[k],shore[k+1]+spacing,shore[k+size]+spacing,shore[k+size+1]+diag,shore[k+size-1]+diag);
  }
  for(let k=0;k<shore.length;k++)raster[2*k+1]=Math.round(255*shore[k]/42);
  const bathy=new THREE.DataTexture(raster,size,size,THREE.RGFormat);
  bathy.minFilter=bathy.magFilter=THREE.LinearFilter; bathy.needsUpdate=true;
  const normals=new THREE.TextureLoader().load('./assets/sky/water.jpg');
  normals.wrapS=normals.wrapT=THREE.RepeatWrapping; normals.anisotropy=8;
  const surf=new THREE.TextureLoader().load('./assets/sky/surf.webp');
  surf.wrapS=surf.wrapT=THREE.RepeatWrapping;surf.anisotropy=8;
  const uniforms={time:{value:0},normals:{value:normals},surf:{value:surf},bathy:{value:bathy},skyMap:{value:null},sunDir:{value:new THREE.Vector3()},sunTint:{value:new THREE.Color()},haze:{value:new THREE.Color(.34,.44,.48)}};
  const mat=new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms});
  const geo=new THREE.PlaneGeometry(2,2,204,204);
  geo.rotateX(-Math.PI/2);
  const positions=geo.attributes.position;
  // Concentrate wave geometry at the coast and push its outer rings to the horizon.
  for(let i=0;i<positions.count;i++) {
    const x=positions.getX(i),z=positions.getZ(i);
    const scale=335+Math.pow(Math.max(Math.abs(x),Math.abs(z)),8)*8700;
    positions.setXYZ(i,x*scale,0,z*scale);
  }
  geo.computeBoundingSphere();
  const sea=new THREE.Mesh(geo,mat); sea.name='North Atlantic'; scene.add(sea);
  const mirror=makeReflection(sea);
  uniforms.mirrorMatrix={value:mirror.matrix};uniforms.mirrorMap={value:mirror.texture};
  return {
    reflect:mirror.render,
    update(t){uniforms.time.value=t;},
    light(sky,dir,tint,haze){uniforms.skyMap.value=sky;uniforms.sunDir.value.copy(dir);uniforms.sunTint.value.copy(tint);uniforms.haze.value.copy(haze);}
  };
}

