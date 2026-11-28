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
      if (prism > .5) {
        float gold=smoothstep(.08,.32,silicon.r-silicon.b);
        float sweep=exp(-pow((normalUv.x+normalUv.y*.7+tilt.y*.55-.15)*8.,2.));
        return silicon*(.77+.23*foil) + foil*sweep*mix(vec3(.12,.07,.18),vec3(.47,.36,.15),gold) + gold*glint*.27;
      }
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
      vec3 color = surface(uv) * .36;
      vec3 highlights = vec3(0.);
      for (int i = 0; i < 8; i++) {
        float angle = float(i) * .785398;
        vec2 ray = vec2(cos(angle),sin(angle));
        color += surface(uv + ray * blur) * .08;
        highlights += max(surface(uv + ray * .009) - vec3(.55), vec3(0.)) * .125;
      }
      color += highlights * bloom;
      color += (holoHash(gl_FragCoord.xy + vec2(phase * 17., phase * 31.)) - .5) * grain;
      float edge = smoothstep(.482,.493,rim);
      color = mix(color, mix(vec3(.19,.24,.26) + color * .3,vec3(.55)+color*.32,silver), edge);
      gl_FragColor = vec4(color,mask);
    }`;

  globalThis.createWaferOptics = function (texture, prismTexture) {
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
    function uploadTile(source) {
    const tile=gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,tile);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    return tile;
    }
    const etchedTile=uploadTile(texture);
    let circuitTile;
    const locations = Object.fromEntries(['tilt','phase','foil','depth','grain','bloom','silver','prism'].map(
      name => [name, gl.getUniformLocation(program, name)]));
    let previous = '';
    return function draw(facing, direction, settings) {
      if (gl.isContextLost()) return settings.prism ? prismTexture : texture;
      const key = [facing, direction, ...Object.values(settings)].join(',');
      if (key !== previous) {
        previous = key;
        if(settings.prism && !circuitTile)circuitTile=uploadTile(prismTexture);
        gl.bindTexture(gl.TEXTURE_2D,settings.prism?circuitTile:etchedTile);
        gl.uniform2f(locations.tilt, facing, direction);
        for (const [name, value] of Object.entries(settings)) gl.uniform1f(locations[name], value);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      return target;
    };
  };
})();
