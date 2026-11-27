// Original point-and-filament renderer inspired by divyashrma18/lily.
// Geometry and projection are specific to Silicon Garden.
(function(){
 function geometry(leaves,wood,hash){
  const points=[],hairs=[],links=[];
  const put=(arr,p,c,seed,tip=0,vector=[0,0,0])=>arr.push(p[0],p[1],p[2],...c,seed,tip,...vector);
  wood.forEach((p,i)=>{
   for(let k=0;k<9;k++){
    const n=hash(i,k,21),s=.5+p.tone*.4;
    put(points,[p.x+(hash(i,k,22)-.5)*4,p.y+(n-.5)*6,p.z+(hash(i,k,23)-.5)*4],[.58*s,.65*s,.38*s],n);
   }
  });
  leaves.forEach((p,i)=>{
   const light=Math.max(.15,Math.min(1,.72-p.x/650+p.tone*.25-p.layer*.24));
   for(let k=0;k<18;k++){
    const a=hash(i,k,31)*Math.PI*2,r=Math.sqrt(hash(i,k,32))*6;
    const pos=[p.x+Math.cos(a)*r,p.y+(hash(i,k,33)-.5)*9,p.z+Math.sin(a)*r];
    const fleck=hash(i,k,34),s=light*(.62+fleck*.5),c=fleck>.97?[.84*s,.92*s,.62*s]:[.46*s,.7*s,.21*s];
    put(points,pos,c,hash(i,k,35));
   }
   if(i%3===0){
    const seed=hash(i,0,41),length=5+hash(i,0,42)*12;
    const vector=[p.x/244*length,3+seed*8,p.z/244*length];
    const start=[p.x,p.y,p.z],color=[.68,.79,.47];
    put(hairs,start,color,seed,0,vector);put(hairs,start,[.85,.9,.7],seed,1,vector);
   }
  });
  // Fine horizontal threads sit within the volume, like the reference's scan lines.
  const rows=new Map();
  leaves.forEach((p,i)=>{const key=Math.floor(p.y/4);if(!rows.has(key))rows.set(key,[]);rows.get(key).push(i);});
  for(let i=0;i<leaves.length;i+=3){
   const a=leaves[i],row=rows.get(Math.floor(a.y/4)),b=leaves[row[Math.floor(hash(i,0,51)*row.length)]];
   if(Math.abs(a.x-b.x)<22||Math.abs(a.x-b.x)>105)continue;
   const z=Math.min(a.z,b.z)-8,c=[.64,.7,.53];
   put(links,[a.x,a.y,z],c,hash(i,0,52));put(links,[b.x,b.y,z],c,hash(i,0,52));
  }
  return {points:new Float32Array(points),hairs:new Float32Array(hairs),links:new Float32Array(links)};
 }
 const vertex=`
 attribute vec3 position,color,vector;attribute vec2 seedTip;
 uniform vec2 viewport,rotation;uniform float scale,growth,time,motion,pixelRatio,pointSize,brightness;
 varying vec3 tint;varying float fade;
 void main(){
  vec3 p=position;float weight=smoothstep(80.0,300.0,p.y);
  float t=time;float seed=seedTip.x;
  vec3 drift=vec3(sin(p.y*.018+t*.55)+.4*sin(p.z*.035+t*.32),sin(p.x*.021+t*.47),cos(p.y*.017+t*.42));
  p+=motion*weight*(2.5*drift+.45*vec3(sin(t*2.3+seed*90.0),cos(t*2.0+seed*70.0),sin(t*1.7+seed*50.0)));
  p+=seedTip.y*vector*(1.0+motion*.22*sin(t*1.4+seed*40.0));p*=growth;
  float cy=cos(rotation.x),sy=sin(rotation.x),ce=cos(rotation.y),se=sin(rotation.y);
  float x=p.x*cy+p.z*sy,z=-p.x*sy+p.z*cy;
  float y=-p.y*ce+z*se,depth=z*ce+p.y*se;
  gl_Position=vec4(x*scale*2.0/viewport.x,-.46-y*scale*2.0/viewport.y,-depth/900.0,1.0);
  gl_PointSize=max(1.0,pointSize*pixelRatio*(.85+seed*.3));tint=color*brightness;fade=1.0-seedTip.y*.45;
 }`;
 const fragment=`precision mediump float;varying vec3 tint;varying float fade;uniform float alpha;void main(){gl_FragColor=vec4(tint,alpha*fade);}`;
 function create(canvas,leaves,wood,hash){
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
  if(!gl)return null;
  let ready=false,program,buffers,attrs,uniforms;
  function initialize(){
   const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader;};
   program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
   if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
   attrs={};for(const name of ['position','color','seedTip','vector'])attrs[name]=gl.getAttribLocation(program,name);
   uniforms={};for(const name of ['viewport','rotation','scale','growth','time','motion','pixelRatio','pointSize','alpha','brightness'])uniforms[name]=gl.getUniformLocation(program,name);
   const data=geometry(leaves,wood,hash);buffers={};
   for(const [name,values] of Object.entries(data)){const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,values,gl.STATIC_DRAW);buffers[name]={buffer,count:values.length/11};}
   ready=true;
  }
  try{initialize();}catch(error){console.warn('Point renderer unavailable; using canvas fallback.',error);return null;}
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();ready=false;});
  canvas.addEventListener('webglcontextrestored',()=>{try{initialize();}catch{ready=false;}});
  function draw(o){
   if(!ready)return false;
   const w=Math.round(o.width*o.dpr),h=Math.round(o.height*o.dpr);
   if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
   gl.viewport(0,0,w,h);gl.depthMask(true);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   if(o.stage<2||o.growth<.01)return true;
   gl.useProgram(program);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
   gl.uniform2f(uniforms.viewport,o.width,o.height);gl.uniform2f(uniforms.rotation,o.yaw,o.elevation);
   for(const [name,value] of Object.entries({scale:o.scale,growth:o.growth,time:o.time,motion:o.reduced?0:o.sway,brightness:o.style.brightness ?? 1,pixelRatio:o.dpr,pointSize:Math.max(.7,Math.min(1.55,o.scale*1.15))*(o.style.pointSize ?? 1)}))gl.uniform1f(uniforms[name],value);
   function render(name,mode,alpha){
    const b=buffers[name];gl.bindBuffer(gl.ARRAY_BUFFER,b.buffer);
    for(const [name,size,offset] of [['position',3,0],['color',3,12],['seedTip',2,24],['vector',3,32]]){gl.enableVertexAttribArray(attrs[name]);gl.vertexAttribPointer(attrs[name],size,gl.FLOAT,false,44,offset);}
    gl.uniform1f(uniforms.alpha,alpha);gl.drawArrays(mode,0,b.count);
   }
   gl.disable(gl.BLEND);render('points',gl.POINTS,1);
   gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
   render('links',gl.LINES,o.style.linkOpacity ?? .13);render('hairs',gl.LINES,o.style.filamentOpacity ?? .35);return true;
  }
  return {draw};
 }
 globalThis.SiliconPointTree={create,geometry};
})();
