import * as THREE from 'three';

// The reflected camera uses the sea surface as an oblique near plane.
export function makeReflection(sea){
  const camera=new THREE.PerspectiveCamera();
  const rt=new THREE.WebGLRenderTarget(720,400,{type:THREE.HalfFloatType,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter});
  const matrix=new THREE.Matrix4(),target=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
  const plane=new THREE.Plane(),clip=new THREE.Vector4(),q=new THREE.Vector4();
  let next=-1;
  function render(renderer,scene,view,time,ultra){
    if(time<next)return;
    next=time+(ultra?.09:.2);
    const width=Math.min(ultra?960:560,Math.round(renderer.domElement.width*.55));
    const height=Math.max(100,Math.round(width/view.aspect));
    if(rt.width!==width||rt.height!==height)rt.setSize(width,height);
    camera.position.copy(view.position);camera.position.y*=-1;
    view.getWorldDirection(target).reflect(up).add(camera.position);
    camera.up.set(0,1,0).applyQuaternion(view.quaternion).reflect(up);camera.lookAt(target);camera.updateMatrixWorld();
    camera.projectionMatrix.copy(view.projectionMatrix);
    matrix.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
    plane.set(up,.03).applyMatrix4(camera.matrixWorldInverse);
    clip.set(plane.normal.x,plane.normal.y,plane.normal.z,plane.constant);
    const e=camera.projectionMatrix.elements;
    q.set((Math.sign(clip.x)+e[8])/e[0],(Math.sign(clip.y)+e[9])/e[5],-1,(1+e[10])/e[14]);
    clip.multiplyScalar(2/clip.dot(q));
    e[2]=clip.x;e[6]=clip.y;e[10]=clip.z+1-.001;e[14]=clip.w;
    const previous=renderer.getRenderTarget(),meadow=scene.getObjectByName('迎风草甸');
    sea.visible=false;if(meadow)meadow.visible=false;
    renderer.setRenderTarget(rt);renderer.render(scene,camera);renderer.setRenderTarget(previous);
    sea.visible=true;if(meadow)meadow.visible=true;
  }
  return {texture:rt.texture,matrix,render};
}
