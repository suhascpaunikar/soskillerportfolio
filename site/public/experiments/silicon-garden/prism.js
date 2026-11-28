// Long cool bands with a narrow warm fringe, sampled in tree coordinates.
function prismColor(x,y,z,seed=0) {
 const stripe=(x*.009+y*.010+z*.004+.17*Math.sin(y*.028)+.35)%1;
 const phase=stripe<0?stripe+1:stripe;
 const stops=prismColor.stops;
 let i=1;
 while(phase>stops[i][0])i++;
 const [a,from]=stops[i-1], [b,to]=stops[i];
 const t=(phase-a)/(b-a);
 const glint=.08+.52*Math.max(0,(seed-.85)/.15);
 return from.map((v,k)=>{
  const band=v+(to[k]-v)*t;
  return band+(1-band)*glint;
 });
}
prismColor.stops=[
 [0,[.30,.12,.80]],[.22,[.13,.23,1]],[.57,[.09,.50,1]],
 [.70,[.10,.98,1]],[.76,[.52,1,.31]],[.81,[1,.93,.14]],
 [.85,[1,.32,.08]],[.90,[.80,.12,.46]],[1,[.30,.12,.80]],
];
function prismCanopy(silver) {
 const result={};
 for(const [name,vertices] of Object.entries(silver)){
  const data=vertices.slice();
  for(let i=0;i<data.length;i+=8){
   const rgb=prismColor(data[i],data[i+1],data[i+2],data[i+6]);
   const intensity=.3+.78*data[i+3];
   for(let k=0;k<3;k++)data[i+3+k]=rgb[k]*intensity;
  }
  result[name]=data;
 }
 return result;
}
// Canvas fallback for the same repeated die fields and interference phase.
// Quantize the camera only on this software path to reuse the surface between frames.
function prismWaferFallback(){
 const tile=document.createElement('canvas');tile.width=tile.height=960;
 const c=tile.getContext('2d');
 let previous='';
 return function draw(facing,direction,foil){
  const key=[facing,direction,foil].map(v=>Math.round(v*24)).join(',');
  if(previous===key)return tile;
  previous=key;
  const size=tile.width,w=size/18,h=size/24;
  c.clearRect(0,0,size,size);c.save();
  c.beginPath();c.arc(size/2,size/2,size*.496,0,2*Math.PI);c.clip();
  c.fillStyle='#211c31';c.fillRect(0,0,size,size);
  for(let row=0;row<24;row++)for(let col=0;col<18;col++){
   const x=col*w,y=row*h,u=(col+.5)/18,v=1-(row+.5)/24;
   const seed=hash(row,col,71);
   const phase=.96*u+.26*v+.08*Math.sin(5*v)+.32*facing+.38*direction+.04*(seed-.5);
   const sheen=Math.exp(-(((u+.38*v+.35*direction-.85)*4.8)**2));
   const weight=.36+.29*Math.min(1,foil);
   const base=[.02,.69,.46].map((offset,k)=>{
    const film=.5+.5*Math.cos(2*Math.PI*(phase+offset));
    const oxide=[.16,.105,.26][k];
    return oxide*(1-weight)+(.10+.73*film)*weight;
   });
   function color(relief){
    const rgb=base.map((b,k)=>Math.round(255*Math.min(1,b*(.60+.20*seed+relief)+sheen*(.12+.16*foil)*[.93,.81,1][k])));
    return 'rgb('+rgb.join(',')+')';
   }
   c.fillStyle=color(0);c.fillRect(x+1,y+1,w-2,h-2);
   c.fillStyle=color(.16);c.fillRect(x+.075*w,y+.28*h,.475*w,.62*h);
   c.fillStyle=color(-.21);c.fillRect(x+.60*w,y+.46*h,.29*w,.43*h);
   c.fillStyle=color(.13);c.fillRect(x+.075*w,y+.09*h,.815*w,.13*h);
   c.fillStyle='#dad1ff24';
   for(let i=0;i<5;i++)c.fillRect(x+.075*w,y+(.32+.12*i)*h,.475*w,.7);
   c.fillStyle='#e4b16bba';
   for(let i=0;i<4;i++)c.fillRect(x+(.6+.067*i)*w,y+.29*h,.037*w,.10*h);
  }
  c.beginPath();c.arc(size/2,size/2,size*.494,0,2*Math.PI);c.strokeStyle='#aa95b8';c.lineWidth=2;c.stroke();c.restore();
  return tile;
 };
}
