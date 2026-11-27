const $ = s => document.querySelector(s);
const canvas = $('#garden'), ctx = canvas.getContext('2d'), scene = $('#scene');
const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = reduceQuery.matches;
let pointRenderer=null;
let tuning = { tree: {}, wafer: {}, motion: {}, camera: {} };
globalThis.window?.addEventListener('silicon-scene-settings', event => {
 tuning = event.detail;
 requestDraw();
});
function hash(a,b,salt=1){let x=(a*73856093)^(b*19349663)^(salt*83492791);x=Math.imul(x^(x>>>13),1274126177);x^=x>>>16;return (x>>>0)/4294967296;}
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
const models=[['opus','Anthropic','#e6a17f',-135,300,80],['fable','Anthropic','#edb799',-40,337,-15],['gemini','Google','#91baff',-202,255,55],['gpt','OpenAI','#e5eddf',85,323,65],['sonnet','Anthropic','#e8a28a',170,283,40],['llama','Meta','#bda8ef',-225,215,0],['mistral','Mistral AI','#e6c776',220,229,15],['deepseek','DeepSeek','#7ed0ce',0,287,155]].map(([name,lab,color,x,y,z])=>({name,lab,color,x,y,z,picked:false}));
let width=0,height=0,unit=1,dpr=1,stage=0,growth=0,fromGrowth=0,targetGrowth=0,growAt=0,stageAt=0,stand=1,standFrom=1,standAt=0,busy=false,waterAt=-10000,waterTimer=0,unlockTimer=0,spin=false,yaw=-.14,elevation=.29,zoom=1,harvest=0,lastTime=0,raf=0,pointer=null,moved=false,dirty=true;
const scales=[0,.15,.48,.74,1];
const labels=['water it','a little more','keep going','one last drop','in bloom'];
const descriptions=['Every ecosystem<br>starts somewhere.','A small beginning.<br>A world of potential.','Taking root.<br>Reaching further.','A little patience.<br>A little possibility.','Intelligence blooms.<br>Pick your curiosity.'];
const announcements=['','A sprout breaks through the silicon.','It grows into a sapling.','It is a young tree now.','Fully grown. Eight models hang ripe on the branches.'];
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
const leaves=[],wood=[];
function line(a,b,count,seed,thickness=0){
 for(let i=0;i<count;i++){
  const t=i/(count-1),x=mix(a[0],b[0],t),y=mix(a[1],b[1],t),z=mix(a[2],b[2],t),radius=thickness*(1-t*.7);
  for(let side=0;side<(thickness?4:1);side++){
   const angle=side*Math.PI/2;
   wood.push({x:x+Math.cos(angle)*radius,y:y+Math.sin(t*Math.PI)*7,z:z+Math.sin(angle)*radius,ch:Math.abs(b[0]-a[0])<14?'|':b[0]>a[0]?'/':'\\',tone:hash(i,seed+side,3)});
  }
 }
}
// A tapered cylinder of bark glyphs stays substantial from every viewing angle.
for(let y=0;y<145;y+=6){
 const radius=12+14*Math.exp(-y/29);
 for(let side=0;side<12;side++){
  const angle=side/12*Math.PI*2;
  wood.push({x:Math.cos(angle)*radius+Math.sin(y*.018)*2,y,z:Math.sin(angle)*radius,ch:'|M:ICR|'[(Math.floor(y/6)+side)%7],tone:.5-Math.cos(angle)*.28});
 }
}
for(let root=0;root<8;root++){
 const angle=root/8*Math.PI*2;
 line([Math.cos(angle)*14,18,Math.sin(angle)*14],[Math.cos(angle)*65,2,Math.sin(angle)*65],12,root+300,4);
}
for(let b=0;b<16;b++){
 const angle=b/16*Math.PI*2+.16,co=Math.cos(angle),si=Math.sin(angle),inner=[co*35,190,si*35],outer=[co*202,240+hash(b,1)*17,si*202];
 line([co*10,115,si*10],inner,16,b,5);line(inner,outer,33,b+20,3);
 for(let k=0;k<3;k++){const t=.36+k*.23,base=[mix(inner[0],outer[0],t),mix(inner[1],outer[1],t),mix(inner[2],outer[2],t)];let a=angle+(k%2?-.24:.24),r=105+k*45;line(base,[Math.cos(a)*r,330-k*20,Math.sin(a)*r],18,b*3+k+70);}
}
// Two dense, staggered shells give the crown depth as well as a fuller silhouette.
for(let layer=0;layer<2;layer++)for(let x=-242;x<=242;x+=8)for(let z=-242;z<=242;z+=10){
 const px=x+layer*4,pz=z+layer*5,rr=(px*px+pz*pz)/(244*244);
 if(rr>1||hash(x,z,5+layer)<(layer ? .16 : .025))continue;
 const n=hash(x,z,6+layer),y=218+130*Math.sqrt(1-rr)-n*9-layer*(24+28*(1-rr));
 leaves.push({x:px+(hash(x,z,9)-.5)*4,y,z:pz+(n-.5)*5,ch:'MICROMACRO:;*'[Math.floor(hash(x,z,7+layer)*13)],tone:hash(x,z,8+layer),edge:rr,layer});
}
const sprout=[];line([-1,0,0],[0,41,0],8,500); // the mature trunk also has a rooted base
for(let side of [-1,1])for(let i=0;i<14;i++){let t=i/13*Math.PI; sprout.push({x:side*(3+19*Math.sin(t)),y:37+9*Math.cos(t),z:Math.sin(t)*side*5,ch:'()/\\,.'[i%6]});}
if(globalThis.SiliconPointTree){
 const pointCanvas=document.createElement('canvas');pointCanvas.className='point-tree';pointCanvas.setAttribute('aria-hidden','true');scene.append(pointCanvas);
 pointRenderer=globalThis.SiliconPointTree.create(pointCanvas,leaves,wood,hash);
}
const fruitLayer=$('#fruits');
for(const m of models){
 const b=document.createElement('button');
 b.className='fruit';b.textContent=m.name;
 b.setAttribute('aria-label',`Pick ${m.name}, ${m.lab}`);b.title=`${m.name} · ${m.lab}`;
 b.hidden=true;b.addEventListener('click',()=>pick(m));fruitLayer.append(b);m.button=b;
}
function discPoint(x,z,offset=0){const angle=stand*Math.PI*.5;return project(x,-z*Math.sin(angle)+170*stand+offset,z*Math.cos(angle));}
function drawWafer(now){
 const origin=discPoint(0,0),u=discPoint(282,0),v=discPoint(0,282);const ax=(u.x-origin.x)/600,ay=(u.y-origin.y)/600,bx=(v.x-origin.x)/600,by=(v.y-origin.y)/600;
 // Soft contact shadow and a thin layered silicon edge.
 if(stand<.9){const p=project(0,-5,0);ctx.save();ctx.translate(p.x,p.y);ctx.scale(1,.24);const sh=ctx.createRadialGradient(0,0,20,0,0,330*viewScale());sh.addColorStop(0,'#000000b0');sh.addColorStop(1,'#00000000');ctx.fillStyle=sh;ctx.fillRect(-350*viewScale(),-350*viewScale(),700*viewScale(),700*viewScale());ctx.restore();}
 ctx.save();ctx.transform(ax,ay,bx,by,origin.x-600*ax-600*bx,origin.y-600*ay-600*by+3*unit);ctx.fillStyle='#2b3736';ctx.beginPath();ctx.arc(600,600,597,0,Math.PI*2);ctx.fill();ctx.restore();
 ctx.save();ctx.transform(ax,ay,bx,by,origin.x-600*ax-600*bx,origin.y-600*ay-600*by);const facing = Math.min(1, Math.abs(ax*by-ay*bx)*600*600/(282*viewScale())**2);
 const camera = tuning.camera ?? {};
 const opticalTexture = waferOptics?.(facing, Math.sin(yaw)*.65, {
  phase: reduced ? 0 : Math.floor(now/120)%72,
  foil: (tuning.wafer.shimmer ?? .13)*6.5,
  depth: camera.depth ?? .62,
  grain: camera.grain ?? .09,
  bloom: camera.bloom ?? .32,
 }) ?? texture;
 ctx.drawImage(opticalTexture,0,0,1200,1200);
 if(growth>.1){const shade=ctx.createRadialGradient(600,570,10,600,570,340*growth);shade.addColorStop(0,'#061005a0');shade.addColorStop(1,'#06100500');ctx.fillStyle=shade;ctx.fillRect(0,0,1200,1200);}
 let elapsed=now-waterAt; if(!reduced&&elapsed<1500)for(let i=0;i<2;i++){let t=(elapsed-300-i*190)/950;if(t>0&&t<1){ctx.strokeStyle=`rgba(171,225,214,${(1-t)*.8})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(600,600,500*t,0,Math.PI*2);ctx.stroke();}}
 ctx.restore();
}
function drawTree(now){
 const rendered=pointRenderer?.draw({width,height,dpr,stage,growth,yaw,elevation,scale:viewScale(),time:reduced?0:now*.001,reduced,style:tuning.tree,sway:tuning.motion.sway ?? 1});
 if(growth<.01||(rendered&&stage>=2))return;const u=viewScale();const points=[];if(stage===1&&growth<.18){for(let y=0;y<39;y+=6){const p=project(0,y,0);points.push({...p,ch:'|',color:'#b7db80',size:12});}for(let leaf of sprout){const p=project(leaf.x,leaf.y,leaf.z);points.push({...p,ch:leaf.ch,color:'#c8f58a',size:12});}}else{
 const reveal=reduced?1:clamp((now-stageAt)/850);for(const point of wood){if(stage<3&&point.y>260)continue;let p=project(point.x*growth,point.y*growth,point.z*growth);points.push({...p,ch:point.ch,color:`hsl(${62+point.tone*12} 23% ${39+point.tone*23}%)`,size:10,alpha:1});}
 for(const point of leaves){if(reveal<1&&hash(Math.round(point.x),Math.round(point.z),3)>reveal+.2)continue;const p=project(point.x*growth,point.y*growth,point.z*growth);const light=clamp(.5-point.x/850+point.y/900+point.tone*.2);points.push({...p,ch:point.ch,color:`hsl(${77+point.tone*17} ${37+point.tone*24}% ${25+light*36-point.layer*9}%)`,size:11.5,alpha:point.layer ? .58+point.tone*.22 : .8+point.tone*.2});}
 }
 points.sort((a,b)=>a.z-b.z);ctx.textAlign='center';ctx.textBaseline='middle';for(const p of points){ctx.fillStyle=p.color;ctx.globalAlpha=p.alpha??1;ctx.font=`${Math.max(5.5,p.size*u)}px "DM Mono",monospace`;if(stage===1){ctx.fillText(p.ch,p.x,p.y);}else{const size=Math.max(.5,1.6*u*(tuning.tree.pointSize ?? 1));ctx.fillRect(p.x,p.y,size,size);}}ctx.globalAlpha=1;
}
function drawRain(now){const elapsed=now-waterAt;if(reduced||elapsed<0||elapsed>1350)return;ctx.fillStyle='#b0dcd4';ctx.font=`${15*unit}px monospace`;for(let i=0;i<23;i++){let t=(elapsed-hash(i,2)*260)/700;if(t<0||t>1)continue;let spread=[100,100,145,205,245][Math.min(stage+1,4)];let p=project((hash(i,3)-.5)*spread*2,440*(1-t), (hash(i,4)-.5)*100);ctx.globalAlpha=Math.sin(t*Math.PI)*.8;ctx.fillText("'",p.x,p.y);}ctx.globalAlpha=1;}
function fruitPosition(m,now){let p={x:m.x,y:m.y,z:m.z};if(m.picked){let t=reduced?1:clamp((now-m.pickAt)/1100);const slot=m.slot;let eased=t*t;let bounce=0;if(t>.6){const bt=(t-.6)/.4;bounce=Math.abs(Math.sin(bt*Math.PI*2))*25*(1-bt);eased=1;}p={x:mix(m.x,slot[0],smooth(t)),y:mix(m.y,16,eased)+bounce,z:mix(m.z,slot[1],smooth(t))};}return project(p.x,p.y,p.z);}
function drawFruits(now){if(stage<4){models.forEach(m=>m.button.hidden=true);return;}const fruitReady=reduced||now-stageAt>650;const placements=[];for(let i=0;i<models.length;i++){const m=models[i];m.button.hidden=!fruitReady;if(!fruitReady)continue;const p=fruitPosition(m,now);const w=m.button.offsetWidth,h=m.button.offsetHeight;let x=clamp(p.x-w/2,4,width-w-4),y=clamp(p.y-h/2,4,height-h-4);placements.push({m,x,y,w,h,p});}
 // Keep model boxes separately selectable, including when viewed edge-on.
 const placed=[];
 for(const a of placements){
  const originX=a.x,originY=a.y;
  const clear=()=>placed.every(b=>a.x+a.w+3<=b.x||b.x+b.w+3<=a.x||a.y+a.h+3<=b.y||b.y+b.h+3<=a.y);
  let found=clear();
  for(let radius=8;!found&&radius<Math.max(width,height);radius+=8){
   for(let direction=0;direction<16;direction++){
    const angle=direction*Math.PI/8;
    a.x=clamp(originX+Math.cos(angle)*radius,4,width-a.w-4);
    a.y=clamp(originY+Math.sin(angle)*radius,4,height-a.h-4);
    if(clear()){found=true;break;}
   }
  }
  placed.push(a);
 }

 for(const a of placements){a.m.button.style.transform=`translate(${a.x.toFixed(1)}px,${clamp(a.y,4,height-a.h-4).toFixed(1)}px)`;a.m.button.style.zIndex=String(Math.round(a.p.z+600));a.m.button.style.opacity=(!reduced&&now-stageAt<1100)?String(clamp((now-stageAt-650)/400)):1;}
}
function frame(now){raf=0;const dt=Math.min(50,now-lastTime||16);lastTime=now;let moving=false;if(growth!==targetGrowth){let t=reduced?1:clamp((now-growAt)/(tuning.motion.growthMs ?? 1050));growth=mix(fromGrowth,targetGrowth,smooth(t));if(t===1)growth=targetGrowth;moving=t<1;}
 if(stand>0&&stage>=1||busy&&stage===0){let t=reduced?1:clamp((now-standAt)/900);stand=mix(standFrom,0,smooth(t));moving||=t<1;}
 if(spin&&!reduced&&!pointer){yaw+=dt*.00013*(tuning.motion.orbitSpeed ?? 1);moving=true;}
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);drawWafer(now);drawTree(now);drawRain(now);drawFruits(now);
 const activity=now-waterAt<1600||now-stageAt<1600||models.some(m=>m.picked&&now-m.pickAt<1200);dirty=false;
 // Static reduced-motion scenes render only on interaction.
 if(moving||activity||(!reduced&&!document.hidden)){raf=requestAnimationFrame(frame);}
}
function updateUI(){
 $('#stageNumber').textContent=String(stage).padStart(2,'0');$('#stageDescription').innerHTML=descriptions[stage];$('#stages').querySelectorAll('li').forEach((li,i)=>{li.className=i===stage?'current':i<stage?'done':'';if(i===stage)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});
 $('#waterLabel').textContent=busy?'watering…':labels[stage];$('#water').setAttribute('aria-disabled',String(busy||stage===4));$('.water-dots').querySelectorAll('i').forEach((d,i)=>d.classList.toggle('filled',i<stage));
 $('#waterHint').textContent=stage===4?(harvest===8?'ALL EIGHT. BACK TO THEIR ROOTS.':'TAP A FRUIT TO PICK IT'):'A DROP OF POSSIBILITY';$('#harvestCount').textContent=harvest;
 $('#careTitle').textContent=stage===4?(harvest===8?'A full circle. A fresh beginning.':'A little care goes a long way.'):'Good things take a little care.';$('#careSubtitle').textContent=stage===4?(harvest===8?'Plant again and see what grows.':'Eight models. Ready for your curiosity.'):'Four waterings. One small ecosystem.';
 $('#replant').hidden=stage===0;$('#bloom').hidden=stage===4;$('#specimen').innerHTML=stage===0?'SILICON SUBSTRATE<br><span class="subtle">300 mm · pure possibility</span>':stage===4?'UMBRELLA INTELLIGENCE<br><span class="subtle">rooted in silicon · alive in particles</span>':'LIVING SILICON<br><span class="subtle">a small ecosystem, taking root</span>';
 canvas.setAttribute('aria-label',`${['A bare silicon wafer','A small sprout on silicon','A point-cloud sapling','A young point-cloud tree','A fully grown 3D umbrella tree'][stage]}. Drag or use arrow keys to rotate. Plus and minus zoom.`);
}
function setStage(next){stage=next;fromGrowth=growth;targetGrowth=scales[stage];growAt=stageAt=performance.now();if(reduced)growth=targetGrowth;updateUI();announce(announcements[stage]);requestDraw();}
function water(){if(busy||stage===4)return;busy=true;waterAt=performance.now();if(stage===0){standFrom=stand;standAt=waterAt;}updateUI();requestDraw();const first=stage===0;if(reduced){stand=0;setStage(stage+1);busy=false;updateUI();return;}waterTimer=setTimeout(()=>setStage(stage+1),first?700:390);unlockTimer=setTimeout(()=>{busy=false;updateUI();requestDraw();},first?1500:1250);}
function pick(m){if(m.picked||stage!==4)return;m.picked=true;m.pickAt=performance.now();const slots=[[-65,130],[65,130],[-165,30],[165,30],[-125,-80],[125,-80],[-50,-155],[50,-155]];m.slot=slots[harvest++];m.button.setAttribute('aria-disabled','true');m.button.setAttribute('aria-label',`${m.name}, ${m.lab}, picked`);announce(harvest===8?'All eight models picked.':`${m.name} falls onto the wafer.`);updateUI();requestDraw();}
function clearTimers(){clearTimeout(waterTimer);clearTimeout(unlockTimer);busy=false;}
function reset(){clearTimers();stage=0;growth=fromGrowth=targetGrowth=0;stand=standFrom=1;harvest=0;waterAt=-10000;for(const m of models){m.picked=false;m.button.setAttribute('aria-disabled','false');m.button.setAttribute('aria-label',`Pick ${m.name}, ${m.lab}`);m.button.hidden=true;}resetCamera();updateUI();announce('A fresh wafer. Ready to grow.');$('#water').focus();requestDraw();}
function resetCamera(){yaw=-.14;elevation=.29;zoom=1;requestDraw();}
$('#water').addEventListener('click',water);$('#bloom').addEventListener('click',()=>{clearTimers();stand=0;setStage(4);announce('Bloom preview. Eight models are ready to pick.');});$('#replant').addEventListener('click',reset);$('#resetView').addEventListener('click',resetCamera);
function changeZoom(delta){zoom=clamp(zoom+delta,.65,1.45);requestDraw();}$('#zoomIn').addEventListener('click',()=>changeZoom(.1));$('#zoomOut').addEventListener('click',()=>changeZoom(-.1));
$('#spin').addEventListener('click',()=>{spin=!spin;if(reduced){spin=false;announce('Automatic motion is off because reduced motion is enabled.');}$('#spin').setAttribute('aria-pressed',String(spin));$('#spin').setAttribute('aria-label',`${spin?'Stop':'Start'} automatic rotation`);requestDraw();});
canvas.addEventListener('pointerdown',e=>{pointer={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY};moved=false;canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;if(Math.hypot(e.clientX-pointer.startX,e.clientY-pointer.startY)>5)moved=true;yaw+=dx*.008;elevation=clamp(elevation+dy*.005,-.12,1.15);pointer.x=e.clientX;pointer.y=e.clientY;requestDraw();});
canvas.addEventListener('pointerup',e=>{if(!pointer||pointer.id!==e.pointerId)return;if(!moved&&stage<4){const r=canvas.getBoundingClientRect(),p=discPoint(0,0);if(Math.hypot(e.clientX-r.left-p.x,e.clientY-r.top-p.y)<285*viewScale())water();}pointer=null;requestDraw();});canvas.addEventListener('pointercancel',()=>pointer=null);
canvas.addEventListener('wheel',e=>{e.preventDefault();changeZoom(-e.deltaY*.001);},{passive:false});canvas.addEventListener('keydown',e=>{let used=true;switch(e.key){case'ArrowLeft':yaw-=.15;break;case'ArrowRight':yaw+=.15;break;case'ArrowUp':elevation=clamp(elevation-.1,-.12,1.15);break;case'ArrowDown':elevation=clamp(elevation+.1,-.12,1.15);break;case'+':case'=':changeZoom(.1);break;case'-':changeZoom(-.1);break;case'Home':resetCamera();break;default:used=false;}if(used){e.preventDefault();requestDraw();}});
const dialog=$('#notes');$('#about').addEventListener('click',()=>dialog.showModal());$('#closeNotes').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
reduceQuery.addEventListener('change',e=>{reduced=e.matches;if(reduced){spin=false;$('#spin').setAttribute('aria-pressed','false');$('#spin').setAttribute('aria-label','Start automatic rotation');growth=targetGrowth;if(stage)stand=0;}requestDraw();});document.addEventListener('visibilitychange',()=>{if(!document.hidden)requestDraw();});
updateUI();resize();
