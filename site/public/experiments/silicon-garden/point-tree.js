// Original point-and-filament renderer inspired by divyashrma18/lily.
// Geometry and projection are specific to Silicon Garden.
(function(){
 function geometry(leaves, wood, hash) {
  const points = [], hairs = [], links = [];
  function put(buffer, position, color, seed) {
   buffer.push(...position, ...color, seed);
  }
  for (const [i, p] of wood.entries()) {
   const light = Math.min(1, Math.max(0, (p.y - 108) / 95));
   const shade = .28 + .7 * p.tone;
   const color = [.63 + .37 * light, .62 + .38 * light, .46 + .54 * light].map(v => v * shade);
   const position = [p.x, p.y, p.z];
   put(points, position, color, hash(i, 0));
   if (p.previous) {
    put(hairs, p.previous, color, p.tone);
    put(hairs, position, color, p.tone);
   }
  }
  for (const [i, p] of leaves.entries()) {
   const color = p.accent > .975 ? [.99,.62,.57] : p.tone > .73 ? [.94,1,1] :
    p.tone > .37 ? [.39,.82,.95] : [.19,.43,.67];
   const dx = Math.cos(p.azimuth) * p.width, dz = Math.sin(p.azimuth) * p.width;
   const count = Math.ceil(p.width * 1.7);
   for (let k = 0; k < count; k++) {
    const seed = hash(i,k,85);
    if (seed < .24) continue;
    const u = k / (count - 1) * 2 - 1;
    const gain = (.53 + .53 * seed) * (1 - .48 * Math.abs(u));
    put(points, [p.x + dx*u,p.y + (seed-.5)*.9,p.z + dz*u], color.map(v=>v*gain), seed);
   }
   put(links,[p.x-dx,p.y,p.z-dz],color,p.tone);
   put(links,[p.x+dx,p.y,p.z+dz],color,p.tone);
  }
  return {points:new Float32Array(points),hairs:new Float32Array(hairs),links:new Float32Array(links)};
 }
 const vertex=`
 attribute vec3 position,color;attribute float seed;
 uniform vec2 viewport,rotation;uniform float scale,growth,time,motion,pixelRatio,pointSize,brightness;
 varying vec3 tint;
 void main(){
  vec3 p=position;float weight=smoothstep(80.0,300.0,p.y);
  float t=time;
  vec3 drift=vec3(sin(p.y*.018+t*.55)+.4*sin(p.z*.035+t*.32),sin(p.x*.021+t*.47),cos(p.y*.017+t*.42));
  p+=motion*weight*(2.5*drift+.45*vec3(sin(t*2.3+seed*90.0),cos(t*2.0+seed*70.0),sin(t*1.7+seed*50.0)));
  p*=growth;
  float cy=cos(rotation.x),sy=sin(rotation.x),ce=cos(rotation.y),se=sin(rotation.y);
  float x=p.x*cy+p.z*sy,z=-p.x*sy+p.z*cy;
  float y=-p.y*ce+z*se,depth=z*ce+p.y*se;
  gl_Position=vec4(x*scale*2.0/viewport.x,-.46-y*scale*2.0/viewport.y,-depth/900.0,1.0);
  gl_PointSize=max(1.0,pointSize*pixelRatio*(.85+seed*.3));tint=color*brightness;
 }`;
 const fragment=`precision mediump float;varying vec3 tint;uniform float alpha;void main(){gl_FragColor=vec4(tint,alpha);}`;
 function create(canvas,leaves,wood,hash){
  const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
  if(!gl)return null;
  let ready=false,program,buffers,attrs,uniforms;
  function initialize(){
   const compile=(type,source)=>{const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));return shader;};
   program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
   if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
   attrs={};for(const name of ['position','color','seed'])attrs[name]=gl.getAttribLocation(program,name);
   uniforms={};for(const name of ['viewport','rotation','scale','growth','time','motion','pixelRatio','pointSize','alpha','brightness'])uniforms[name]=gl.getUniformLocation(program,name);
   const data=geometry(leaves,wood,hash);buffers={};
   for(const [name,values] of Object.entries(data)){const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,values,gl.STATIC_DRAW);buffers[name]={buffer,count:values.length/7};}
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
    for(const [name,size,offset] of [['position',3,0],['color',3,12],['seed',1,24]]){gl.enableVertexAttribArray(attrs[name]);gl.vertexAttribPointer(attrs[name],size,gl.FLOAT,false,28,offset);}
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
