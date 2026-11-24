/* Original parametric studies. All geometry is generated locally. */
(function formaSculptureModule() {
  'use strict';
  const TAU = Math.PI * 2;
  const { sin, cos, abs, pow, min, max } = Math;
  const workerScope=typeof document==='undefined';
  const script=workerScope?null:document.currentScript;
  const base=script && script.src ? new URL('.',script.src).href : workerScope?'':document.baseURI;
  const presets = {
    bloom: { dark: [0.15, 0.006, 0.060], mid: [0.95, 0.215, 0.32], light: [1.0, 0.78, 0.65], tilt: -0.56, turn: -0.28, roll: -0.45 },
    orbit: { dark: [0.09, 0.043, 0.20], mid: [0.52, 0.41, 0.78], light: [0.94, 0.88, 1.0], tilt: -0.25, turn: 0.12, roll: -0.56 },
    strata: { dark: [0.18, 0.047, 0.035], mid: [0.84, 0.365, 0.17], light: [1.0, 0.86, 0.64], tilt: 0.59, turn: -0.34, roll: -0.13 }
  };
  const cache = new Map();
  function normalized(a) {
    const length = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / length, a[1] / length, a[2] / length];
  }
  function cross(a, b) {
    return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  }
  function dot(a,b) { return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; }
  function diff(a,b) { return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]; }
  function build(name) {
    if (cache.has(name)) return cache.get(name);
    const data = [], triangles = [];
    const stride = 20;
    function patch(nu, nv, surface, fiber, shade, rig, tangentInU = false) {
      const first = data.length / stride;
      for (let i=0; i<=nu; ++i) {
        const u=i/nu, u0=max(0,u-.0002), u1=min(1,u+.0002);
        for (let j=0; j<=nv; ++j) {
          const v=j/nv, v0=max(0,v-.0002), v1=min(1,v+.0002);
          const point=surface(u,v);
          const du=diff(surface(u1,v),surface(u0,v));
          const dv=diff(surface(u,v1),surface(u,v0));
          const normal=normalized(cross(du,dv));
          const tangent=normalized(tangentInU?du:dv);
          data.push(...point,...normal,...tangent, fiber(u,v),shade(u,v),1,1,...rig(u,v));
          if (i<nu && j<nv) {
            const a=first+i*(nv+1)+j,b=a+nv+1;
            triangles.push(a,b,a+1,b,b+1,a+1);
          }
        }
      }
    }
    if (name==='bloom') {
      // Ruffled funnels fold around each other. The radius and altitude of
      // their rim vary independently, revealing both faces of the silk.
      const layers=[
        [1,.0,4,.78,-.20],
        [.66,1.06,3,.83,.075],
        [.36,1.93,2,2.18,.24],
        [.152,.68,2,1.1,.39]
      ];
      for(const [scale,rotation,lobes,offset,lift] of layers){
        const surface=(u,s)=>{
          const az=u*TAU, wave=lobes*az+offset+.45*sin(2*az+.23)+.12*sin(az*3-.94);
          const dir=az+rotation+.89*(1-s)+(.42*sin(wave)+.10*sin(2*az+.70))*s*s + .17*cos(wave+.3)*pow(s,3.4);
          const r=scale*((.005+1.114*s+.09*sin(Math.PI*s)-.26*pow(s,4)*(.55+.45*sin(wave+.4)))*(1+.18*s*cos(wave+.41)+.09*sin(2*az+.55)));
          const stretch=s*(1+.16*sin(s*Math.PI));
          const z=lift+scale*(-.42+.79*stretch + .43*sin(wave+.23)*s + .14*cos(2*az+1.2)*s
                  -.25*pow(s,4)*(.76+.63*cos(wave+1.32)));
          return [r*cos(dir)-.07*(1-scale),r*sin(dir)+.09*(1-scale),z];
        };
        patch(Math.round(scale*890),25,surface,(u,s)=>u*Math.round(282*scale) +8.2*sin(s*1.8+TAU*u*2)+s*6.9,
          (u,s)=>.70+.16*s+.045*cos(TAU*u*3+offset)+.095*pow(s,12),
          (u,s)=>[u,s,scale,offset,0,0,0],true);
      }
    } else if (name==='orbit') {
      // An elliptical silk band follows a (2,3) trefoil. The ribbon frame is
      // taken from the curve itself so the folds join seamlessly at the seam.
      const spine=a => {
        const r=.66+.27*cos(3*a);
        return [r*cos(2*a),r*sin(2*a),.37*sin(3*a)];
      };
      const frames=new Map();
      function frame(s) {
        if (frames.has(s)) return frames.get(s);
        const a=TAU*s, p=spine(a), tangent=normalized(diff(spine(a+.0002),spine(a-.0002)));
        const n=normalized(cross(tangent,[0,0,1])), b=normalized(cross(tangent,n));
        const out={a,p,n,b,tangent};
        frames.set(s,out);
        return out;
      }
      const surface=(s,t) => {
        const {a,p,n,b}=frame(s), h=t*TAU;
        const turn=.61*sin(3*a+.3)+.33*cos(2*a)+.34;
        const x=.25*cos(h), y=.077*sin(h);
        const w=x*cos(turn)-y*sin(turn), d=x*sin(turn)+y*cos(turn);
        return [p[0]+n[0]*w+b[0]*d,p[1]+n[1]*w+b[1]*d,p[2]+n[2]*w+b[2]*d];
      };
      patch(256,40,surface,(u,v)=>u*410+1.1*sin(v*TAU), (u,v)=>.77+.12*cos(u*TAU*2+.3),
        u=>{const f=frame(u);return [...f.p,u,...f.tangent];},true);
    } else {
      // Successive real bevelled contours form the exposed strata. Their
      // winding ridgeline shifts as each contour rises toward the summit.
      const count=39;
      for(let i=0;i<count;i++) {
        const h=i/(count-.35), taper=pow(1-pow(h,1.48),.70);
        const profile=[.002,.971,1.005,1.016,.997,.96,.002];
        const height=[0,0,.10,.42,.87,1,1];
        const surface=(u,v)=>{
          const n=v*6, k=min(5,Math.floor(n)), f=n-k;
          const lip=profile[k]*(1-f)+profile[k+1]*f;
          const y=height[k]*(1-f)+height[k+1]*f;
          const a=TAU*u;
          const carve=.42*pow((1+cos(a-1.4-.4*sin(h*4)))*.5,12);
          const contour=1+.15*cos(3*a+h*2.85)+.11*sin(5*a-h*2.6)+.12*sin(2*a+.6)-carve;
          const r=taper*lip*contour;
          const wave=(.065*sin(3*a+h*.83)+.043*cos(2*a-h*1.8))*r;
          return [r*cos(a)+.23*sin(h*2.35), -0.58+1.27*h+y*.027+wave,
            r*sin(a)*.90 + .19*cos(h*2.92)-.12];
        };
        patch(114,6,surface,(u,v)=>v*1.4+.12*cos(TAU*u*3)+h,
          (u,v)=>.58+.24*h+.22*v,(u,v)=>[u,h,v,0,0,0,0]);
      }
    }
    // Normalize the silhouette in model space. This keeps all three studies
    // at similar scale without cropping when the viewport changes shape.
    const lo=[Infinity,Infinity,Infinity], hi=[-Infinity,-Infinity,-Infinity];
    for(let i=0;i<data.length;i+=stride) for(let j=0;j<3;j++){
      lo[j]=min(lo[j],data[i+j]); hi[j]=max(hi[j],data[i+j]);
    }
    const scale=2/max(hi[0]-lo[0],hi[1]-lo[1]);
    for(let i=0;i<data.length;i+=stride) for(let j=0;j<3;j++){
      const origin=(lo[j]+hi[j])*.5;
      data[i+j]=(data[i+j]-origin)*scale;
      if(name==='orbit')data[i+13+j]=(data[i+13+j]-origin)*scale;
    }
    bakeOcclusion(data,triangles,stride,[-.52,.72,1],11);
    bakeOcclusion(data,triangles,stride,[.20,.28,1],12);
    const p=presets[name], view=rotation(p.tilt,p.turn,p.roll);
    let left=Infinity,right=-Infinity,bottom=Infinity,top=-Infinity;
    for(let i=0;i<data.length;i+=stride){
      const x=data[i],y=data[i+1],z=data[i+2];
      const w=1-(x*view[2]+y*view[5]+z*view[8])*.092;
      const sx=(x*view[0]+y*view[3]+z*view[6])/w, sy=(x*view[1]+y*view[4]+z*view[7])/w;
      left=min(left,sx);right=max(right,sx);bottom=min(bottom,sy);top=max(top,sy);
    }
    const mesh = {vertices:new Float32Array(data),indices:new Uint16Array(triangles),
      center:[(left+right)/2,(bottom+top)/2], scale:1.86/max(right-left,top-bottom)};
    if(name==='orbit')mesh.framing=frameTrefoil(data,stride);
    cache.set(name,mesh);
    return mesh;
  }
  // The same module runs as a dedicated mesh worker. The Blob source also
  // works when the complete exhibition is delivered as one offline HTML file.
  if(workerScope){
    self.onmessage=event=>{
      const name=event.data;
      const mesh=build(name);
      self.postMessage({name,mesh},[mesh.vertices.buffer,mesh.indices.buffer]);
      cache.delete(name);
    };
    return;
  }
  let worker=null,workerUnavailable=false;
  const pending=new Map();
  function acquire(name){
    if(cache.has(name))return Promise.resolve(cache.get(name));
    if(pending.has(name))return pending.get(name).promise;
    if(!worker && !workerUnavailable){
      let url;
      try{
        const source='('+formaSculptureModule.toString()+')()';
        url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
        worker=new Worker(url);
        worker.onmessage=({data})=>{
          cache.set(data.name,data.mesh);
          pending.get(data.name).resolve(data.mesh);
          pending.delete(data.name);
        };
        worker.onerror=()=>{
          worker.terminate();worker=null;workerUnavailable=true;
          for(const [key,job] of pending)job.resolve(build(key));
          pending.clear();
        };
      }catch{
        workerUnavailable=true;
      }finally{
        if(url)URL.revokeObjectURL(url);
      }
    }
    if(!worker)return Promise.resolve().then(()=>build(name));
    let resolve;
    const promise=new Promise(done=>{resolve=done;});
    pending.set(name,{promise,resolve});
    worker.postMessage(name);
    return promise;
  }
  function bakeOcclusion(data,indices,stride,direction,slot) {
    const size=150, count=data.length/stride;
    const depth=new Float32Array(size*size).fill(-8);
    const light=normalized(direction), bx=normalized(cross([0,1,0],light)), by=cross(light,bx);
    const x=new Float32Array(count),y=new Float32Array(count),z=new Float32Array(count);
    for(let i=0;i<count;i++){
      const p=data.slice(i*stride,i*stride+3);
      x[i]=(dot(p,bx)*.32+.5)*size; y[i]=(dot(p,by)*.32+.5)*size; z[i]=dot(p,light);
    }
    for(let i=0;i<indices.length;i+=3){
      const a=indices[i],b=indices[i+1],c=indices[i+2],ax=x[a],ay=y[a];
      const ux=x[b]-ax,uy=y[b]-ay,vx=x[c]-ax,vy=y[c]-ay,area=ux*vy-uy*vx;
      if(abs(area)<1e-7) continue;
      const x0=max(0,Math.ceil(min(ax,x[b],x[c]))),x1=min(size-1,Math.floor(max(ax,x[b],x[c])));
      const y0=max(0,Math.ceil(min(ay,y[b],y[c]))),y1=min(size-1,Math.floor(max(ay,y[b],y[c])));
      for(let row=y0;row<=y1;row++) for(let col=x0;col<=x1;col++){
        const u=((col-ax)*vy-(row-ay)*vx)/area,v=(ux*(row-ay)-uy*(col-ax))/area;
        if(u<0||v<0||u+v>1)continue;
        const index=row*size+col;
        depth[index]=max(depth[index],z[a]+u*(z[b]-z[a])+v*(z[c]-z[a]));
      }
    }
    for(let i=0;i<count;i++){
      const cx=Math.round(x[i]),cy=Math.round(y[i]);
      let occlusion=0;
      for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){
        const gap=depth[(cy+dy*2)*size+cx+dx*2]-z[i];
        occlusion+=min(1,max(0,(gap-.024)*8));
      }
      data[i*stride+slot]=1-occlusion/25;
    }
  }
  const vertexSource=`
    attribute vec3 aPosition,aNormal,aTangent,aAxis;
    attribute vec4 aSurface,aRig;
    uniform mat3 uRotation;
    uniform vec2 uFit,uCenter,uWave;
    uniform float uScale,uVariant;
    varying vec3 vNormal,vTangent,vPosition;
    varying vec4 vSurface;
    varying float vTrack;
    mat2 turn(float a){
      float c=cos(a),s=sin(a);
      return mat2(c,s,-s,c);
    }
    vec3 twist(vec3 p,vec3 axis,float s,float c){
      return p*c + cross(axis,p)*s + axis*dot(axis,p)*(1.0-c);
    }
    void main(){
      const float tau=6.2831853;
      float beat=uWave.x, lift=uWave.y;
      vec3 p=aPosition,N=aNormal,T=aTangent;
      if(uVariant<.5){
        // The lip and heart wind in opposite directions. Each rolled edge
        // opens in succession as a crest travels around the flower.
        float rim=aRig.y,layer=aRig.z,az=aRig.x*tau;
        float wave=az*3.0+aRig.w+rim*.9;
        float crest=cos(wave)*beat-sin(wave)*lift;
        float swivel=(.66*rim*rim-.34*(1.0-layer))*beat+.18*rim*crest;
        mat2 spin=turn(swivel);
        p.xy=spin*p.xy*(1.0+.135*rim*beat+.04*rim*crest);
        p.z+=layer*rim*(.24*crest-.18*beat);
        vec2 radial=normalize(p.xy+vec2(.0001));
        N.xy=spin*N.xy-radial*N.z*(.28*crest-.20*beat)*rim;
        T.xy=spin*T.xy;
        vTrack=az+rim*.6;
      } else if(uVariant<1.5){
        // The trefoil centerline remains continuous while every elliptical
        // cross-section rolls around its own tangent.
        float along=aRig.w*tau, a=2.0*along+.4;
        float swell=cos(a)*beat-sin(a)*lift;
        float ribbonTurn=.98*swell+.23*beat;
        float s=sin(ribbonTurn),c=cos(ribbonTurn);
        p=aRig.xyz+twist(p-aRig.xyz,aAxis,s,c);
        p.z+=.085*swell;
        N=twist(N,aAxis,s,c);
        T=twist(T,aAxis,s,c);
        vTrack=along;
      } else{
        float h=aRig.y,a=h*5.5;
        float ripple=cos(a)*beat+sin(a)*lift;
        mat2 spin=turn(.31*ripple+.18*h*beat);
        p.xz=spin*p.xz;
        p.x+=.145*ripple;
        p.z+=.060*(sin(a)*beat-cos(a)*lift);
        p.y+=lift*(.255*(h-.43)+.026*(sin(a)*uWave.x+cos(a)*(1.0-uWave.y)));
        N.xz=spin*N.xz;
        T.xz=spin*T.xz;
        vTrack=h*4.5;
      }
      p+=normalize(N)*.0028*cos(aSurface.x*tau);
      p=uRotation*p;
      vNormal=uRotation*N;
      vTangent=uRotation*T;
      vPosition=p; vSurface=aSurface;
      float w=1.0-p.z*.092;
      gl_Position=vec4((p.xy-uCenter*w)*uFit*uScale,-p.z*.28,w);
    }
  `;
  const fragmentSource=`
    precision highp float;
    uniform vec3 uDark,uMid,uLight;
    uniform float uPhase,uVariant;
    varying vec3 vNormal,vTangent,vPosition;
    varying vec4 vSurface;
    varying float vTrack;
    void main(){
      vec3 N=normalize(vNormal), T=normalize(vTangent);
      vec3 V=normalize(vec3(-vPosition.xy*.10,1.0));
      if(dot(N,V)<0.0) N=-N;
      float phase=vSurface.x*6.2831853;
      float bandwidth=clamp(1.0-fwidth(vSurface.x)*.96,.0,1.0);
      float rib=sin(phase)*bandwidth;
      vec3 ribNormal=normalize(N+T*rib*.36);
      vec3 L=normalize(vec3(-.51+.33*sin(uPhase),.77+.18*sin(uPhase*2.0),.96)), H=normalize(L+V);
      float diffuse=dot(normalize(N+T*rib*.23),L)*.5+.5;
      float occlusion=mix(.38,1.0,vSurface.z)*mix(.75,1.0,vSurface.w);
      float t=clamp(pow(diffuse,1.50)*occlusion*vSurface.y*1.23,0.0,1.0);
      vec3 color=mix(uDark,uMid,smoothstep(.09,.70,t));
      color=mix(color,uLight,smoothstep(.52,1.03,t)*.93);
      float gloss=pow(max(0.0,dot(ribNormal,H)),19.0)*vSurface.z*.24;
      float edge=pow(1.0-clamp(dot(N,V),0.0,1.0),3.4);
      float skylight=.31+.69*max(0.0,dot(N,normalize(vec3(.55,.62,-.1))));
      color += uLight*(gloss+edge*skylight*.28);
      color += vec3(.10,.022,.11)*max(0.0,dot(ribNormal,normalize(vec3(.68,-.35,.15))))*vSurface.w;
      float band=pow(.5+.5*cos(vTrack-uPhase),7.0);
      float silk=band*(.18+.82*pow(max(0.0,dot(N,H)),3.0))*vSurface.z;
      vec3 sheen=uVariant>.5 && uVariant<1.5 ? vec3(.47,.71,.88) : uLight;
      color+=sheen*silk*(uVariant>.5 && uVariant<1.5 ? .36:.14);
      color *= 1.0-.064*(.5+.5*cos(phase))*bandwidth;
      gl_FragColor=vec4(color,1.0);
    }
  `;
  function programFor(gl) {
    const shaders=[];
    function compile(type,src) {
      const shader=gl.createShader(type);
      gl.shaderSource(shader,src); gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader));
      shaders.push(shader); return shader;
    }
    const deriv=gl.getExtension('OES_standard_derivatives');
    const prefix=deriv?'#extension GL_OES_standard_derivatives : enable\n':'';
    const fragment=deriv?fragmentSource:fragmentSource.replace('fwidth(vSurface.x)','0.22');
    const p=gl.createProgram();
    gl.attachShader(p,compile(gl.VERTEX_SHADER,vertexSource));
    gl.attachShader(p,compile(gl.FRAGMENT_SHADER,prefix+fragment));
    gl.linkProgram(p);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));
    for (const shader of shaders) gl.deleteShader(shader);
    return p;
  }
  function rotation(a,b,c) {
    const ca=cos(a),sa=sin(a),cb=cos(b),sb=sin(b),cc=cos(c),sc=sin(c);
    return [cc*cb,sc*cb,-sb,cc*sb*sa-sc*ca,sc*sb*sa+cc*ca,cb*sa,cc*sb*ca+sc*sa,sc*sb*ca-cc*sa,cb*ca];
  }
  function frameTrefoil(vertices,stride){
    // Follow the center of the rolling asymmetric knot without letting the
    // longest diagonal brush the edge of the stage.
    const frames=[],p=presets.orbit;
    for(let k=0;k<40;k++){
      const t=k*TAU/40,s=sin(t),lift=1-cos(t);
      const m=rotation(p.tilt+.28*s,p.turn+.72*s+.24*lift,p.roll+t);
      let left=Infinity,right=-Infinity,bottom=Infinity,top=-Infinity;
      for(let i=0;i<vertices.length;i+=stride*2){
        const cx=vertices[i+13],cy=vertices[i+14],cz=vertices[i+15],angle=2*vertices[i+16]*TAU+.4;
        const ax=vertices[i+17],ay=vertices[i+18],az=vertices[i+19];
        const x=vertices[i]-cx,y=vertices[i+1]-cy,z=vertices[i+2]-cz;
        const swell=cos(angle)*s-sin(angle)*lift,twist=.98*swell+.23*s;
        const co=cos(twist),si=sin(twist),along=(ax*x+ay*y+az*z)*(1-co);
        const vx=cx+x*co+(ay*z-az*y)*si+ax*along;
        const vy=cy+y*co+(az*x-ax*z)*si+ay*along;
        const vz=cz+z*co+(ax*y-ay*x)*si+az*along+.085*swell;
        const w=1-.092*(m[2]*vx+m[5]*vy+m[8]*vz);
        const sx=(m[0]*vx+m[3]*vy+m[6]*vz)/w,sy=(m[1]*vx+m[4]*vy+m[7]*vz)/w;
        left=min(left,sx);right=max(right,sx);bottom=min(bottom,sy);top=max(top,sy);
      }
      frames.push([(left+right)/2,(bottom+top)/2,1.84/max(right-left,top-bottom)]);
    }
    return frames;
  }
  const textures=new Map();
  // A compact silhouette envelope of each embedded still, sampled in rows.
  // It keeps the painted fallback framed even in file:// documents, where
  // browsers may prevent reading the decoded image's pixels from a canvas.
  const envelopes={
    bloom:[50,50,50,50,48,57,46,63,44,68,43,73,18,76,13,80,11,83,11,88,12,90,14,91,16,92,14,93,13,95,11,96,9,96,7,97,5,97,4,97,3,96,3,89,3,88,5,87,8,85,47,83,47,80,47,77,49,73,52,68,50,50,50,50],
    orbit:[50,50,38,63,33,68,29,72,27,75,25,77,24,79,23,81,22,82,22,83,17,86,13,89,10,92,8,93,6,95,5,96,4,96,3,97,3,97,3,97,3,97,4,96,5,96,6,95,8,94,10,92,13,90,16,88,21,85,31,81,49,76,50,50],
    strata:[50,50,50,50,50,50,50,50,48,60,41,67,36,72,32,77,29,81,26,85,24,87,22,89,20,91,18,92,16,92,15,93,13,92,11,92,8,92,6,93,3,95,3,95,3,96,5,97,9,97,13,96,18,90,23,40,50,50,50,50,50,50,50,50]
  };
  function frameLattice(points,rows,columns,name,width,height,size){
    const envelope=envelopes[name];
    let left=Infinity,right=-Infinity,bottom=-Infinity,top=Infinity;
    for(let r=0;r<32;r++){
      const l=envelope[r*2],h=envelope[r*2+1];
      if(l===h)continue;
      const gy=(r+.5)*rows/32,row=Math.floor(gy),fy=gy-row;
      for(let step=0;step<=8;step++){
        const gx=(l+(h-l)*step/8)*columns/100,col=min(columns-1,Math.floor(gx)),fx=gx-col;
        const a=2*(row*(columns+1)+col),b=a+2,c=a+(columns+1)*2,d=c+2;
        for(let j=0;j<2;j++){
          const v=fx+fy<=1 ? points[a+j]*(1-fx-fy)+points[b+j]*fx+points[c+j]*fy
            : points[d+j]*(fx+fy-1)+points[c+j]*(1-fx)+points[b+j]*(1-fy);
          if(j===0){left=min(left,v);right=max(right,v);}
          else{top=min(top,v);bottom=max(bottom,v);}
        }
      }
    }
    const zoom=min(1,size*.933/max(right-left,bottom-top));
    const cx=(left+right)/2,cy=(top+bottom)/2;
    for(let i=0;i<points.length;i+=2){
      points[i]=width*.5+(points[i]-cx)*zoom;
      points[i+1]=height*.5+(points[i+1]-cy)*zoom;
    }
  }
  function assetURL(name){
    const file='assets/sculpture-'+name+'.webp';
    if(window.formaAsset)return window.formaAsset(file);
    return script && script.src ? new URL(file,base).href : file;
  }
  function texture(name){
    if(!textures.has(name)){
      const image=new Image();
      image.decoding='async';
      const promise=new Promise(resolve=>{
        image.onload=()=>resolve(image);
        image.onerror=()=>resolve(null);
      });
      image.src=assetURL(name);
      textures.set(name,promise);
    }
    return textures.get(name);
  }

  // The software view projects the artwork through a deformable, UV-mapped
  // lattice. It shares the score with the 3D study, including scrubbing.
  function paintSilk(ctx,image,name,phase,width,height,px,py){
    const size=min(width,height),t=phase*TAU,s=sin(t),c=1-cos(t);
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,width,height);
    if(abs(s)+abs(c)+abs(px)+abs(py)<.00001){
      ctx.drawImage(image,(width-size)*.5,(height-size)*.5,size,size);
      return;
    }
    const columns=name==='strata'?9:13;
    const rows=name==='strata'?22:13;
    const points=new Float32Array((columns+1)*(rows+1)*2);
    const margin=name==='orbit'?1-.10*abs(s)-.015*c:1-.065*abs(s)-.027*c;
    for(let row=0;row<=rows;row++){
      for(let col=0;col<=columns;col++){
        const u=col/columns,v=row/rows;
        const x=u-.5,y=v-.5;
        let dx=x,dy=y;
        if(name==='bloom'){
          const cy=-.10,ey=y-cy,r=min(1.3,Math.hypot(x,ey)*2),a=Math.atan2(ey,x);
          const wave=cos(3*a+r)*s-sin(3*a+r)*c;
          const angle=(.77*r*r-.22)*s+.13*r*wave;
          const co=cos(angle),si=sin(angle),spread=1+.11*s*r+.039*wave*r;
          dx=(x*co-ey*si)*spread;
          dy=cy+(x*si+ey*co)*spread+.035*r*wave;
        }else if(name==='orbit'){
          const radius=Math.hypot(x,y)*2;
          const a=t+.15*(cos(x*5-y*3)*s-sin(x*5-y*3)*c);
          const co=cos(a),si=sin(a);
          const bend=.047*(cos(y*7)*s-sin(y*7)*c);
          const fx=x*(1-.18*abs(s))+bend*min(1,radius);
          const fy=y+.037*(cos(x*6)*s-sin(x*6)*c);
          dx=fx*co-fy*si;
          dy=fx*si+fy*co;
        }else{
          const h=1-v,a=h*5.1;
          const wave=cos(a)*s+sin(a)*c;
          dx=x+.092*wave+.032*s*(v-.5);
          dy=y*(1+.15*c)-.021*c+.020*wave*cos(x*4);
        }
        const i=(row*(columns+1)+col)*2;
        const tiltX=px*(.014+.023*(1-min(1,4*(x*x+y*y))));
        const tiltY=py*(.010+.016*(1-min(1,4*(x*x+y*y))));
        points[i]=width*.5+(dx*margin+tiltX)*size;
        points[i+1]=height*.5+(dy*margin+tiltY)*size;
      }
    }
    frameLattice(points,rows,columns,name,width,height,size);
    const cellW=image.width/columns,cellH=image.height/rows;
    function triangle(ia,ib,ic,sx,sy,direction,left,top){
      const x=points[ia],y=points[ia+1];
      const xB=points[ib],yB=points[ib+1],xC=points[ic],yC=points[ic+1];
      const centerX=(x+xB+xC)/3, centerY=(y+yB+yC)/3;
      const pad=1+1.45/min(size/columns,size/rows);
      const a=(xB-x)/(cellW*direction),b=(yB-y)/(cellW*direction);
      const cc=(xC-x)/(cellH*direction),d=(yC-y)/(cellH*direction);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX+(x-centerX)*pad,centerY+(y-centerY)*pad);
      ctx.lineTo(centerX+(xB-centerX)*pad,centerY+(yB-centerY)*pad);
      ctx.lineTo(centerX+(xC-centerX)*pad,centerY+(yC-centerY)*pad);
      ctx.closePath();ctx.clip();
      ctx.setTransform(a,b,cc,d,x-a*sx-cc*sy,y-b*sx-d*sy);
      // Include a one-texel gutter so adjacent transformed cells share an edge.
      const l=max(0,left-1.5),r=min(image.width,left+cellW+1.5);
      const h=max(0,top-1.5),bottom=min(image.height,top+cellH+1.5);
      ctx.drawImage(image,l,h,r-l,bottom-h,l,h,r-l,bottom-h);
      ctx.restore();
    }
    for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
      const a=2*(row*(columns+1)+col),b=a+2,f=a+2*(columns+1),d=f+2;
      const x=col*cellW,y=row*cellH;
      triangle(a,b,f,x,y,1,x,y);
      triangle(d,f,b,x+cellW,y+cellH,-1,x,y);
    }
    // A broad travelling softbox is masked by the warped silhouette.
    const center=width*.5+size*.47*sin(t-.9), soft=size*.28;
    const light=ctx.createLinearGradient(center-soft,height*.34,center+soft,height*.62);
    const rgb=name==='orbit'?'188,224,255':name==='strata'?'255,226,169':'255,196,188';
    light.addColorStop(0,'rgba('+rgb+',0)');
    light.addColorStop(.50,'rgba('+rgb+','+(.115*(abs(s)+c*.35))+')');
    light.addColorStop(1,'rgba('+rgb+',0)');
    ctx.globalCompositeOperation='source-atop';
    ctx.fillStyle=light;ctx.fillRect(0,0,width,height);
    ctx.globalCompositeOperation='source-over';
  }

  function mount(canvas,options={}) {
    let name=presets[options.variant]?options.variant:'bloom';
    const external=options.externalClock===true;
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    const abort=new AbortController(),signal=abort.signal;
    let override=null,phase=0,rate=1,paused=false,destroyed=false,visible=true;
    let frame=0,previous=0,lastDraw=0,px=0,py=0,tx=0,ty=0;
    let width=canvas.clientWidth,height=canvas.clientHeight;
    let gl=null,program=null,glSurface=null,vertexBuffer=null,indexBuffer=null,uniforms=null,mesh=null;
    let startRequested=false,poster=null,softwareSurface=null,softwareContext=null;
    let bitmap=null,display=null;
    // A single public canvas remains the animation and transition target.
    // Both backends present to it, so a lost or partially initialized WebGL
    // context can fall back without replacing a focused/animated DOM element.
    if(typeof OffscreenCanvas!=='undefined' && OffscreenCanvas.prototype.transferToImageBitmap){
      try{bitmap=canvas.getContext('bitmaprenderer');}catch{}
    }
    if(!bitmap)display=canvas.getContext('2d',{alpha:true});
    function surface(){
      return bitmap?new OffscreenCanvas(1,1):document.createElement('canvas');
    }
    function resizeSurface(target,w,h){
      if(target.width!==w || target.height!==h){target.width=w;target.height=h;}
    }
    function present(source,w,h,backend){
      resizeSurface(canvas,w,h);
      if(bitmap)bitmap.transferFromImageBitmap(source.transferToImageBitmap());
      else if(source!==canvas && display){
        display.setTransform(1,0,0,1,0,0);display.clearRect(0,0,w,h);display.drawImage(source,0,0);
      }
      if(canvas.dataset.renderer!==backend){
        canvas.dataset.renderer=backend;
        canvas.style.backgroundImage='none';
      }
    }
    function loadPoster(){
      const requested=name;
      poster=null;
      canvas.style.background='url("'+assetURL(name)+'") center / contain no-repeat';
      canvas.dataset.renderer='poster';
      texture(name).then(image=>{
        if(destroyed||requested!==name)return;
        poster=image;sync();
      });
    }
    function canMove(){return override===null?!motion.matches:override;}
    function draw(){
      if(destroyed || !visible || document.hidden || !width || !height)return;
      const now=performance.now();
      if(!paused && canMove()){
        const ease=lastDraw?1-Math.exp(-.005*min(60,now-lastDraw)):0;
        px+=(tx-px)*ease;py+=(ty-py)*ease;
      }
      lastDraw=now;
      if(gl && program && mesh && !gl.isContextLost()){
        const ratio=min(window.devicePixelRatio||1,1.65,1280/max(width,height));
        const w=max(1,Math.round(width*ratio)),h=max(1,Math.round(height*ratio));
        resizeSurface(glSurface,w,h);
        gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        const p=presets[name],t=phase*TAU,s=sin(t),c=1-cos(t);
        let pitch=p.tilt+py*.20,yaw=p.turn+px*.25,roll=p.roll,scale=mesh.scale,center=mesh.center;
        if(name==='orbit'){
          pitch+=.28*s;yaw+=.72*s+.24*c;roll+=t;
          const keys=mesh.framing,n=phase*keys.length,i=Math.floor(n)%keys.length,f=n-Math.floor(n);
          const a=keys[i],b=keys[(i+1)%keys.length];
          center=[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f];
          scale=min(mesh.scale,a[2]+(b[2]-a[2])*f);
        }else if(name==='bloom'){
          pitch+=.22*s-.075*c;yaw+=.27*s+.095*c;roll+=.13*s;
          scale*=1-.105*abs(s)-.035*c;
        }else{
          pitch+=.09*s;yaw+=.58*s+.15*c;
          scale*=1-.055*abs(s)-.071*c;
        }
        gl.uniformMatrix3fv(uniforms.Rotation,false,rotation(pitch,yaw,roll));
        gl.uniform2f(uniforms.Fit,min(1,h/w),min(1,w/h));
        gl.uniform2fv(uniforms.Center,center);
        gl.uniform1f(uniforms.Scale,scale*(1-.045*max(abs(px),abs(py))));
        gl.uniform1f(uniforms.Phase,t);
        gl.uniform2f(uniforms.Wave,s,c);
        gl.uniform1f(uniforms.Variant,name==='bloom'?0:name==='orbit'?1:2);
        gl.uniform3fv(uniforms.Dark,p.dark);gl.uniform3fv(uniforms.Mid,p.mid);gl.uniform3fv(uniforms.Light,p.light);
        gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_SHORT,0);
        present(glSurface,w,h,'webgl');
        return;
      }
      if(!poster || (!display && !bitmap))return;
      if(!softwareSurface){
        softwareSurface=bitmap?surface():canvas;
        softwareContext=bitmap?softwareSurface.getContext('2d',{alpha:true}):display;
      }
      if(!softwareContext)return;
      const ratio=min(window.devicePixelRatio||1,1.35,960/max(width,height));
      const w=max(1,Math.round(width*ratio)),h=max(1,Math.round(height*ratio));
      resizeSurface(softwareSurface,w,h);
      paintSilk(softwareContext,poster,name,phase,w,h,px,py);
      present(softwareSurface,w,h,'canvas2d');
    }
    function loadMesh(){
      if(!program)return;
      const requested=name;
      function attach(next){
        if(destroyed || requested!==name || !program || gl.isContextLost())return;
        mesh=next;
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);
        sync();
      }
      if(cache.has(name))attach(cache.get(name));
      else acquire(name).then(attach);
    }
    function initialize(){
      if(destroyed || (!display && !bitmap))return;
      try{
        if(!glSurface){
          glSurface=surface();
          glSurface.addEventListener('webglcontextlost',event=>{
            event.preventDefault();program=null;mesh=null;sync();
          },{signal});
          glSurface.addEventListener('webglcontextrestored',initialize,{signal});
        }
        gl=glSurface.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true,powerPreference:'high-performance'});
        if(!gl){sync();return;}
        program=programFor(gl);gl.useProgram(program);gl.enable(gl.DEPTH_TEST);
        vertexBuffer=gl.createBuffer();indexBuffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
        for(const [key,length,offset] of [['aPosition',3,0],['aNormal',3,3],['aTangent',3,6],['aSurface',4,9],['aRig',4,13],['aAxis',3,17]]){
          const loc=gl.getAttribLocation(program,key);
          gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,length,gl.FLOAT,false,20*4,offset*4);
        }
        uniforms={};
        for(const key of ['Rotation','Fit','Scale','Center','Dark','Mid','Light','Phase','Wave','Variant'])uniforms[key]=gl.getUniformLocation(program,'u'+key);
        loadMesh();
      }catch{
        program=null;mesh=null;sync();
      }
    }
    function startWhenVisible(){
      if(startRequested || destroyed || !visible || document.hidden || !canMove())return;
      startRequested=true;
      requestAnimationFrame(()=>{
        if('requestIdleCallback' in window)window.requestIdleCallback(initialize,{timeout:120});
        else setTimeout(initialize,0);
      });
    }
    function animate(stamp){
      frame=0;
      if(external || destroyed || !visible || document.hidden || paused || !canMove())return;
      if(previous)phase=(phase+min(.12,(stamp-previous)/1000)*rate/8)%1;
      previous=stamp;draw();frame=requestAnimationFrame(animate);
    }
    function sync(){
      if(frame)cancelAnimationFrame(frame);
      frame=0;previous=0;
      if(!visible || document.hidden || destroyed)return;
      startWhenVisible();draw();
      if(!external && !paused && canMove())frame=requestAnimationFrame(animate);
    }
    const wrapper=canvas.parentElement||canvas;
    wrapper.addEventListener('pointermove',event=>{
      if(event.pointerType==='touch' || paused || !canMove())return;
      const r=canvas.getBoundingClientRect();
      tx=max(-1,min(1,2*(event.clientX-r.left)/r.width-1));
      ty=max(-1,min(1,2*(event.clientY-r.top)/r.height-1));
    },{passive:true,signal});
    wrapper.addEventListener('pointerleave',()=>{tx=ty=0;},{signal});
    document.addEventListener('visibilitychange',sync,{signal});
    motion.addEventListener('change',()=>{if(!canMove()){px=py=tx=ty=0;}sync();},{signal});
    const resize=new ResizeObserver(()=>{
      width=canvas.clientWidth;height=canvas.clientHeight;sync();
    });
    resize.observe(canvas);
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});
    observer.observe(canvas);
    loadPoster();sync();
    return {
      setVariant(next){
        if(!presets[next] || next===name || destroyed)return;
        name=next;mesh=null;loadPoster();loadMesh();sync();
      },
      setPaused(value){if(paused!==Boolean(value)){paused=Boolean(value);sync();}},
      setMotionAllowed(value){
        const next=value==null?null:Boolean(value);
        if(override!==next){override=next;if(!canMove())px=py=tx=ty=0;sync();}
      },
      setRate(value){if(Number.isFinite(value))rate=min(4,max(0,value));},
      seek(value){
        if(!Number.isFinite(value) || destroyed)return;
        phase=((value%1)+1)%1;
        draw();
      },
      destroy(){
        if(destroyed)return;
        destroyed=true;abort.abort();resize.disconnect();observer.disconnect();
        if(frame)cancelAnimationFrame(frame);
        if(gl){gl.deleteBuffer(vertexBuffer);gl.deleteBuffer(indexBuffer);gl.deleteProgram(program);}
      }
    };
  }
  window.FormaSculpture={mount};
})();
