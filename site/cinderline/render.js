/* Linear HDR scene, quarter-resolution glow, and depth-aware contact shading. */
(function () {
  'use strict';
  const T = THREE;
  const vertex = [
    'varying vec2 vUv;',
    'void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}'
  ].join('\n');
  function material(fragment,uniforms,toneMapped=false) {
    return new T.ShaderMaterial({
      vertexShader:vertex,fragmentShader:fragment,uniforms,
      depthTest:false,depthWrite:false,toneMapped
    });
  }
  const extract = `
    varying vec2 vUv;
    uniform sampler2D source;
    uniform vec2 size;
    vec3 bright(vec2 uv){
      vec3 c=texture2D(source,uv).rgb;
      float peak=max(c.r,max(c.g,c.b));
      float mask=smoothstep(.57,1.52,peak);
      return min(c,vec3(7.))*mask;
    }
    void main(){
      vec2 p=size*.94;
      vec3 sum=bright(vUv- p)+bright(vUv+ p)+bright(vUv+vec2(p.x,-p.y))+bright(vUv+vec2(-p.x,p.y));
      gl_FragColor=vec4(sum*.25,1.);
    }`;
  const blur = `
    varying vec2 vUv;
    uniform sampler2D source;
    uniform vec2 axis;
    void main(){
      vec3 sum=texture2D(source,vUv).rgb*.227027;
      sum+=(texture2D(source,vUv+axis*1.384615).rgb+texture2D(source,vUv-axis*1.384615).rgb)*.316216;
      sum+=(texture2D(source,vUv+axis*3.230769).rgb+texture2D(source,vUv-axis*3.230769).rgb)*.070270;
      gl_FragColor=vec4(sum,1.);
    }`;
  const composite = `
    varying vec2 vUv;
    uniform sampler2D sceneColor;
    uniform sampler2D sceneDepth;
    uniform sampler2D glow;
    uniform vec2 pixel;
    uniform vec2 clip;
    uniform float clock;
    float linearDepth(vec2 uv){
      float z=texture2D(sceneDepth,uv).x;
      return clip.x*clip.y/(clip.y+(clip.x-clip.y)*z);
    }
    float crease(float d,vec2 offset){
      float a=linearDepth(vUv-offset), b=linearDepth(vUv+offset);
      float edge=max(abs(d-a),abs(d-b))/d;
      float pocket=(d-(a+b)*.5)/d;
      return smoothstep(.0018,.018,pocket)*(1.-smoothstep(.06,.23,edge));
    }
    void main(){
      vec3 color=texture2D(sceneColor,vUv).rgb;
      float d=linearDepth(vUv);
      vec2 r=pixel*clamp(49./sqrt(max(d,.09)),3.,18.);
      float contact=crease(d,r*vec2(.24,0.))+crease(d,r*vec2(0.,.25))
        +crease(d,r*vec2(.59,.49))+crease(d,r*vec2(-.54,.57))
        +crease(d,r*vec2(.95,0.))+crease(d,r*vec2(0.,1.));
      color*=1.-contact*.073;
      vec3 halo=texture2D(glow,vUv).rgb;
      color+=halo*.33;
      // Cool ambient shade and warm practical lights share a neutral midtone.
      float lum=dot(color,vec3(.2126,.7152,.0722));
      float shade=1.-smoothstep(.045,.47,lum);
      color*=mix(vec3(1.015,1.,.988),vec3(.916,.979,1.045),shade);
      gl_FragColor=vec4(max(color,vec3(0.)),1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      float grain=fract(52.9829189*fract(dot(gl_FragCoord.xy+fract(clock)*37.,vec2(.06711056,.00583715))));
      gl_FragColor.rgb=clamp((gl_FragColor.rgb-.42)*1.035+.42+(grain-.5)*.004,0.,1.);
    }`;

  class CinderFrame {
    constructor(renderer) {
      this.renderer=renderer;
      this.ready=false;
      if (!renderer.capabilities.isWebGL2 || !renderer.extensions.has('EXT_color_buffer_float')) return;
      const gl=renderer.getContext();
      const colorSamples=Array.from(gl.getInternalformatParameter(gl.RENDERBUFFER,gl.RGBA16F,gl.SAMPLES)||[]);
      const depthSamples=Array.from(gl.getInternalformatParameter(gl.RENDERBUFFER,gl.DEPTH_COMPONENT24,gl.SAMPLES)||[]);
      const count=colorSamples.find(v=>v>0 && v<=4 && depthSamples.includes(v));
      if (!count) return;
      const options={type:T.HalfFloatType,minFilter:T.LinearFilter,magFilter:T.LinearFilter,generateMipmaps:false};
      this.full=new T.WebGLRenderTarget(1,1,{...options,samples:count});
      this.full.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);
      this.full.depthTexture.format=T.DepthFormat;
      this.glow=new T.WebGLRenderTarget(1,1,{...options,depthBuffer:false});
      this.scratch=this.glow.clone();
      this.extract=material(extract,{source:{value:this.full.texture},size:{value:new T.Vector2()}});
      this.blur=material(blur,{source:{value:null},axis:{value:new T.Vector2()}});
      this.combine=material(composite,{
        sceneColor:{value:this.full.texture},sceneDepth:{value:this.full.depthTexture},
        glow:{value:this.glow.texture},pixel:{value:new T.Vector2()},clip:{value:new T.Vector2(.055,330)},clock:{value:0}
      },true);
      this.scene=new T.Scene();
      this.cam=new T.Camera();
      const geo=new T.BufferGeometry();
      geo.setAttribute('position',new T.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));
      geo.setAttribute('uv',new T.Float32BufferAttribute([0,0,2,0,0,2],2));
      this.triangle=new T.Mesh(geo,this.combine);
      this.triangle.frustumCulled=false;
      this.scene.add(this.triangle);
      this.ready=true;
    }
    size(w,h) {
      if (!this.ready || (this.full.width===w && this.full.height===h)) return;
      const gw=Math.max(1,Math.ceil(w/4)), gh=Math.max(1,Math.ceil(h/4));
      this.full.setSize(w,h);
      this.glow.setSize(gw,gh);this.scratch.setSize(gw,gh);
      this.verifyTarget=true;
      this.extract.uniforms.size.value.set(1/w,1/h);
      this.combine.uniforms.pixel.value.set(1/w,1/h);
    }
    pass(shader,target) {
      this.triangle.material=shader;
      this.renderer.setRenderTarget(target);
      this.renderer.render(this.scene,this.cam);
    }
    render(scene,camera,time) {
      const r=this.renderer;
      r.setRenderTarget(this.full);
      if (this.verifyTarget) {
        this.verifyTarget=false;
        const gl=r.getContext();
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE) {
          throw new Error('HDR framebuffer unavailable.');
        }
      }
      r.render(scene,camera);
      this.pass(this.extract,this.glow);
      const bu=this.blur.uniforms;
      bu.source.value=this.glow.texture;bu.axis.value.set(1.7/this.glow.width,0);
      this.pass(this.blur,this.scratch);
      bu.source.value=this.scratch.texture;bu.axis.value.set(0,1.7/this.glow.height);
      this.pass(this.blur,this.glow);
      this.combine.uniforms.clock.value=time;
      this.combine.uniforms.clip.value.set(camera.near,camera.far);
      this.pass(this.combine,null);
    }
    dispose() {
      if (!this.full) return;
      this.ready=false;
      this.full.dispose();this.glow.dispose();this.scratch.dispose();
      this.extract.dispose();this.blur.dispose();this.combine.dispose();this.triangle.geometry.dispose();
    }
  }
  window.CinderFrame=CinderFrame;
})();
