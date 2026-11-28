// Build each umbel from its centre out, so the visible gaps remain open in orbit.
globalThis.buildSilverCanopy = function (hash) {
  const points = [], hairs = [], links = [];
  let id = 0;
  function random() { return hash(++id, 193); }
  function vertex(buffer, p, shade, birth) {
    buffer.push(p[0], p[1], p[2], shade, shade, shade, random(), birth);
  }
  function line(buffer, a, b, shade, start, end) {
    vertex(buffer, a, shade, start);
    vertex(buffer, b, shade, end);
  }
  function stem(path, steps, shade, start, end) {
    let last = path(0);
    for (let i = 1; i <= steps; i++) {
      const next = path(i / steps);
      line(hairs, last, next, shade, start+(end-start)*(i-1)/steps, start+(end-start)*i/steps);
      last = next;
    }
  }
  function spray(origin, radius, rise, count, start, end) {
    for (let i = 0; i < count; i++) {
      const angle = i * 2.39996 + random() * .28;
      const reach = Math.sqrt((i + .5) / count);
      const dx = Math.cos(angle) * reach * radius;
      const dz = Math.sin(angle) * reach * radius;
      const dy = rise * (.22 + .78 * Math.sqrt(1 - reach * reach));
      function rib(t) {
        return [origin[0] + dx * t, origin[1] + dy * t + 13 * Math.sin(t * Math.PI), origin[2] + dz * t];
      }
      const ribStart = start + (end-start)*.12*reach;
      const ribDuration = (end-start)*.54;
      stem(rib, 8, .55 + random() * .35, ribStart, ribStart+ribDuration);
      if (reach > .85 && i % 5 === 0) {
        const tip = rib(1), drop = 13 + 24 * random();
        for (let j = 1; j <= 9; j++) {
          const t = j / 9;
          vertex(points,[tip[0]+dx*.13*t,tip[1]-drop*t*t,tip[2]+dz*.13*t],.45+.45*random(),ribStart+ribDuration+(end-start)*.20*t);
        }
      }
      for (let j = 0; j < 7; j++) {
        const junction = .56 + .44 * random(), a = rib(junction);
        const twigStart = ribStart + junction* ribDuration, twigDuration=(end-start)*.21;
        const spread = radius * (.06 + .15 * random());
        const turn = angle + (j % 2 ? 1 : -1) * (.35 + random());
        const b = [a[0]+spread*Math.cos(turn),a[1]+spread*(.25+random()*.65),a[2]+spread*Math.sin(turn)];
        line(links, a, b, .8, twigStart, twigStart+twigDuration);
        for (let k = 0; k < 7; k++) {
          const f = .33 + .67 * random(), phi = random() * 2 * Math.PI;
          const x = a[0] + (b[0]-a[0])*f, y = a[1] + (b[1]-a[1])*f, z = a[2] + (b[2]-a[2])*f;
          const length = 1 + 4 * random();
          const tip = [x+length*Math.cos(phi), y+length*(random()-.25), z+length*Math.sin(phi)];
          const bud = twigStart + twigDuration*f, open = bud + (end-start)*.12;
          line(links,[x,y,z],tip,.94,bud,open);
          vertex(points,tip,.62+.38*random(),open);
          if (random() < .13) {
            line(hairs,[tip[0]-.9,tip[1],tip[2]],[tip[0]+.9,tip[1],tip[2]],1,open,open+.0003);
          }
        }
      }
    }
  }

  // Height, centre and size differ for each crown. The smaller side stems
  // leave windows through which the ribs of the taller umbrellas can be seen.
  const crowns = [
    {centre:[12,269,-8], radius:113, rise:66, base:0, ribs:67, season:[.48,.79,1]},
    {centre:[-68,197,19], radius:88, rise:70, base:54, ribs:47, season:[.55,.71,.94]},
    {centre:[57,156,-2], radius:68, rise:59, base:36, ribs:39, season:[.53,.66,.90]},
    {centre:[-52,67,-15], radius:37, rise:24, base:15, ribs:19, season:[.48,.58,.79]},
    {centre:[64,58,29], radius:31, rise:21, base:18, ribs:14, season:[.485,.59,.82]},
  ];
  for (const {centre,radius,rise,base,ribs,season} of crowns) {
    for (let i = 0; i < 5; i++) {
      const phase = i * 2 * Math.PI / 5, thickness = 3 + 3 * random();
      stem(t => {
        const r = thickness * (1 - t);
        return [centre[0]*t*t + r*Math.cos(phase+t*3),base+(centre[1]-base)*t,
                centre[2]*t*t + r*Math.sin(phase+t*3)];
      },34,.66 + .32 * random(),season[0]+.002*i,season[1]-.002*(4-i));
    }
    spray(centre,radius,rise,ribs,season[1],season[2]);
  }
  for (let i = 0; i < 68; i++) {
    const phi = random()*2*Math.PI, span = 22+83*random(), height = 9+45*random();
    const bend = random()*.6-.3;
    const root = t => {
      const angle = phi + bend * Math.sin(t*5);
      return [span*t*Math.cos(angle),1.5+height*(1-t)**7+1.3*Math.sin(t*12)**2,span*t*Math.sin(angle)];
    };
    const start=.5+.14*i/68, duration=.22;
    stem(root,20,.4+.5*random(),start,start+duration);
    for (let k = 0; k < 8; k++) {
      const distance=random(), a = root(distance), bud=start+distance*duration;
      const b = [a[0]+random()*8-4,Math.max(1,a[1]-random()*4),a[2]+random()*8-4];
      line(links,a,b,.6,bud,bud+.018);
      vertex(points,b,.85,bud+.018);
    }
  }
  return {points:new Float32Array(points),hairs:new Float32Array(hairs),links:new Float32Array(links)};
};
