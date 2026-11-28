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
function makePrismWafer(){
 const tile=document.createElement('canvas');tile.width=tile.height=1200;
 const c=tile.getContext('2d');
 c.save();c.beginPath();c.arc(600,600,594,0,Math.PI*2);c.clip();
 function metal(x1,y1,x2,y2,stops){
  const g=c.createLinearGradient(x1,y1,x2,y2);
  for(const [p,color] of stops)g.addColorStop(p,color);
  return g;
 }
 c.fillStyle=metal(0,0,1000,1200,[[0,'#282351'],[.3,'#655397'],[.64,'#70548e'],[1,'#29234d']]);
 c.fillRect(0,0,1200,1200);
 c.lineWidth=1.4;c.strokeStyle='#d3bdff60';c.beginPath();
 for(let i=0;i<=1200;i+=39){c.moveTo(i,0);c.lineTo(i,1200);c.moveTo(0,i);c.lineTo(1200,i);}
 c.stroke();
 const gold=metal(230,150,940,1000,[[0,'#b55920'],[.24,'#ffbc39'],[.40,'#fff29a'],[.49,'#bd6b29'],[.74,'#ffcc4c'],[1,'#e48636']]);
 for(const side of [-1,1]){
  c.save();c.translate(600,600);c.scale(1,side);
  for(let pin=0;pin<21;pin++){
   const t=(pin-10)/10,x=t*275,outer=t*477,y=522-152*t*t;
   c.beginPath();c.moveTo(x,127);c.lineTo(x,184);
   c.bezierCurveTo(x,265,outer,y-95,outer,y-25);c.lineTo(outer,y);
   c.strokeStyle='#301c38';c.lineWidth=10;c.stroke();
   c.strokeStyle=gold;c.lineWidth=6;c.stroke();
   c.fillStyle=gold;c.fillRect(outer-9,y-10,18,20);
   c.fillStyle='#80572e';c.beginPath();c.arc(outer,y,2.4,0,Math.PI*2);c.fill();
  }
  c.restore();
 }
 // A notched package and a burnished gold die sit beneath the roots.
 c.beginPath();c.moveTo(295,422);c.lineTo(904,422);c.lineTo(904,778);c.lineTo(295,778);
 c.lineTo(295,654);c.bezierCurveTo(351,642,351,560,295,548);c.closePath();
 c.fillStyle=metal(330,420,890,800,[[0,'#172823'],[.28,'#354234'],[.42,'#655331'],[.57,'#19342f'],[1,'#293147']]);
 c.fill();c.strokeStyle='#b7a269';c.lineWidth=4;c.stroke();
 c.fillStyle=metal(453,490,715,732,[[0,'#a55924'],[.20,'#ffbf37'],[.44,'#f4ac25'],[.56,'#ffe77c'],[.61,'#c67c20'],[.82,'#fff09a'],[1,'#c27326']]);
 c.fillRect(470,481,279,237);c.strokeStyle='#fae99e';c.lineWidth=3;c.strokeRect(470,481,279,237);
 c.strokeStyle='#796635';c.lineWidth=2;
 for(let i=0;i<5;i++)c.strokeRect(346+i*13,461+(i%2)*6,8,7);
 for(const [x,y,r] of [[904,422,26],[470,718,17]]){
  const flare=c.createRadialGradient(x,y,0,x,y,r);
  flare.addColorStop(0,'#ffffed');flare.addColorStop(.09,'#ffebcf');flare.addColorStop(.32,'#fdd6f396');flare.addColorStop(1,'#f1aaf000');
  c.fillStyle=flare;c.fillRect(x-r,y-r,2*r,2*r);
 }
 c.beginPath();c.arc(600,600,592,0,Math.PI*2);c.strokeStyle='#c6addf';c.lineWidth=4;c.stroke();c.restore();
 return tile;
}
