const $ = s => document.querySelector(s);
const canvas = $('#garden'), ctx = canvas.getContext('2d'), scene = $('#scene');
const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = reduceQuery.matches;
let pointRenderer=null;
let variation="silver";
const specimenName=()=>variation==="silver" ? "Silver canopy" : "Filament tree";
let tuning = { tree: {}, wafer: {}, motion: {}, camera: {} };
globalThis.window?.addEventListener('silicon-scene-settings', event => {
 tuning = event.detail;
 requestDraw();
});
function hash(a,b,salt=1){let x=(a*73856093)^(b*19349663)^(salt*83492791);x=Math.imul(x^(x>>>13),1274126177);x^=x>>>16;return (x>>>0)/4294967296;}
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
let width=0,height=0,unit=1,dpr=1,stage=4,growth=1,fromGrowth=1,targetGrowth=1,growAt=0,stageAt=0,stand=0,standFrom=0,standAt=0,busy=false,waterAt=-10000,waterTimer=0,unlockTimer=0,spin=false,yaw=-.14,elevation=.29,zoom=1,lastTime=0,raf=0,pointer=null,moved=false,dirty=true;
const scales=[0,.15,.48,.74,1];
const labels=['water it','a little more','keep going','one last drop','in bloom'];
const descriptions=['Every ecosystem<br>starts somewhere.','A small beginning.<br>A world of potential.','Taking root.<br>Reaching further.','A little patience.<br>A little possibility.','Intelligence blooms.<br>Branch tips glow.'];
const announcements=['','A sprout breaks through the silicon.','It grows into a sapling.','It is a young tree now.','Fully grown. Silver roots rise into blue-white branches.'];
function announce(message){$('#announcement').textContent=message;}
function requestDraw(){dirty=true;if(!raf)raf=requestAnimationFrame(frame);}
function resize(){const box=scene.getBoundingClientRect();width=box.width;height=box.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);unit=Math.min(width/710,height/560);requestDraw();}
new ResizeObserver(resize).observe(scene);
function viewScale(){return unit*zoom*(tuning.camera?.macro ?? 1.15);}
function project(x,y,z){const xx=x*Math.cos(yaw)+z*Math.sin(yaw),zz=-x*Math.sin(yaw)+z*Math.cos(yaw);return{x:width*.5+xx*viewScale(),y:height*.73+(-y*Math.cos(elevation)+zz*Math.sin(elevation))*viewScale(),z:zz*Math.cos(elevation)+y*Math.sin(elevation)};}
// The wafer is a procedural circuit texture, projected as a real plane in 3D.
const texture=document.createElement('canvas');texture.width=texture.height=1200;const tc=texture.getContext('2d');
function makeWafer(){
 tc.clearRect(0,0,1200,1200);tc.save();tc.beginPath();tc.arc(600,600,588,0,Math.PI*2);tc.clip();
 const base=tc.createLinearGradient(70,900,1130,250);[[0,'#152936'],[.13,'#247a87'],[.29,'#78bead'],[.44,'#ccd68c'],[.57,'#e1b760'],[.7,'#bd6d55'],[.84,'#93739c'],[1,'#34356d']].forEach(([s,c])=>base.addColorStop(s,c));tc.fillStyle=base;tc.fillRect(0,0,1200,1200);
 for(let r=0;r<43;r++)for(let c=0;c<26;c++){
  const x=c*47-9,y=r*29-10,n=hash(r,c,2);tc.fillStyle=`hsla(${(c*12-r*8+210)%360},75%,62%,${.06+n*.19})`;tc.fillRect(x+2,y+2,43,25);
  tc.strokeStyle='#152225b0';tc.lineWidth=1.3;tc.strokeRect(x+.5,y+.5,46,28);tc.strokeStyle='#ffefb36b';tc.lineWidth=.65;tc.strokeRect(x+2.5,y+2.5,41,23);
  tc.fillStyle='#102d344a';tc.fillRect(x+5,y+6,19,13);tc.fillStyle='#faf9c935';tc.fillRect(x+6,y+7,17,10);
  tc.strokeStyle='#1329328c';tc.lineWidth=.6;for(let i=0;i<8;i++){tc.beginPath();tc.moveTo(x+27+i*1.8,y+4);tc.lineTo(x+27+i*1.8,y+19);tc.stroke();}
  tc.strokeStyle='#e4e7bb70';for(let i=0;i<6;i++){tc.beginPath();tc.moveTo(x+4,y+20+i*.8);tc.lineTo(x+23,y+20+i*.8);tc.stroke();}
  for(let i=0;i<15;i++){tc.fillStyle=i%3?'#efebb880':'#162f3355';tc.fillRect(x+4+i*2.6,y+2,1,2);tc.fillRect(x+4+i*2.6,y+25,1,2);}
 }
 const gleam=tc.createLinearGradient(0,0,1100,1000);gleam.addColorStop(0,'#ffffff00');gleam.addColorStop(.35,'#ffffff00');gleam.addColorStop(.43,'#e7f4df46');gleam.addColorStop(.5,'#fffbc209');gleam.addColorStop(.65,'#00000000');gleam.addColorStop(1,'#06091b90');tc.fillStyle=gleam;tc.fillRect(0,0,1200,1200);
 tc.restore();tc.strokeStyle='#b1c4ae';tc.lineWidth=2.5;tc.beginPath();tc.arc(600,600,590,0,Math.PI*2);tc.stroke();tc.strokeStyle='#546c6d';tc.lineWidth=7;tc.beginPath();tc.arc(600,600,596,0,Math.PI*2);tc.stroke();tc.fillStyle='#0b0e0c';tc.beginPath();tc.arc(600,1196,8,0,Math.PI*2);tc.fill();tc.fillStyle='#ecf0d099';tc.font='10px monospace';tc.textAlign='center';tc.fillText('SG · 2026 · W01',600,1174);
}
makeWafer();
const waferOptics=globalThis.createWaferOptics?.(texture);
const leaves = [], wood = [];
// Every strand runs continuously from the exposed root flare into a crown fork.
const limbs = [
 [-126, 220, 24], [-94, 278, -46], [-51, 311, 54], [12, 334, -55],
 [109, 322, 18], [157, 285, -25], [105, 235, 72], [33, 260, 111],
 [-65, 247, -105], [70, 300, -83],
];
function spine(limb, t) {
 const fork = clamp((t - .37) / .63);
 const reach = smooth(fork) * (.76 + .24 * fork);
 const bend = Math.sin(fork * Math.PI) * Math.sin(fork * 6 + limb[2] * .05);
 return {
  x: 15 * Math.sin(t * 6.1) + limb[0] * reach + 24 * bend,
  y: t * limb[1],
  z: 9 * Math.sin(t * 7) + limb[2] * reach + 13 * bend,
 };
}
for (const [branch, limb] of limbs.entries()) {
 for (let strand = 0; strand < 9; strand++) {
  const id = branch * 9 + strand;
  const phase = hash(id, 8) * Math.PI * 2;
  const rootDirection = branch * 2.4 + strand * .061;
  let previous;
  for (let i = 0; i <= 112; i++) {
   const t = i / 112, center = spine(limb, t);
   const twist = phase + t * (4 + hash(id, 6) * 5) + .33 * Math.sin(19 * t + phase);
   const radius = (12 + 6 * Math.sin(t * 22 + phase) + 3 * Math.sin(t * 47 + phase)) * (1 - t) + 1;
   const flare = (64 + 75 * hash(id, 7)) * (1 - Math.sqrt(t)) ** 3.7;
   const rootAngle = rootDirection + .33 * Math.sin(t * 34 + phase) + .15 * Math.cos(t * 74 + phase) + t * .65;
   const p = {
    x: center.x + flare * Math.cos(rootAngle) + radius * Math.cos(twist),
    y: center.y + 1.3,
    z: center.z + flare * Math.sin(rootAngle) + radius * Math.sin(twist),
    tone: hash(id, 3), previous,
   };
   wood.push(p);
   previous = [p.x, p.y, p.z];
  }
 }
 // Sparse, staggered scan lines trace each limb and divide into smaller sprays.
 for (let spray = 0; spray < 7; spray++) {
  const id = branch * 7 + spray;
  const azimuth = hash(id, 16) * Math.PI * 2;
  const start = .53 + .28 * hash(id, 4);
  const reach = spray === 0 ? 0 : 14 + 37 * hash(id, 18);
  for (let row = 0; row < 42; row++) {
   if (hash(id, row, 80) < .16) continue;
   const t = row / 41, center = spine(limb, start + (1 - start) * t);
   const width = 2 + 12 * Math.sin(Math.PI * t) + 9 * hash(id, row, 19);
   const offset = reach * t * t + 6 * Math.sin(t * 5 + azimuth) * t;
   const x = center.x + Math.cos(azimuth) * offset;
   const y = center.y + (spray ? 21 * Math.sin(t * Math.PI) - 18 * t : 0);
   const z = center.z + Math.sin(azimuth) * offset;
   leaves.push({ x, y, z, width, azimuth: .32 * Math.sin(azimuth) + branch * .13,
    tone: hash(id, row, 23), accent: hash(id, row, 25) });
  }
 }
}
const sprout=[];
for(let side of [-1,1])for(let i=0;i<14;i++){let t=i/13*Math.PI; sprout.push({x:side*(3+19*Math.sin(t)),y:37+9*Math.cos(t),z:Math.sin(t)*side*5,ch:'()/\\,.'[i%6]});}
const silverGeometry = buildSilverCanopy(hash);
if(globalThis.SiliconPointTree){
 const pointCanvas=document.createElement('canvas');pointCanvas.className='point-tree';pointCanvas.setAttribute('aria-hidden','true');scene.append(pointCanvas);
 pointRenderer=globalThis.SiliconPointTree.create(pointCanvas,leaves,wood,hash,silverGeometry);
}
function discPoint(x,z,offset=0){const angle=stand*Math.PI*.5;return project(x,-z*Math.sin(angle)+170*stand+offset,z*Math.cos(angle));}
function drawWafer(now){
 const origin=discPoint(0,0),u=discPoint(282,0),v=discPoint(0,282);const ax=(u.x-origin.x)/600,ay=(u.y-origin.y)/600,bx=(v.x-origin.x)/600,by=(v.y-origin.y)/600;
 // Soft contact shadow and a thin layered silicon edge.
 if(stand<.9){const p=project(0,-5,0);ctx.save();ctx.translate(p.x,p.y);ctx.scale(1,.24);const sh=ctx.createRadialGradient(0,0,20,0,0,330*viewScale());sh.addColorStop(0,'#000000b0');sh.addColorStop(1,'#00000000');ctx.fillStyle=sh;ctx.fillRect(-350*viewScale(),-350*viewScale(),700*viewScale(),700*viewScale());ctx.restore();}
 ctx.save();ctx.transform(ax,ay,bx,by,origin.x-600*ax-600*bx,origin.y-600*ay-600*by+3*unit);ctx.fillStyle=variation==='silver'?'#565656':'#2b3736';ctx.beginPath();ctx.arc(600,600,597,0,Math.PI*2);ctx.fill();ctx.restore();
 ctx.save();ctx.transform(ax,ay,bx,by,origin.x-600*ax-600*bx,origin.y-600*ay-600*by);const facing = Math.min(1, Math.abs(ax*by-ay*bx)*600*600/(282*viewScale())**2);
 const camera = tuning.camera ?? {};
 const opticalTexture = waferOptics?.(facing, Math.sin(yaw)*.65, {
  phase: reduced ? 0 : Math.floor(now/120)%72,
  foil: (tuning.wafer.shimmer ?? .13)*6.5,
  depth: camera.depth ?? .62,
  grain: camera.grain ?? .09,
  bloom: camera.bloom ?? .32,
  silver: Number(variation === "silver"),
 }) ?? texture;
 if (variation === 'silver' && opticalTexture === texture) ctx.filter='grayscale(1) brightness(.42)';
 ctx.drawImage(opticalTexture,0,0,1200,1200);
 ctx.filter='none';
 if(growth>.1){const shade=ctx.createRadialGradient(600,570,10,600,570,340*growth);shade.addColorStop(0,variation==='silver'?'#08080844':'#061005a0');shade.addColorStop(1,'#06100500');ctx.fillStyle=shade;ctx.fillRect(0,0,1200,1200);}
 if(variation==='silver' && growth>.05 && stand<.01){
  const reflection=ctx.createRadialGradient(600,600,0,600,600,110*growth);
  reflection.addColorStop(0,'#ffffffb0');reflection.addColorStop(.07,'#ffffff60');reflection.addColorStop(.40,'#ffffff14');reflection.addColorStop(1,'#ffffff00');
  ctx.fillStyle=reflection;ctx.fillRect(0,0,1200,1200);
 }
 let elapsed=now-waterAt; if(!reduced&&elapsed<1500)for(let i=0;i<2;i++){let t=(elapsed-300-i*190)/950;if(t>0&&t<1){ctx.strokeStyle=`rgba(171,225,214,${(1-t)*.8})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(600,600,500*t,0,Math.PI*2);ctx.stroke();}}
 ctx.restore();
}
function drawSilverFallback() {
 const tree = tuning.tree;
 ctx.save();
 ctx.strokeStyle = ctx.fillStyle = 'white';
 ctx.lineWidth = Math.max(.45,viewScale()*.68);
 ctx.filter = `brightness(${tree.brightness ?? 1})`;
 for (const [name,opacity] of [['hairs',(tree.filamentOpacity ?? .35)*2],['links',(tree.linkOpacity ?? .13)*4]]) {
  const data=silverGeometry[name];
  ctx.globalAlpha=Math.min(1,opacity);
  ctx.beginPath();
  for(let i=0;i<data.length;i+=14) {
   const a=project(data[i]*growth,data[i+1]*growth,data[i+2]*growth);
   const b=project(data[i+7]*growth,data[i+8]*growth,data[i+9]*growth);
   ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
  }
  ctx.stroke();
 }
 const points=silverGeometry.points, size=Math.max(.65,viewScale()*(tree.pointSize ?? 1));
 ctx.globalAlpha=.84;
 for(let i=0;i<points.length;i+=7) {
  const p=project(points[i]*growth,points[i+1]*growth,points[i+2]*growth);
  ctx.fillRect(p.x,p.y,size,size);
 }
 ctx.restore();
}
function drawRootReflection(){
 // Clip the inverted lower trunk to the projected disc, including low camera angles.
 if (variation !== 'silver' || growth < .05 || stage < 2 || elevation <= 0) return;
 ctx.save();ctx.beginPath();
 for(let i=0;i<=72;i++){
  const theta=i*Math.PI/36, p=discPoint(280*Math.cos(theta),280*Math.sin(theta));
  if(!i)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);
 }
 ctx.clip();
 for(let i=0;i<7;i++){
  ctx.beginPath();
  const length=(38+i*6)*growth;
  const a=project((i-3)*1.8*growth,0,0), b=project((i-3)*1.3*growth,-length,0);
  const reflection=ctx.createLinearGradient(a.x,a.y,b.x,b.y);
  reflection.addColorStop(0,'#ffffff65');reflection.addColorStop(1,'#ffffff00');
  ctx.strokeStyle=reflection;ctx.lineWidth=Math.max(.6,.9*viewScale());
  ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
 }
 ctx.restore();
}
function drawTree(now){
 const rendered=pointRenderer?.draw({variation,width,height,dpr,stage,growth,yaw,elevation,scale:viewScale(),time:reduced?0:now*.001,reduced,style:tuning.tree,sway:tuning.motion.sway ?? 1});
 if (growth < .01 || (rendered && stage >= 2)) return;
 if (variation === 'silver' && stage >= 2) {drawSilverFallback();return;}
 const u = viewScale();
 if (stage === 1) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${Math.max(5.5,12*u)}px "DM Mono",monospace`;
  ctx.fillStyle = '#b7db80';
  for (let y = 0; y < 39; y += 6) {
   const p = project(0,y,0);
   ctx.fillText('|',p.x,p.y);
  }
  for (const leaf of sprout) {
   const p = project(leaf.x,leaf.y,leaf.z);
   ctx.fillText(leaf.ch,p.x,p.y);
  }
  return;
 }
 const tree = tuning.tree;
 ctx.save();
 ctx.filter = `brightness(${tree.brightness ?? 1})`;
 ctx.lineWidth = Math.max(.6,u*.75) * (tree.pointSize ?? 1);
 for (const [low, high, color] of [[0,125,'#b3b391'],[125,Infinity,'#c0f6fa']]) {
  ctx.beginPath();
  for (const p of wood) {
   if (!p.previous || p.y < low || p.y >= high) continue;
   const [x,y,z] = p.previous;
   const a = project(x*growth,y*growth,z*growth), b = project(p.x*growth,p.y*growth,p.z*growth);
   ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
  }
  ctx.globalAlpha = .22 + .6 * (tree.filamentOpacity ?? .35);
  ctx.strokeStyle = color;
  ctx.stroke();
 }
 for (const [band,color] of ['#437faf','#71c6e1','#d0ffff','#ffad99'].entries()) {
  ctx.beginPath();
  for (const p of leaves) {
   if ((p.accent > .975 ? 3 : p.tone > .79 ? 2 : p.tone > .37 ? 1 : 0) !== band) continue;
   const dx = p.width * Math.cos(p.azimuth), dz = p.width * Math.sin(p.azimuth);
   const a = project((p.x-dx)*growth,p.y*growth,(p.z-dz)*growth);
   const b = project((p.x+dx)*growth,p.y*growth,(p.z+dz)*growth);
   ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
  }
  ctx.globalAlpha = .35 + .65 * (tree.linkOpacity ?? .13);
  ctx.strokeStyle = color;
  ctx.stroke();
 }
 ctx.restore();
}
function drawRain(now){const elapsed=now-waterAt;if(reduced||elapsed<0||elapsed>1350)return;ctx.fillStyle='#b0dcd4';ctx.font=`${15*unit}px monospace`;for(let i=0;i<23;i++){let t=(elapsed-hash(i,2)*260)/700;if(t<0||t>1)continue;let spread=[100,100,145,205,245][Math.min(stage+1,4)];let p=project((hash(i,3)-.5)*spread*2,440*(1-t), (hash(i,4)-.5)*100);ctx.globalAlpha=Math.sin(t*Math.PI)*.8;ctx.fillText("'",p.x,p.y);}ctx.globalAlpha=1;}
function frame(now){raf=0;const dt=Math.min(50,now-lastTime||16);lastTime=now;let moving=false;if(growth!==targetGrowth){let t=reduced?1:clamp((now-growAt)/(tuning.motion.growthMs ?? 1050));growth=mix(fromGrowth,targetGrowth,smooth(t));if(t===1)growth=targetGrowth;moving=t<1;}
 if(stand>0&&stage>=1||busy&&stage===0){let t=reduced?1:clamp((now-standAt)/900);stand=mix(standFrom,0,smooth(t));moving||=t<1;}
 if(spin&&!reduced&&!pointer){yaw+=dt*.00013*(tuning.motion.orbitSpeed ?? 1);moving=true;}
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);drawWafer(now);drawRootReflection();drawTree(now);drawRain(now);
 const activity=now-waterAt<1600||now-stageAt<1600;dirty=false;
 // Static reduced-motion scenes render only on interaction.
 if(moving||activity||(!reduced&&!document.hidden)){raf=requestAnimationFrame(frame);}
}
function updateUI(){
 $('#stageNumber').textContent=String(stage).padStart(2,'0');$('#stageDescription').innerHTML=descriptions[stage];$('#stages').querySelectorAll('li').forEach((li,i)=>{li.className=i===stage?'current':i<stage?'done':'';if(i===stage)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});
 $('#waterLabel').textContent=busy?'watering…':labels[stage];$('#water').setAttribute('aria-disabled',String(busy||stage===4));$('.water-dots').querySelectorAll('i').forEach((d,i)=>d.classList.toggle('filled',i<stage));
 $('#waterHint').textContent=stage===4?'DRAG TO EXPLORE THE BRANCHES':'A DROP OF POSSIBILITY';
 $('#careTitle').textContent=stage===4?specimenName():'Good things take a little care.';$('#careSubtitle').textContent=stage===4?'Fully grown.':'Four waterings. One small ecosystem.';
 $('#replant').hidden=stage===0;$('#bloom').hidden=stage===4;$('#specimen').innerHTML=stage===0?'SILICON SUBSTRATE<br><span class="subtle">300 mm · pure possibility</span>':stage===4?specimenName().toUpperCase()+'<br><span class="subtle">rooted in silicon · alive in particles</span>':'LIVING SILICON<br><span class="subtle">a small ecosystem, taking root</span>';
 canvas.setAttribute('aria-label',`${['A bare silicon wafer','A small sprout on silicon','A point-cloud sapling','A young point-cloud tree','A fully grown 3D '+specimenName()][stage]}. Drag or use arrow keys to rotate. Plus and minus zoom.`);
}
function setStage(next){stage=next;fromGrowth=growth;targetGrowth=scales[stage];growAt=stageAt=performance.now();if(reduced)growth=targetGrowth;updateUI();announce(stage===4?specimenName()+' is fully grown.':announcements[stage]);requestDraw();}
function water(){if(busy||stage===4)return;busy=true;waterAt=performance.now();if(stage===0){standFrom=stand;standAt=waterAt;}updateUI();requestDraw();const first=stage===0;if(reduced){stand=0;setStage(stage+1);busy=false;updateUI();return;}waterTimer=setTimeout(()=>setStage(stage+1),first?700:390);unlockTimer=setTimeout(()=>{busy=false;updateUI();requestDraw();},first?1500:1250);}
function clearTimers(){clearTimeout(waterTimer);clearTimeout(unlockTimer);busy=false;}
function reset(){clearTimers();stage=0;growth=fromGrowth=targetGrowth=0;stand=standFrom=1;waterAt=-10000;resetCamera();updateUI();announce('A fresh wafer. Ready to grow.');$('#water').focus();requestDraw();}
function resetCamera(){yaw=-.14;elevation=.29;zoom=1;requestDraw();}
$('#water').addEventListener('click',water);$('#bloom').addEventListener('click',()=>{clearTimers();stand=0;setStage(4);announce('Previewing the fully grown '+specimenName()+'.');});$('#replant').addEventListener('click',reset);$('#resetView').addEventListener('click',resetCamera);
function changeZoom(delta){zoom=clamp(zoom+delta,.65,1.45);requestDraw();}$('#zoomIn').addEventListener('click',()=>changeZoom(.1));$('#zoomOut').addEventListener('click',()=>changeZoom(-.1));
$('#spin').addEventListener('click',()=>{spin=!spin;if(reduced){spin=false;announce('Automatic motion is off because reduced motion is enabled.');}$('#spin').setAttribute('aria-pressed',String(spin));$('#spin').setAttribute('aria-label',`${spin?'Stop':'Start'} automatic rotation`);requestDraw();});
canvas.addEventListener('pointerdown',e=>{pointer={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY};moved=false;canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;if(Math.hypot(e.clientX-pointer.startX,e.clientY-pointer.startY)>5)moved=true;yaw+=dx*.008;elevation=clamp(elevation+dy*.005,-.12,1.15);pointer.x=e.clientX;pointer.y=e.clientY;requestDraw();});
canvas.addEventListener('pointerup',e=>{if(!pointer||pointer.id!==e.pointerId)return;if(!moved&&stage<4){const r=canvas.getBoundingClientRect(),p=discPoint(0,0);if(Math.hypot(e.clientX-r.left-p.x,e.clientY-r.top-p.y)<285*viewScale())water();}pointer=null;requestDraw();});canvas.addEventListener('pointercancel',()=>pointer=null);
canvas.addEventListener('wheel',e=>{e.preventDefault();changeZoom(-e.deltaY*.001);},{passive:false});canvas.addEventListener('keydown',e=>{let used=true;switch(e.key){case'ArrowLeft':yaw-=.15;break;case'ArrowRight':yaw+=.15;break;case'ArrowUp':elevation=clamp(elevation-.1,-.12,1.15);break;case'ArrowDown':elevation=clamp(elevation+.1,-.12,1.15);break;case'+':case'=':changeZoom(.1);break;case'-':changeZoom(-.1);break;case'Home':resetCamera();break;default:used=false;}if(used){e.preventDefault();requestDraw();}});
const dialog=$('#notes');$('#about').addEventListener('click',()=>dialog.showModal());$('#closeNotes').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
reduceQuery.addEventListener('change',e=>{reduced=e.matches;if(reduced){spin=false;$('#spin').setAttribute('aria-pressed','false');$('#spin').setAttribute('aria-label','Start automatic rotation');growth=targetGrowth;if(stage)stand=0;}requestDraw();});document.addEventListener('visibilitychange',()=>{if(!document.hidden)requestDraw();});
$('#variation').addEventListener('change', event => {
 variation = event.target.value === 'filament' ? 'filament' : 'silver';
 scene.setAttribute('data-variation',variation);
 updateUI();announce(specimenName()+' selected.');requestDraw();
});
updateUI();resize();
