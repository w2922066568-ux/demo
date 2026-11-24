/* Cinderline lead-carbine and industrial drone assets. All distances are in metres. */
(() => {
  'use strict';
  const T = window.THREE;
  const PI = Math.PI, HALF = PI / 2;
  const pool = new Map();
  const cache = new Map();
  const scratch = new T.Object3D();
  const normalMatrix = new T.Matrix3();
  const v = new T.Vector3();
  const p = new T.Vector3();
  const tint = new T.Color();
  const white = 0xffffff;
  const paint = 0xa7ae9e, dark = 0x283339, iron = 0x596668;
  const edge = 0x899394, trim = 0xbd5828, black = 0x192020;
  const cyan = 0x6effe8, amber = 0xffa247;
  let library;

  function canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }
  function generator(seed) {
    return () => {
      seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }
  function texture(c) {
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    return t;
  }
  function materials() {
    if (library) return library;
    const rnd = generator(7041);
    const grain = canvas(256, 256), ctx = grain.getContext('2d');
    const pixels = ctx.createImageData(256, 256);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const amount = 214 + rnd() * 40;
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = amount;
      pixels.data[i + 3] = 255;
    }
    ctx.putImageData(pixels, 0, 0);
    for (let j = 0; j < 175; j++) {
      const x = rnd() * 256, y = rnd() * 256;
      ctx.strokeStyle = rnd() < 0.63 ? 'rgba(38,39,35,.68)' : 'rgba(255,255,239,1)';
      ctx.lineWidth = rnd() * 1.3 + 0.30;
      ctx.beginPath(); ctx.moveTo(x, y);
      ctx.lineTo(x + rnd() * 19, y + rnd() * 9 - 4); ctx.stroke();
    }
    const worn = texture(grain);
    const prepared = t => {t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;return t;};
    prepared(worn);
    const maps=window.CinderSurfaceMaps;
    if(maps && maps.metalcolor) {
      const photo=new Image();
      photo.onload=()=>{
        ctx.save(); ctx.globalCompositeOperation='multiply'; ctx.globalAlpha=.47;
        ctx.filter='grayscale(1) contrast(.8) brightness(1.55)';
        ctx.drawImage(photo,0,0,256,256);ctx.restore();worn.needsUpdate=true;
      };
      photo.src=maps.metalcolor;
    }
    const brushed=canvas(256,256), br=brushed.getContext('2d');
    br.fillStyle='#c5c5c5';br.fillRect(0,0,256,256);
    for(let j=0;j<620;j++){
      const lum=Math.round(150+rnd()*100);
      br.fillStyle='rgb('+lum+','+lum+','+lum+')';
      br.fillRect(rnd()*256,rnd()*256,4+rnd()*64,.45+rnd()*1.6);
    }
    const rough=prepared(new T.CanvasTexture(brushed));
    const weave=canvas(128,128), wc=weave.getContext('2d'), threads=wc.createImageData(128,128);
    for(let y=0;y<128;y++)for(let x=0;x<128;x++){
      const k=(x+y*128)*4, warp=((x>>2)+(y>>2))%2===0;
      const thread=(warp ? x%4 : y%4);
      const lum=([158,208,245,193][thread])+rnd()*10-(x%32<1||y%32<1?35:0);
      threads.data[k]=lum;threads.data[k+1]=lum;threads.data[k+2]=lum;threads.data[k+3]=255;
    }
    wc.putImageData(threads,0,0);
    const clothMap=prepared(texture(weave));
    const softboxes = Array.from({length: 6}, (_, face) => {
      const c = canvas(128,128), b = c.getContext('2d');
      const grad = b.createLinearGradient(0,0,0,128);
      grad.addColorStop(0, face === 3 ? '#352d26' : '#d4e4eb');
      grad.addColorStop(.35, '#717e85'); grad.addColorStop(.53, '#364146');
      grad.addColorStop(.66, '#88857a'); grad.addColorStop(1, '#333232');
      b.fillStyle = grad; b.fillRect(0,0,128,128);
      b.fillStyle = face === 0 || face === 5 ? '#ffd8a8' : '#d4e7e9';
      b.fillRect(face % 2 ? 13 : 78, 9, 15, 62);
      return c;
    });
    const env = new T.CubeTexture(softboxes);
    env.colorSpace = T.SRGBColorSpace; env.needsUpdate = true;
    const metal = new T.MeshStandardMaterial({vertexColors:true, map:worn,roughnessMap:rough,
      bumpMap:worn,bumpScale:.00085,envMap:env,envMapIntensity:1.35,metalness:.52,roughness:.53});
    const polymer = new T.MeshStandardMaterial({vertexColors:true,map:worn,
      envMap:env,envMapIntensity:.46,metalness:.09,roughness:.78});
    const cloth = new T.MeshStandardMaterial({vertexColors:true,map:clothMap,bumpMap:clothMap,
      bumpScale:.00038,envMap:env,envMapIntensity:.43,metalness:.02,roughness:.90});
    const glow = new T.MeshBasicMaterial({vertexColors:true,toneMapped:false});

    const sheet = canvas(1024,512), b = sheet.getContext('2d');
    const labels = [
      ['VX–7', 'ARC CARBINE  /  FOUNDRY SERIES'], ['CINDERLINE', 'THERMAL SYSTEMS DIVISION'],
      ['CAUTION', 'INDUCTION CIRCUIT   ///   HIGH FLUX'], ['07', 'FIELD UNIT'],
      ['OBSERVER', 'AUTONOMOUS SITE PATROL'], ['HV-09', 'POWER CARTRIDGE'],
      ['LOCK', 'PUSH TO ISOLATE'], ['HEAVY', 'INDUSTRIAL RESPONSE UNIT']
    ];
    labels.forEach(([title, detail], i) => {
      const x = i % 2 * 512, y = Math.floor(i / 2) * 128;
      b.fillStyle = i === 0 || i === 4 ? '#17221f' : '#d3d5be';
      b.font = 'bold 73px Arial'; b.fillText(title, x + 9, y + 77, 488);
      b.font = 'bold 18px monospace'; b.fillText(detail, x + 10, y + 106, 489);
      b.fillRect(x + 11, y + 119, 105, 3);
      for (let j = 0; j < 23; j++) b.fillRect(x + 300 + j*7, y + 115, j%3+1, 8);
    });
    const ink = new T.MeshBasicMaterial({map:texture(sheet),transparent:true,
      depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,vertexColors:true});
    const haze = canvas(128,128), h = haze.getContext('2d');
    const radial = h.createRadialGradient(64,64,0,64,64,64);
    radial.addColorStop(0,'rgba(255,252,230,.95)'); radial.addColorStop(.1,'rgba(255,241,207,.65)');
    radial.addColorStop(.22,'rgba(255,225,182,.23)'); radial.addColorStop(.52,'rgba(255,245,218,.07)');
    radial.addColorStop(1,'rgba(255,255,255,0)');
    h.fillStyle = radial; h.fillRect(0,0,128,128);
    library = {metal,polymer,cloth,glow,ink,halo:texture(haze)};
    return library;
  }
  function halo(color,size) {
    const sprite = new T.Sprite(new T.SpriteMaterial({map:materials().halo,color,
      blending:T.AdditiveBlending,transparent:true,depthWrite:false,toneMapped:false}));
    sprite.scale.setScalar(size);
    return sprite;
  }
  function primitive(key, create) {
    if (!pool.has(key)) {
      const shape = create();
      pool.set(key,shape.index ? shape.toNonIndexed() : shape);
      if (shape.index) shape.dispose();
    }
    return pool.get(key);
  }
  const square = () => primitive('cube',() => new T.BoxGeometry(1,1,1));
  function cylinder(n,top=1) {
    return primitive('c'+n+'/'+top,() => new T.CylinderGeometry(top,1,1,n));
  }
  function ball(n) {return primitive('s'+n,() => new T.SphereGeometry(1,n,Math.max(5,n>>1)));}
  function ring(rad,n) {return primitive('r'+rad+'/'+n,() => new T.TorusGeometry(1,rad,7,n));}
  function octagon(w,h,b) {
    return [[-w+b,-h],[w-b,-h],[w,-h+b],[w,h-b],[w-b,h],[-w+b,h],[-w,h-b],[-w,-h+b]];
  }
  // A linear run of octagonal frames forms milled chamfers, flares and stamped panels.
  // Stations hold z, full width, full height, vertical center and corner cut.
  function profile(stations) {
    const pts = [], uvs = [];
    const rings = stations.map(([z,w,h,y=0,b=Math.min(w,h)*.17]) =>
      octagon(w/2,h/2,Math.min(b,w/2*.95,h/2*.95)).map(([x,dy]) => [x,y+dy,z]));
    function tri(a,b,c,uv) {
      pts.push(...a,...b,...c); uvs.push(...uv);
    }
    const uvA=[0,0,1,0,1,1], uvB=[0,0,1,1,0,1];
    for (let j=0;j<rings.length-1;j++) for(let i=0;i<8;i++) {
      const k=(i+1)%8, a=rings[j], b=rings[j+1];
      tri(a[i],a[k],b[k],uvA); tri(a[i],b[k],b[i],uvB);
    }
    for(let i=1;i<7;i++){
      tri(rings[0][0],rings[0][i+1],rings[0][i],uvA);
      const end=rings[rings.length-1]; tri(end[0],end[i],end[i+1],uvA);
    }
    const g=new T.BufferGeometry();
    g.setAttribute('position',new T.Float32BufferAttribute(pts,3));
    g.setAttribute('uv',new T.Float32BufferAttribute(uvs,2)); g.computeVertexNormals();
    return g;
  }
  class Parts {
    constructor() { this.data = new Map(); }
    add(shape,kind,color,position=[0,0,0],scale=[1,1,1],rotation=[0,0,0],atlas) {
      if (!this.data.has(kind)) this.data.set(kind,{p:[],n:[],uv:[],color:[]});
      const o=this.data.get(kind), a=shape.attributes;
      scratch.position.fromArray(position); scratch.scale.fromArray(scale);
      scratch.rotation.set(...rotation);
      scratch.updateMatrix(); normalMatrix.getNormalMatrix(scratch.matrix);
      tint.set(color);
      for(let i=0;i<a.position.count;i++) {
        p.fromBufferAttribute(a.position,i).applyMatrix4(scratch.matrix); o.p.push(p.x,p.y,p.z);
        v.fromBufferAttribute(a.normal,i).applyMatrix3(normalMatrix).normalize(); o.n.push(v.x,v.y,v.z);
        let shine=1;
        if(kind==='metal' && shape.userData.milled) {
          const ax=Math.abs(a.normal.getX(i)),ay=Math.abs(a.normal.getY(i)),az=Math.abs(a.normal.getZ(i));
          if(Math.max(ax,ay,az)<.925)shine=1.30;
        }
        o.color.push(tint.r*shine,tint.g*shine,tint.b*shine);
        const u=a.uv.getX(i), w=a.uv.getY(i);
        if(atlas!==undefined)o.uv.push((atlas%2+u)/2,(3-Math.floor(atlas/2)+w)/4);
        else if(kind==='metal'||kind==='polymer'||kind==='cloth') {
          const scale=kind==='cloth'?22:5.3,ax=Math.abs(v.x),ay=Math.abs(v.y),az=Math.abs(v.z);
          if(ax>=ay&&ax>=az)o.uv.push(p.z*scale,p.y*scale);
          else if(ay>=az)o.uv.push(p.z*scale,p.x*scale);
          else o.uv.push(p.x*scale,p.y*scale);
        } else o.uv.push(u,w);
      }
    }
    box(color,pos,size,rot,kind='metal') {
      const [w,h,d]=size, cut=Math.min(w,h,d)*.16;
      if(kind==='metal' && cut>.0008){
        const g=primitive('ch'+size.join(','),()=>profile([
          [-d/2,w-2*cut,h-2*cut,0,cut*.5],[-d/2+cut,w,h,0,cut],
          [d/2-cut,w,h,0,cut],[d/2,w-2*cut,h-2*cut,0,cut*.5]
        ]));
        g.userData.milled=true;this.add(g,kind,color,pos,undefined,rot);
      }else this.add(square(),kind,color,pos,size,rot);
    }
    rod(color,pos,r,length,rot,n=12,kind='metal',taper=1) {
      this.add(cylinder(n,taper),kind,color,pos,[r,length,r],rot);
    }
    torus(color,pos,r,t,rot,n=28,kind='metal') {this.add(ring(t,n),kind,color,pos,[r,r,r],rot);}
    oval(color,pos,size,rot,kind='metal',n=14) {this.add(ball(n),kind,color,pos,size,rot);}
    shell(color,frames,pos,rot,kind='metal') {
      const g=profile(frames);g.userData.milled=true;this.add(g,kind,color,pos,undefined,rot);g.dispose();
    }
    label(n,pos,w,h,rot) {
      this.add(primitive('plane',()=>new T.PlaneGeometry(1,1)),'ink',white,pos,[w,h,1],rot,n);
    }
    link(color,from,to,r,kind='metal',n=8) {
      const a=new T.Vector3(...from), b=new T.Vector3(...to), span=b.clone().sub(a);
      const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),span.clone().normalize());
      const rot=new T.Euler().setFromQuaternion(q);
      this.rod(color,a.lerp(b,.5).toArray(),r,span.length(),[rot.x,rot.y,rot.z],n,kind);
    }
    build(shadows=false) {
      const out=new T.Group(), mats=materials();
      this.data.forEach((o,kind) => {
        const g=new T.BufferGeometry();
        g.setAttribute('position',new T.Float32BufferAttribute(o.p,3));
        g.setAttribute('normal',new T.Float32BufferAttribute(o.n,3));
        g.setAttribute('color',new T.Float32BufferAttribute(o.color,3));
        g.setAttribute('uv',new T.Float32BufferAttribute(o.uv,2)); g.computeBoundingSphere();
        const m=new T.Mesh(g,mats[kind]); m.castShadow=shadows && kind==='metal';
        m.receiveShadow=shadows && kind!=='ink'; out.add(m);
      });
      return out;
    }
  }
  function cached(key,create) {
    if(!cache.has(key)) cache.set(key,create());
    return cache.get(key).clone(true);
  }
  function carbine() {
    const b=new Parts(), axial=[HALF,0,0], lateral=[0,0,HALF];
    // Emitter cage and ceramic induction sleeves.
    b.rod(black,[0,.008,-.49],.033,.38,axial,16);
    for (const [z,r,len,c] of [
      [-.677,.039,.039,iron],[-.651,.047,.022,dark],[-.612,.041,.045,trim],
      [-.571,.047,.024,iron],[-.531,.043,.035,black],[-.489,.041,.033,trim]
    ]) b.rod(c,[0,.008,z],r,len,axial,12);
    b.rod(0x343532,[0,.008,-.698],.026,.009,axial,16);
    b.torus(0xe49b57,[0,.008,-.703],.020,.12,undefined,24);
    b.rod(0x18201d,[0,.008,-.703],.015,.004,axial);
    for(let i=0;i<4;i++){
      const a=i*HALF+PI*.25, x=Math.cos(a)*.037, y=Math.sin(a)*.037+.008;
      b.box(iron,[x,y,-.629],[.014,.014,.072],[0,0,a]);
    }
    b.shell(dark,[[-.517,.081,.091,.012],[-.492,.103,.118,.009],[-.19,.111,.131,.005],[-.167,.099,.142,.001]]);
    for(let side of [-1,1]){
      // Layered shroud plates above the open cooling channel.
      b.shell(paint,[[-.5,.009,.039,.023],[-.468,.018,.069,.02],[-.251,.022,.071,.02],[-.218,.015,.04,.027]],
        [side*.052,0,0]);
      b.box(iron,[side*.059,-.019,-.355],[.016,.01,.228]);
      b.box(dark,[side*.060,.026,-.353],[.008,.021,.209]);
      for(let i=0;i<6;i++){
        const z=-.449+i*.034;
        b.box(iron,[side*.066,.027,z],[.007,.030,.011],[.38,0,0]);
        b.box(0x132222,[side*.069,.028,z+.007],[.002,.016,.003],[.38,0,0]);
      }
      b.box(trim,[side*.065,.055,-.428],[.006,.006,.074]);
      b.rod(iron,[side*.056,-.042,-.351],.011,.265,axial,10);
      b.rod(0xb48d6f,[side*.032,-.053,-.328],.007,.306,axial,8);
    }
    b.shell(black,[[-.48,.065,.034,-.050],[-.452,.077,.047,-.051],[-.228,.084,.054,-.048],[-.193,.064,.046,-.046]],undefined,undefined,'polymer');
    for(let i=0;i<11;i++) b.box(0x424947,[0,-.070,-.452+i*.021],[.082,.018,.009],undefined,'polymer');

    // Receiver, raised spine and overlaid service panels.
    b.shell(iron,[[-.239,.096,.131,.005],[-.210,.123,.155,.004],[.092,.133,.153,.012],[.14,.119,.141,.009],[.173,.101,.107,.003]]);
    b.shell(paint,[[-.209,.113,.056,.046],[-.184,.132,.079,.048],[.076,.138,.081,.052],[.13,.118,.055,.054]]);
    b.shell(0x475357,[[-.199,.114,.044,-.032],[-.172,.135,.056,-.031],[.099,.137,.066,-.025],[.151,.116,.049,-.028]]);
    for(let s of [-1,1]){
      b.shell(0x8e9b91,[[-.206,.008,.045,.045],[-.18,.017,.067,.044],[-.015,.018,.062,.045],[.007,.009,.031,.044]],
        [s*.066,0,0]);
      b.shell(dark,[[-.019,.016,.056,.042],[.001,.021,.079,.047],[.087,.021,.073,.049],[.116,.011,.041,.042]],
        [s*.066,0,0]);
      b.box(0x111a1b,[s*.077,.055,.040],[.008,.022,.082]);
      b.box(0x697779,[s*.082,.052,.033],[.008,.008,.045]);
      for(let i=0;i<3;i++) b.box(0x97aa9f,[s*.077,.005,-.164+i*.021],[.003,.008,.013]);
      for(const [z,y] of [[-.463,.04],[-.245,.043],[-.184,.065],[-.151,.016],[-.03,.063],[.012,.016],[.092,.067],[.134,-.032]]){
        const x=Math.abs(z)>.24?.062:.077;
        b.rod(0x444e4c,[s*x,y,z],.0059,.007,lateral,8);
        b.rod(0xa9b6a9,[s*(x+.0039),y,z],.0035,.0018,lateral,6);
        b.box(dark,[s*(x+.005),y,z],[.001,.0016,.005],[.6,0,0]);
      }
      b.box(trim,[s*.07,-.022,-.089],[.004,.013,.065]);
      b.box(0xdeaa76,[s*.073,-.021,-.075],[.003,.014,.006],[.3,0,0]);
    }
    b.label(0,[-.076,.045,-.103],.135,.044,[0,-HALF,0]);
    b.label(1,[.077,.046,-.101],.14,.037,[0,HALF,0]);
    b.label(2,[-.073,-.028,.039],.089,.023,[0,-HALF,0]);
    b.box(dark,[0,.091,-.128],[.074,.019,.471]);
    for(let i=0;i<19;i++){
      b.box(0x5c6765,[0,.104,-.347+i*.023],[.08,.011,.012]);
      if(i%3===0) b.box(edge,[-.035,.109,-.347+i*.023],[.008,.002,.009]);
    }

    // Adjustable stock, heel pad and rearward-facing charge monitor.
    b.rod(0x4a5656,[0,.002,.224],.043,.215,axial,12);
    b.rod(iron,[0,-.046,.227],.017,.173,axial,10);
    for(let i=0;i<4;i++) b.rod(black,[0,.002,.179+i*.017],.045,.009,axial,14);
    b.shell(0x56625f,[[.211,.076,.050,.029],[.238,.10,.073,.034],[.299,.115,.09,.031],[.357,.097,.105,.009]]);
    b.shell(0x323d3e,[[.234,.085,.038,.065],[.255,.11,.044,.067],[.32,.11,.044,.064],[.35,.095,.028,.058]],undefined,undefined,'polymer');
    b.shell(black,[[.344,.099,.102,.011],[.358,.118,.148,-.006],[.383,.112,.15,-.009],[.389,.096,.134,-.011]],undefined,undefined,'polymer');
    for(let i=0;i<6;i++) b.box(0x3c4440,[0,-.064+i*.022,.385],[.103,.009,.009],undefined,'polymer');
    for(let s of [-1,1]) {
      b.link(iron,[s*.041,-.012,.219],[s*.046,-.051,.347],.009);
      b.rod(black,[s*.056,.021,.296],.015,.007,lateral,12);
      b.rod(edge,[s*.06,.021,.296],.007,.003,lateral,8);
    }
    // Thermopolymer controls and curved removable power cartridge.
    b.shell(dark,[[-.169,.092,.058,-.089],[-.15,.104,.066,-.085],[-.06,.101,.061,-.081],[-.047,.079,.044,-.085]]);
    b.box(0x343f3e,[0,-.14,-.113],[.074,.133,.084],[-.16,0,0],'polymer');
    for(let i=0;i<4;i++) b.box(0x626a61,[0,-.111-i*.022,-.113-i*.003],[.078,.008,.086],[-.16,0,0]);
    b.box(0x8e502f,[0,-.205,-.125],[.081,.024,.093],[-.16,0,0]);
    b.label(5,[-.041,-.15,-.121],.056,.037,[0,-HALF,-.15]);
    b.box(black,[0,-.132,.10],[.065,.161,.069],[.31,0,0],'polymer');
    for(let i=0;i<5;i++) b.box(0x3e4946,[0,-.096-i*.022,.093+i*.005],[.07,.009,.075],[.31,0,0],'polymer');
    b.link(iron,[0,-.08,-.043],[0,-.137,-.023],.006);
    b.link(dark,[0,-.137,-.023],[0,-.14,.068],.006);
    b.link(iron,[0,-.081,.024],[0,-.119,.040],.0055);

    // Reflex optic with a square hood, open aperture, etched indexing and elevation dial.
    b.box(dark,[0,.115,-.042],[.086,.018,.117]);
    b.box(black,[0,.127,-.043],[.092,.015,.087],undefined,'polymer');
    for(const s of [-1,1]){
      b.box(iron,[s*.043,.158,-.060],[.012,.065,.061],[0,0,s*.08]);
      b.box(0x9aa398,[s*.046,.179,-.058],[.006,.023,.059],[0,0,s*.08]);
      b.box(dark,[s*.039,.183,-.061],[.006,.014,.063]);
      b.rod(black,[s*.051,.145,-.043],.013,.013,lateral,14);
      b.rod(iron,[s*.057,.145,-.043],.009,.002,lateral,12);
      b.box(cyan,[s*.032,.130,-.009],[.011,.003,.003],undefined,'glow');
    }
    b.box(iron,[0,.19,-.06],[.090,.013,.062]);
    b.box(dark,[0,.195,-.059],[.068,.005,.054]);
    for(let i=0;i<5;i++) b.box(0x9fa99e,[.029,.199,-.077+i*.008],[.009,.001,.002]);
    b.box(0x273737,[0,.141,-.088],[.061,.011,.005]);
    b.box(0xa2ffe5,[0,.159,-.091],[.0022,.0022,.001],undefined,'glow');
    b.shell(dark,[[.101,.093,.053,.04],[.121,.104,.064,.043],[.151,.089,.057,.040],[.159,.078,.048,.037]]);
    // The angled field display is offset from the bolt so the charge state stays visible at hip level.
    const monitorRot=[-.63,-.64,0];
    b.box(black,[-.069,.094,.080],[.089,.056,.018],monitorRot,'polymer');
    b.box(iron,[-.073,.098,.085],[.087,.053,.009],monitorRot);
    b.box(trim,[-.107,.102,.063],[.005,.036,.014],monitorRot);
    for(let i=0;i<4;i++) {
      b.box(0x8e9691,[-.043,.063,.142+i*.014],[.016,.004,.007],[0,0,.32]);
      b.box(0x75817b,[.046,.053,.211+i*.028],[.009,.006,.015],undefined,'polymer');
    }
    b.label(6,[0,.073,.282],.057,.021,[-HALF,0,0]);
    b.box(0x41504e,[0,.088,.287],[.077,.005,.063],undefined,'polymer');
    b.label(5,[0,.091,.287],.070,.030,[-HALF,0,0]);
    b.label(3,[-.055,.038,.299],.047,.028,[0,-HALF,0]);
    const chips=generator(712);
    for(let i=0;i<45;i++){
      const z=chips()*.217-.174, side=i%2?1:-1, len=.0008+chips()*.011;
      b.box(i%4===0?0xc6c5af:0x616b63,[side*.055,.0912,z],[.0011+chips()*.0017,.0007,len]);
    }
    for(let i=0;i<17;i++){
      const z=-.478+chips()*.221;
      b.box(i%3?0xb9bdae:0x70796e,[-.061,.055,z],[.0011,.002,.002+chips()*.011]);
    }

    // Articulated textile gloves. Palm pads and knuckles remain legible in silhouette.
    const rubber=0x323934, textile=0x505744;
    b.oval(textile,[.049,-.115,.108],[.055,.076,.066],[.20,-.2,-.16],'cloth');
    b.oval(0x2c332e,[.045,-.150,.151],[.052,.057,.066],[.28,0,0],'polymer');
    for(let i=0;i<3;i++){
      b.oval(rubber,[-.008,-.112-i*.022,.085+i*.006],[.053,.016,.024],[.04,0,.13],'polymer');
      b.oval(0x74765f,[-.043,-.110-i*.022,.087+i*.006],[.015,.012,.018],undefined,'polymer');
    }
    b.oval(textile,[.029,-.092,.040],[.044,.013,.048],[-.06,.20,.16],'cloth');
    b.oval(rubber,[.058,-.064,.117],[.03,.018,.043],undefined,'polymer');
    b.link(0x363d35,[.06,-.154,.148],[.125,-.235,.29],.05,'cloth',12);
    b.rod(0x2d332e,[.094,-.191,.207],.055,.066,[-.89,.18,-.29],14,'polymer');
    b.oval(textile,[-.047,-.09,-.353],[.043,.038,.084],[-.1,-.05,-.54],'cloth');
    b.oval(0x2a3330,[-.075,-.093,-.328],[.029,.037,.048],undefined,'polymer');
    for(let i=0;i<4;i++){
      const z=-.409+i*.029;
      b.oval(textile,[.021,-.082,z],[.045,.018,.017],[0,.08,-.3],'cloth');
      b.oval(rubber,[.049,-.060,z-.005],[.016,.026,.014],[0,0,-.22],'polymer');
      b.oval(0x70715c,[-.071,-.074,z],[.011,.011,.014],undefined,'polymer');
    }
    b.oval(textile,[-.064,-.035,-.323],[.017,.018,.049],[.3,0,.14],'cloth');
    b.link(textile,[-.071,-.108,-.312],[-.193,-.202,-.184],.046,'cloth',12);
    b.link(rubber,[-.091,-.126,-.29],[-.108,-.139,-.270],.05,'polymer',12);
    b.link(0x4b5148,[-.177,-.186,-.202],[-.292,-.29,-.05],.061,'cloth',12);
    // Outer gauntlet and canvas sleeve ride over the wrist instead of meeting in a hard seam.
    b.oval(0x464e45,[-.177,-.19,-.202],[.056,.051,.098],[.52,-.61,.04],'cloth',16);
    b.oval(0x303936,[-.148,-.148,-.235],[.048,.025,.063],[.54,-.61,.12],'polymer');
    for(let i=0;i<3;i++){
      const t=i*.018;
      b.link(i===1?0x777c66:0x414a3f,[-.182-t,-.19-t*.85,-.194+t*1.3],
        [-.185-t,-.193-t*.85,-.189+t*1.3],.059+t*.07,'polymer',14);
    }
    b.oval(0x596050,[-.247,-.25,-.119],[.061,.062,.116],[.53,-.66,.10],'cloth',16);
    b.box(0x323a36,[-.162,-.15,-.235],[.043,.012,.067],[.54,-.61,.1],'polymer');
    b.box(0x616d61,[-.165,-.141,-.237],[.033,.006,.053],[.54,-.61,.1]);
    for(let i=0;i<3;i++) b.box(0x99a39a,[-.17+i*.007,-.139,-.238-i*.005],[.002,.004,.023],[.54,-.61,.1]);
    for(let i=0;i<13;i++){
      const f=i/13;
      b.link(0x878874,[-.183-f*.085,-.145-f*.082,-.185+f*.114],
        [-.185-f*.085,-.147-f*.082,-.182+f*.114],.0018,'polymer',5);
    }
    return b.build();
  }
  class CinderArms {
    constructor(camera) {
      this.camera=camera; this.group=new T.Group(); camera.add(this.group);
      this.group.add(cached('carbine',carbine));
      this.motion=0; this.phase=0; this.aim=0; this.run=0; this.recoil=0;
      this.timeToFlash=0; this.reloadTime=0; this.clock=0; this.ammo=30;
      this.lookX=0; this.lookY=0; this.swing=0;
      const plasma=new Parts();
      plasma.rod(0xfff1bc,[0,0,-.052],.019,.11,[-HALF,0,0],7,'glow',.06);
      for(let i=0;i<4;i++){
        const a=i*HALF+.2, x=Math.cos(a), y=Math.sin(a);
        plasma.link(amber,[x*.007,y*.007,-.001],[x*.037,y*.037,-.065],.003,'glow',5);
      }
      this.flash=plasma.build(); this.flash.position.set(0,.008,-.708);
      this.flashLight=halo(0xffb656,.26); this.flash.add(this.flashLight);
      this.group.add(this.flash); this.flash.visible=false;
      this.display=canvas(256,128); this.lcd=texture(this.display);
      this.lcdMesh=new T.Mesh(new T.PlaneGeometry(.067,.038),new T.MeshBasicMaterial({
        map:this.lcd,toneMapped:false
      }));
      this.lcdMesh.position.set(-.076,.101,.090); this.lcdMesh.rotation.set(-.63,-.64,0);
      this.group.add(this.lcdMesh);
      this.lens=new T.Mesh(new T.PlaneGeometry(.071,.048),new T.MeshBasicMaterial({
        color:0x79b7ac,transparent:true,opacity:.10,depthWrite:false,side:T.DoubleSide
      }));
      this.lens.position.set(0,.158,-.085); this.group.add(this.lens);
      const moving=new Parts();
      moving.rod(0x414d4b,[-.083,.055,.045],.009,.040,[0,0,HALF],10);
      moving.box(iron,[-.102,.055,.045],[.014,.021,.042]);
      this.latch=moving.build(); this.group.add(this.latch);
      this.drawCharge(); this.update(0,{});
    }
    drawCharge() {
      const c=this.display.getContext('2d'), low=this.ammo<7;
      c.fillStyle='#122a29'; c.fillRect(0,0,256,128);
      c.fillStyle=low?'#ffc080':'#a3ffde';
      c.font='bold 91px monospace'; c.fillText(String(this.ammo).padStart(2,'0'),10,91);
      c.font='bold 20px monospace'; c.fillText('ARC',155,47); c.fillText('VX-7',149,76);
      for(let i=0;i<15;i++){
        c.fillStyle=i<Math.ceil(this.ammo/2)?(low?'#ed8044':'#60d2b3'):'#30514c';
        c.fillRect(12+i*15,106,12,7);
      }
      this.lcd.needsUpdate=true;
    }
    fire() {
      this.recoil=Math.min(1.65,this.recoil+.98); this.timeToFlash=.065;
      this.swing=(Math.random()-.5)*.045;
      this.ammo=Math.max(0,this.ammo-1); this.drawCharge();
    }
    reload() {this.reloadTime=1.38;}
    update(dt,state={}) {
      dt=Math.min(dt,.06); this.clock+=dt;
      const a=1-Math.exp(-dt*13);
      this.aim+=((state.aiming?1:0)-this.aim)*a;
      this.run+=((state.sprinting?1:0)-this.run)*a;
      const stride=Math.min(1,Math.max(0,Number(state.moving)||0));
      this.motion+=(stride-this.motion)*a;
      this.lookX+=((state.lookX||0)-this.lookX)*a; this.lookY+=((state.lookY||0)-this.lookY)*a;
      this.phase+=dt*(8.1+this.run*3.9); this.timeToFlash-=dt;
      const reload=this.reloadTime>0?Math.sin(PI*Math.min(1,this.reloadTime/1.38)):0;
      if(this.reloadTime>0 && (this.reloadTime-=dt)<=0 && state.ammo===undefined) {
        this.ammo=30; this.drawCharge();
      }
      if(Number.isFinite(state.ammo) && state.ammo!==this.ammo){this.ammo=state.ammo;this.drawCharge();}
      this.recoil*=Math.exp(-dt*14);
      this.flash.visible=this.timeToFlash>0;
      if(this.flash.visible){
        this.flash.rotation.z=this.clock*93;
        this.flash.scale.setScalar(.60+Math.max(0,this.timeToFlash)*7.5);
      }
      const hip=1-this.aim, bob=this.motion*(1-.85*this.aim);
      const breath=Math.sin(this.clock*1.8)*.0016;
      const run=this.run*hip;
      // Narrow windows use a central hip pose so the silhouette stays in frame.
      const aspect=Math.min(1,Math.max(.40,this.camera.aspect/1.35));
      this.group.position.set(
        .231*hip*aspect+Math.sin(this.phase)*.009*bob-.038*run+.021*reload-this.lookX*.28,
        -.158-.050*hip+breath+Math.sin(this.phase*2)*.005*bob-.038*run-.100*reload+this.recoil*.004,
        -.30-.160*hip+this.recoil*.041-.048*reload);
      this.group.rotation.set(.035*hip+this.recoil*.096-.24*reload-this.lookY*.65,
        .13*hip+.37*run-.19*reload+this.swing*this.recoil-this.lookX*.75,
        -.038*hip+.020*Math.sin(this.phase)*bob-.24*run-.71*reload);
      this.latch.position.z=this.recoil*.048;
    }
    dispose() {
      this.group.removeFromParent();
      this.flashLight.material.dispose(); this.lcdMesh.geometry.dispose();
      this.lcdMesh.material.dispose(); this.lcd.dispose(); this.lens.geometry.dispose(); this.lens.material.dispose();
      for(const group of [this.flash,this.latch]) group.children.forEach(m=>{if(m.isMesh)m.geometry.dispose();});
    }
  }
  function airframe(heavy) {
    const b=new Parts(), axial=[HALF,0,0], lateral=[0,0,HALF];
    const armor=heavy?0xaf7449:0x9aa49c, secondary=heavy?0x66564b:0x586865;
    // Narrow avionics tail, polygonal main hull, armored eyebrow.
    b.shell(dark,[[-.68,.23,.15,.04],[-.45,.39,.21,.045],[-.28,.60,.37,.02],
      [.04,.66,.43,.024],[.27,.56,.36,.034],[.43,.38,.26,.040]]);
    b.shell(armor,[[-.38,.34,.07,.166],[-.24,.54,.125,.202],[.04,.61,.145,.215],
      [.27,.52,.086,.199],[.395,.38,.055,.162]]);
    b.shell(secondary,[[-.35,.34,.07,-.116],[-.20,.53,.105,-.151],[.19,.45,.106,-.137],[.32,.32,.077,-.094]]);
    for(const s of [-1,1]){
      b.shell(secondary,[[-.32,.085,.13],[-.21,.136,.208],[-.007,.156,.267],[.19,.13,.22],[.29,.079,.16]],[s*.27,-.003,0]);
      b.shell(trim,[[-.277,.055,.055,.01],[-.177,.078,.074,.012],[.123,.089,.072,-.016],[.22,.05,.047,-.001]],[s*.325,.008,0]);
      for(let i=0;i<5;i++) b.box(0x263031,[s*.334,.094,-.204+i*.048],[.036,.077,.022],[.36,0,s*.18]);
      b.label(4,[s*.264,.241,-.090],.228,.062,[-HALF,0,s*HALF]);
      b.box(0xe7ae71,[s*.157,.274,-.048],[.023,.004,.202],[-.04,0,.10*s]);
      for(let j=0;j<2;j++) b.rod(iron,[s*.282,.118,.093-j*.24],.023,.03,lateral,8);
      // Twin arms tie the fan nacelles to an open, triangulated support.
      b.link(iron,[s*.26,.062,.16],[s*.69,.005,.194],.050);
      b.link(black,[s*.21,-.05,-.238],[s*.65,.012,-.153],.063);
      b.link(0xb88651,[s*.22,.014,-.096],[s*.64,-.047,.153],.017);
      b.link(secondary,[s*.22,-.079,-.23],[s*.53,-.23,-.31],.038);
      b.link(iron,[s*.53,-.23,-.31],[s*.55,-.23,-.46],.026);
      b.box(dark,[s*.536,-.235,-.416],[.073,.04,.173]);
      b.rod(dark,[s*.76,.025,.025],.102,.145,undefined,12);
      b.rod(trim,[s*.76,.105,.025],.071,.035,undefined,10);
      b.rod(iron,[s*.76,.124,.025],.045,.009,undefined,8);
      b.torus(iron,[s*.76,.054,.025],.345,.105,axial,32);
      b.torus(dark,[s*.76,-.032,.025],.345,.095,axial,32);
      for(let j=0;j<8;j++){
        const a=j*PI*.25, x=s*.76+Math.sin(a)*.342, z=.025+Math.cos(a)*.342;
        b.box(j%4===0?trim:secondary,[x,.012,z],[.142,.13,.040],[0,a,0]);
        b.rod(black,[x,.079,z],.011,.008,undefined,6);
        if(j%2===0)b.link(iron,[s*.76+Math.sin(a)*.066,-.042,.025+Math.cos(a)*.066],
          [x,-.045,z],.011);
      }
      b.box(dark,[s*1.09,.025,.018],[.073,.174,.15]);
      b.box(0xd7a174,[s*1.125,.027,.014],[.016,.103,.099]);
      b.box(heavy?amber:cyan,[s*1.09,.125,.025],[.056,.014,.074],undefined,'glow');
      b.shell(secondary,[[-.390,.035,.051,.163],[-.242,.051,.154,.121],[-.111,.061,.093,.080]],
        [s*.98,.01,0],[0,s*.14,s*-.18]);
      b.box(trim,[s*.989,.177,-.291],[.041,.027,.089],[.31,s*.14,s*-.18]);
      b.rod(black,[s*.151,-.103,-.472],.086,.21,axial,12);
      b.torus(trim,[s*.151,-.103,-.58],.061,.18,undefined,14);
      b.rod(0xe25e29,[s*.151,-.103,-.582],.043,.010,axial,14,'glow');
      b.rod(black,[s*.255,.078,.287],.058,.11,axial,12);
      b.rod(0xffa34b,[s*.255,.078,.346],.030,.010,axial,12,'glow');
    }
    // Gyro-stabilized optical eye with a nested ceramic bezel.
    b.rod(black,[0,.028,.384],.186,.117,axial,20);
    b.rod(iron,[0,.029,.431],.150,.067,axial,16);
    b.torus(0xbf7744,[0,.029,.471],.127,.103,undefined,24);
    b.rod(0x46150c,[0,.029,.464],.110,.024,axial,24);
    b.oval(0xf56328,[0,.029,.479],[.097,.097,.037],undefined,'glow',18);
    b.torus(0xffb653,[0,.029,.499],.081,.065,undefined,28,'glow');
    b.rod(0xffd989,[0,.029,.516],.032,.006,axial,16,'glow');
    b.rod(0xffefab,[0,.029,.52],.016,.007,axial,16,'glow');
    for(let j=0;j<6;j++){
      const a=j*PI/3; b.rod(edge,[.149*Math.cos(a),.029+.149*Math.sin(a),.453],.011,.02,axial,6);
    }
    b.link(iron,[-.128,.12,-.372],[-.18,.37,-.483],.011);
    b.oval(trim,[-.18,.37,-.483],[.023,.016,.023]);
    if(heavy)for(const s of [-1,1]){
      b.shell(armor,[[-.32,.101,.06,.03],[-.21,.217,.12,.04],[.1,.22,.14,.052],[.32,.12,.07,.02]],
        [s*.385,.092,0],[0,s*.15,s*-.23]);
      b.rod(iron,[s*.345,-.16,.101],.082,.225,axial,12);
      b.rod(trim,[s*.345,-.16,.206],.072,.045,axial,12);
      b.rod(0xffb253,[s*.345,-.16,.233],.038,.009,axial,12,'glow');
    }
    return b.build(true);
  }
  function rotor() {
    const b=new Parts();
    for(let i=0;i<7;i++){
      const a=i*2*PI/7;
      b.box(0x465452,[Math.sin(a)*.186,0,Math.cos(a)*.186],[.078,.014,.254],[.10,a+.30,.11]);
      b.box(0xc0a27d,[Math.sin(a)*.291,-.001,Math.cos(a)*.291],[.053,.016,.025],[.10,a+.30,.11]);
    }
    return b.build();
  }
  class CinderDrone {
    constructor(scene,position,type) {
      this.heavy=type==='heavy'||type==='elite'||type===2;
      this.group=new T.Group(); this.group.name=this.heavy?'Heavy response drone':'Observer drone';
      if(position)this.group.position.set(position.x||0,position.y||0,position.z||0);
      scene.add(this.group); this.body=new T.Group(); this.group.add(this.body);
      const air=cached(this.heavy?'heavy-frame':'patrol-frame',()=>airframe(this.heavy));
      this.body.add(air); this.rotors=[];
      for(const s of [-1,1]){
        const blades=cached('rotor',rotor); blades.position.set(s*.76,.029,.025);
        this.body.add(blades); this.rotors.push(blades);
      }
      this.eye=halo(0xff6a27,.77); this.eye.position.set(0,.029,.531); this.body.add(this.eye);
      this.phase=Math.random()*2*PI; this.wound=0;
      if(this.heavy)this.group.scale.setScalar(1.14);
    }
    update(dt,time) {
      this.phase+=dt*2.3; this.wound=Math.max(0,this.wound-dt*5.7);
      const ph=this.phase;
      this.body.position.y=Math.sin(ph)*.056+Math.cos(ph*1.53)*.016;
      this.body.rotation.set(Math.sin(ph*.79)*.035+this.wound*Math.sin(ph*54)*.085,0,
        Math.sin(ph*.86+.6)*.052+this.wound*Math.sin(ph*71)*.13);
      this.rotors[0].rotation.y+=dt*32; this.rotors[1].rotation.y-=dt*34;
      this.eye.scale.setScalar(.69+Math.sin(ph*2)*.045+this.wound*.56);
      this.eye.material.opacity=.8+this.wound*.2;
    }
    hit(){this.wound=1;}
    destroy(){
      this.group.removeFromParent(); this.eye.material.dispose();
    }
  }
  window.CinderArms=CinderArms;
  window.CinderDrone=CinderDrone;
})();
