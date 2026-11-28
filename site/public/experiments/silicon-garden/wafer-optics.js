// Diffraction, flake and rainbow shading adapted from Holocloth by Dmitry Kurash (MIT).
// See HOLOCLOTH-LICENSE.txt.
(function () {
  const vertex = `
    attribute vec2 position;
    varying vec2 uv;
    void main() {
      uv = position * .5 + .5;
      gl_Position = vec4(position, 0., 1.);
    }`;
  const fragment = `
    precision highp float;
    varying vec2 uv;
    uniform sampler2D etched;
    uniform vec2 tilt;
    uniform float phase, foil, depth, grain, bloom, silver, prism;
    float holoHash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * .1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }
    vec3 rainbow(float hue) {
      vec3 rgb = clamp(abs(mod(hue * 6. + vec3(0.,4.,2.),6.) - 3.) - 1.,0.,1.);
      return rgb * rgb * (3. - 2. * rgb);
    }
    float field(vec2 local, vec2 corner, vec2 end) {
      vec2 inset = min(local-corner, end-local);
      return smoothstep(-.012,.018,min(inset.x,inset.y));
    }
    vec3 prismSurface(vec2 p) {
      // All geometry is fixed in wafer space. Film interference and the
      // reflection of a broad light source depend on viewing angle.
      vec2 dies = p*vec2(18.,24.);
      vec2 local = fract(dies);
      float process = holoHash(floor(dies));
      vec2 wall = min(local,1.-local);
      float edge = min(wall.x,wall.y);
      float die = smoothstep(.012,.050,edge);
      float bevel = smoothstep(.016,.046,edge)*(1.-smoothstep(.046,.085,edge));
      float memory = field(local,vec2(.075,.10),vec2(.55,.72));
      float logic = field(local,vec2(.60,.11),vec2(.89,.54));
      float bus = field(local,vec2(.075,.78),vec2(.89,.91));
      float contacts = field(local,vec2(.60,.60),vec2(.89,.71)) *
          smoothstep(.18,.44,fract((local.x-.59)*15.));
      float layout = .16*memory - .21*logic + .13*bus;
      float phaseOffset = .96*p.x + .26*p.y + .08*sin(5.*p.y) +
          .32*tilt.x + .38*tilt.y + .04*(process-.5) + .038*layout;
      vec3 film = .5+.5*cos(6.28318*(phaseOffset + vec3(.02,.69,.46)));
      // Violet oxide, copper-gold interconnect and a cold, grazing highlight.
      vec3 oxide = vec3(.16,.105,.26);
      vec3 metal = mix(oxide, .10+.73*film, .36+.29*clamp(foil,0.,1.));
      float striae = memory*cos(6.28318*local.y*8.) + logic*cos(6.28318*local.x*6.)
                   + bus*cos(6.28318*local.y*12.);
      float grazing = exp(-pow((p.x+.38*p.y+.35*tilt.y-.85)*4.8,2.));
      float polish = (.60+.20*process+layout)*(1.+.09*striae);
      vec3 face = metal*polish + grazing*(.12+.16*foil)*vec3(.93,.81,1.);
      face = mix(face, vec3(.66,.40,.14)+.25*grazing,contacts*.70);
      vec3 lane = vec3(.053,.043,.085)+.13*metal;
      return mix(lane,face,die)+bevel*(.10+.18*grazing)*vec3(.94,.76,.99);
    }
    vec3 surface(vec2 p) {
      vec2 normalUv = p - .5;
      float facing = abs(tilt.x + dot(normalUv, vec2(.29, -.24)));
      facing = clamp(facing, 0., 1.);
      float fresnel = pow(1. - facing, 1.5);
      vec2 flake = floor(p * 360.);
      float rnd = holoHash(flake);
      float rnd2 = holoHash(flake + 71.7);
      float hue = fract(.37 + facing * 1.1 + length(normalUv) * 1.6 + rnd * .06 + phase * .006);
      vec3 spectrum = mix(vec3(1.), rainbow(hue), .87);
      float gate = fract(rnd2 * 13.7 + facing * 6.);
      float glint = smoothstep(.991, 1., gate) * fresnel;
      float specular = exp(-pow((normalUv.x + normalUv.y * .58 + tilt.x * .48 - .24) * 5., 2.));
      vec3 silicon = texture2D(etched, vec2(p.x, 1. - p.y)).rgb;
      float etch = dot(silicon, vec3(.2126,.7152,.0722));
      if (silver > .5) {
        vec2 die = fract(p * 18.);
        vec2 seamWidth = min(die, 1.-die);
        float seam = 1.-smoothstep(.008,.028,min(seamWidth.x,seamWidth.y));
        float band = normalUv.x + normalUv.y*.62 + tilt.y*.24;
        float strip = exp(-pow((abs(band)-.40)*10.,2.));
        float brushed = .5+.5*sin(p.x*2100.+p.y*160.);
        float value = .045+.1*etch+.046*brushed + .27*strip*(.55+foil*.45);
        return vec3(value + seam*(.075+.19*strip) + glint*.16);
      }
      vec3 metal = vec3(.09,.11,.14) + silicon * .34;
      return metal + spectrum * foil * (.13 + .58 * etch) *
          (.58 + .4 * fresnel + .52 * specular + 1.7 * glint);
    }
    void main() {
      vec2 p = uv - .5;
      float rim = length(p);
      float mask = 1. - smoothstep(.493,.498,rim);
      float distanceFromFocus = abs(dot(p, vec2(tilt.y, .55)) - .05);
      float blur = depth * smoothstep(.035,.43,distanceFromFocus) * .016;
      vec3 color;
      if (prism > .5) {
        vec3 centre = prismSurface(uv);
        vec2 footprint = vec2(.19,.45)*blur;
        vec3 soft = .5*(prismSurface(uv+footprint)+prismSurface(uv-footprint));
        color = mix(centre,soft,.40)+bloom*.35*max(soft-.47,0.);
      } else {
        color = surface(uv) * .36;
        vec3 highlights = vec3(0.);
        for (int i = 0; i < 8; i++) {
          float angle = float(i) * .785398;
          vec2 ray = vec2(cos(angle),sin(angle));
          color += surface(uv + ray * blur) * .08;
          highlights += max(surface(uv + ray * .009) - vec3(.55), vec3(0.)) * .125;
        }
        color += highlights * bloom;
      }
      color += (holoHash(gl_FragCoord.xy + vec2(phase * 17., phase * 31.)) - .5) * grain;
      float edge = smoothstep(.482,.493,rim);
      color = mix(color, mix(vec3(.19,.24,.26) + color * .3,vec3(.55)+color*.32,silver), edge);
      gl_FragColor = vec4(color,mask);
    }`;

  globalThis.createWaferOptics = function (texture) {
    const target = document.createElement('canvas');
    target.width = target.height = 640;
    const gl = target.getContext('webgl', { alpha: true, preserveDrawingBuffer: true, premultipliedAlpha: false });
    if (!gl) return null;

    const program = gl.createProgram();
    for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Wafer optics shader unavailable', gl.getShaderInfoLog(shader));
        return null;
      }
      gl.attachShader(program, shader);
      gl.deleteShader(shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
    const locations = Object.fromEntries(['tilt','phase','foil','depth','grain','bloom','silver','prism'].map(
      name => [name, gl.getUniformLocation(program, name)]));
    let previous = '';
    return function draw(facing, direction, settings) {
      if (gl.isContextLost()) return null;
      const key = [facing, direction, ...Object.values(settings)].join(',');
      if (key !== previous) {
        previous = key;
        gl.uniform2f(locations.tilt, facing, direction);
        for (const [name, value] of Object.entries(settings)) gl.uniform1f(locations[name], value);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      return target;
    };
  };
})();
