import * as THREE from 'three';
import {RGBELoader} from '../vendor/RGBELoader.js';

function mountainIslands(scene){
  // Surveyed elevations give the offshore islands their asymmetric cliffs and glacial ridges.
  new THREE.FileLoader().setResponseType('arraybuffer').load('./assets/sky/offshore-relief.bin',buf=>{
    const samples=new DataView(buf);
    const zones=[[9200,5500],[8800,9300],[9500,18000]],meshes=[];
    const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.98});
    let offset=0;
    for(const [width,depth] of zones){
      const cols=samples.getUint16(offset,true),rows=samples.getUint16(offset+2,true);
      offset+=4;
      const h=new Uint16Array(buf,offset,cols*rows);
      offset+=2*h.length;
      const pos=new Float32Array(h.length*3),colors=new Float32Array(h.length*3),indices=[];
      const dx=width/(cols-1),dz=depth/(rows-1);
      for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
        const k=j*cols+i,y=h[k],edge=!j||!i||i===cols-1||j===rows-1;
        const height=(edge||y<=1)?-14:y;
        pos.set([(i/(cols-1)-.5)*width,height,(j/(rows-1)-.5)*depth],k*3);
        const slope=Math.min(1,Math.hypot((h[k+1]||y)-y,(h[k+cols]||y)-y)/(1.4*dx));
        const variation=.64+.18*Math.sin(y*.12+i*.09)+.14*Math.cos(j*.57+i*.11);
        colors.set([.035+.053*variation+.018*slope,.054+.06*variation+.01*slope,.062+.053*variation+.022*slope],k*3);
        if(i&&j && (y>0||h[k-1]>0||h[k-cols]>0||h[k-cols-1]>0))indices.push(k-cols-1,k-1,k-cols,k-cols,k-1,k);
      }
      const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
      geo.setIndex(indices);geo.computeVertexNormals();meshes.push(geo);
    }
    const placements=[[0,-1090,-1670,.138,-.24],[1,630,-1930,.138,1.4],[2,-2040,-1050,.082,.54],
      [1,1765,325,.14,-.47],[0,-1080,1640,.15,2.3],[2,720,1720,.104,.36]];
    for(const [id,x,z,scale,yaw] of placements){
      const land=new THREE.Mesh(meshes[id],material);
      land.scale.set(scale,scale*1.2,scale);land.position.set(x,0,z);land.rotation.y=yaw;
      scene.add(land);
    }
  });
}

export function createAtmosphere(scene,renderer,ocean){
  mountainIslands(scene);
  const ambient=new THREE.HemisphereLight(0xe4efff,0x8e7d58,.8);
  const sun=new THREE.DirectionalLight(0xffe1b1,2.85);
  sun.castShadow=true;sun.shadow.mapSize.set(4096,4096);
  Object.assign(sun.shadow.camera,{left:-80,right:80,top:80,bottom:-80,near:1,far:560});
  sun.shadow.normalBias=.045;sun.shadow.bias=-.00015;sun.shadow.radius=1.8;
  scene.add(ambient,sun,sun.target);
  const skies={},cache={},readyEnv={};
  const texloader=new THREE.TextureLoader(),hdrLoader=new RGBELoader();
  const shell=new THREE.Mesh(new THREE.SphereGeometry(6500,64,32),new THREE.ShaderMaterial({
    side:THREE.BackSide,depthWrite:false, uniforms:{sky:{value:null}},
    vertexShader:'varying vec3 dir; void main(){dir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`uniform sampler2D sky;varying vec3 dir;void main(){vec3 d=normalize(dir);vec2 uv=vec2(atan(d.z,d.x)*.15915494+.5,asin(clamp(d.y,-1.,1.))*.31830989+.5);vec3 c=texture2D(sky,uv).rgb;gl_FragColor=vec4(c,1.);\n#include <colorspace_fragment>\n}`
  }));
  shell.renderOrder=-1000;shell.frustumCulled=false;scene.add(shell);
  const pmrem=new THREE.PMREMGenerator(renderer);
  const direction=new THREE.Vector3();
  let current='day',shadowX=9999,shadowZ=9999;
  function setMood(mood){
    current=mood;
    const evening=mood==='gold';
    if(!skies[mood]){
      skies[mood]=texloader.load('./assets/sky/'+mood+'.jpg');
      skies[mood].colorSpace=THREE.SRGBColorSpace;skies[mood].wrapS=THREE.RepeatWrapping;
    }
    if(!cache[mood]){
      cache[mood]=true;
      hdrLoader.load('./assets/sky/'+mood+'-env.hdr',tex=>{
        tex.mapping=THREE.EquirectangularReflectionMapping;
        readyEnv[mood]=pmrem.fromEquirectangular(tex);
        if(current===mood) scene.environment=readyEnv[mood].texture;
        tex.dispose();
      });
    }
    if(readyEnv[mood]) scene.environment=readyEnv[mood].texture;
    shell.material.uniforms.sky.value=skies[mood];
    if(evening)direction.set(-300,35,-180).normalize();
    else direction.set(-.803,.571,.171).normalize();
    sun.color.set(evening?0xffb26c:0xffe4b8);
    sun.intensity=evening?3.35:3.15;
    ambient.intensity=evening?.78:.85;
    scene.environmentIntensity=evening?.57:.6;
    scene.fog=new THREE.FogExp2(evening?0xb7aca2:0x82868a,evening?.00068:.00059);
    ocean.light(skies[mood],direction,sun.color,scene.fog.color);
    shadowX=9999;
  }
  function update(camera){
    shell.position.copy(camera.position);
    if(Math.abs(camera.position.x-shadowX)>13 || Math.abs(camera.position.z-shadowZ)>13){
      shadowX=Math.round(camera.position.x/12)*12;shadowZ=Math.round(camera.position.z/12)*12;
      sun.target.position.set(shadowX,camera.position.y-3,shadowZ);
      sun.position.copy(sun.target.position).addScaledVector(direction,245);
      renderer.shadowMap.needsUpdate=true;
    }
  }
  return {setMood,update};
}

