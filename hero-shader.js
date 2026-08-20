/* WebGL2 spectral field transplanted from aihero-motion-demo.html. */
(function () {
  "use strict";

  var VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

  var FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uTime;
uniform float uSpeed;
uniform float uSeed;
uniform float uFreq;
uniform float uDispAmp;
uniform float uDispFreq;
uniform float uFlowY;
uniform float uFlowX;
uniform float uIntensity;
uniform float uSaturation;
uniform float uSharpness;
uniform float uGrain;
uniform float uGrainTexture;
uniform float uGrainScale;
uniform float uGrainSpeed;
uniform float uChromaOffset;
uniform float uVignette;
uniform float uMouseHalo;
uniform float uPosterize;
uniform float uColorDrift;
uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2;
uniform vec3 uC3; uniform vec3 uC4; uniform vec3 uC5;
out vec4 fragColor;

float grainHash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 ramp(float t) {
  t = fract(t);
  float s = t * 6.0;
  float idx = floor(s);
  float w = mix(0.5, 0.04, clamp(uSharpness, 0.0, 1.0));
  float f = smoothstep(0.5 - w, 0.5 + w, fract(s));
  vec3 a, b;
  if (idx < 0.5)      { a = uC0; b = uC1; }
  else if (idx < 1.5) { a = uC1; b = uC2; }
  else if (idx < 2.5) { a = uC2; b = uC3; }
  else if (idx < 3.5) { a = uC3; b = uC4; }
  else if (idx < 4.5) { a = uC4; b = uC5; }
  else                { a = uC5; b = uC0; }
  return mix(a, b, f);
}

vec2 gentleDisplacement(vec2 uv, vec2 mouse, float t) {
  float dist = length(uv - mouse);
  return uv + uDispAmp * sin(uv.xy * uDispFreq + dist * uDispFreq + t);
}

float flowPattern(vec2 uv, float t) {
  float a = sin(uv.x * uFreq + t) * 0.5 + 0.5;
  float b = sin((uv.x + uv.y * uFlowX) * uFreq * 0.7 - t * 0.6) * 0.5 + 0.5;
  float c = sin((uv.x * 0.5 - uv.y * uFlowY * 0.4) * uFreq * 1.3 + t * 0.4) * 0.5 + 0.5;
  return (a + b * 0.7 + c * 0.5) / 2.2;
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = vUv;
  uv.x *= aspect;

  vec2 mouse = uMouse;
  mouse.x *= aspect;

  float t = uTime * uSpeed + uSeed;
  uv = gentleDisplacement(uv, mouse, t);

  vec2 chromaOff = vec2(uChromaOffset / max(uRes.y, 1.0), 0.0);
  float patG = flowPattern(uv, t);
  float patR = flowPattern(uv + chromaOff, t);
  float patB = flowPattern(uv - chromaOff, t);

  float steps = max(uPosterize, 1.0);
  float poster = step(1.5, uPosterize);
  patG = mix(patG, (floor(patG * steps) + 0.5) / steps, poster);
  patR = mix(patR, (floor(patR * steps) + 0.5) / steps, poster);
  patB = mix(patB, (floor(patB * steps) + 0.5) / steps, poster);

  float drift = t * uColorDrift;
  vec3 col = vec3(
    ramp(patR + drift).r,
    ramp(patG + drift).g,
    ramp(patB + drift).b
  );

  float luma = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(luma), col, uSaturation);
  col *= uIntensity;

  vec2 px = gl_FragCoord.xy / max(uGrainScale, 0.0001);
  float grainTime = floor(uTime * uGrainSpeed);

  float g1 = clamp(uGrain, 0.0, 1.0);
  float density1 = g1 * 0.45;
  float amp1 = g1 * 0.22;
  float h1 = grainHash(px + grainTime);
  float h2 = grainHash(px + grainTime + 71.3);
  col += vec3(step(1.0 - density1, h2) - step(1.0 - density1, h1)) * amp1;

  float g2 = clamp(uGrainTexture, 0.0, 1.0);
  vec2 px2 = floor(px * 0.45);
  float density2 = g2 * 0.5;
  float amp2 = g2 * 0.18;
  float h3 = grainHash(px2 + grainTime);
  float h4 = grainHash(px2 + grainTime + 41.7);
  col += vec3(step(1.0 - density2, h4) - step(1.0 - density2, h3)) * amp2;

  float md = distance(uv, mouse);
  col += exp(-md * md * 18.0) * uMouseHalo;

  vec2 vc = vUv * 2.0 - 1.0;
  float vd = dot(vc, vc);
  float vig = 1.0 - smoothstep(0.55, 1.6, vd);
  col *= mix(1.0, vig, uVignette);

  col = clamp(col, 0.0, 1.0);
  fragColor = vec4(col, 1.0);
}`;

  function initHeroShader(canvas) {
    if (!canvas || !window.WebGL2RenderingContext) return null;

    var gl = canvas.getContext("webgl2", {
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: "low-power"
    });

    if (!gl) return null;

    function compileShader(type, source) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("Hero shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    var vertexShader = compileShader(gl.VERTEX_SHADER, VERT);
    var fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAG);
    if (!vertexShader || !fragmentShader) return null;

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("Hero shader link error:", gl.getProgramInfoLog(program));
      return null;
    }

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    var aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var uniformNames = [
      "uRes", "uMouse", "uTime", "uSpeed", "uSeed", "uFreq", "uDispAmp",
      "uDispFreq", "uFlowY", "uFlowX", "uIntensity", "uSaturation",
      "uSharpness", "uGrain", "uGrainTexture", "uGrainScale", "uGrainSpeed",
      "uChromaOffset", "uVignette", "uMouseHalo", "uPosterize", "uColorDrift"
    ];
    var uniforms = {};
    uniformNames.forEach(function (name) {
      uniforms[name] = gl.getUniformLocation(program, name);
    });
    var colorUniforms = [0, 1, 2, 3, 4, 5].map(function (index) {
      return gl.getUniformLocation(program, "uC" + index);
    });

    gl.useProgram(program);

    var parameters = {
      speed: 0.2,
      seed: 10,
      frequency: 7,
      displacement: 0.018,
      displacementFreq: 4.5,
      mouseFollow: 0.03,
      flowY: 0.2,
      flowX: 0.2,
      intensity: 1,
      saturation: 1.25,
      sharpness: 0.7,
      grain: 0.1,
      grainTexture: 0.3,
      grainScale: 0.5,
      grainSpeed: 0,
      mouseInfluence: 0.55,
      chromaOffset: 13,
      vignette: 0,
      mouseHalo: 0.15,
      posterize: 0.1,
      colorDrift: 0.05
    };

    var colors = [
      [1, 0.2, 0.2],
      [1, 0.55, 0.1],
      [1, 0.85, 0.15],
      [0.25, 0.8, 0.35],
      [0.2, 0.45, 0.95],
      [0.65, 0.25, 0.9]
    ];

    function resize() {
      var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      var width = Math.max(1, Math.floor(canvas.clientWidth * pixelRatio));
      var height = Math.max(1, Math.floor(canvas.clientHeight * pixelRatio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    var resizeObserver = "ResizeObserver" in window ? new ResizeObserver(resize) : null;
    if (resizeObserver) resizeObserver.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });
    resize();

    var visible = true;
    var intersectionObserver = "IntersectionObserver" in window
      ? new IntersectionObserver(function (entries) {
          visible = entries[0] ? entries[0].isIntersecting : true;
        }, { threshold: 0 })
      : null;
    if (intersectionObserver) intersectionObserver.observe(canvas);

    var target = { x: 0.5, y: 0.5 };
    var current = { x: 0.5, y: 0.5 };

    function updatePointer(event) {
      var bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      target.x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      target.y = Math.max(0, Math.min(1, 1 - (event.clientY - bounds.top) / bounds.height));
    }

    canvas.addEventListener("pointermove", updatePointer, { passive: true });
    canvas.addEventListener("pointerleave", function () {
      target.x = 0.5;
      target.y = 0.5;
    }, { passive: true });

    function paint(now) {
      if (!visible) return;

      current.x += (target.x - current.x) * parameters.mouseFollow;
      current.y += (target.y - current.y) * parameters.mouseFollow;

      gl.useProgram(program);
      gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);
      gl.uniform2f(
        uniforms.uMouse,
        0.5 + (current.x - 0.5) * parameters.mouseInfluence,
        0.5 + (current.y - 0.5) * parameters.mouseInfluence
      );
      gl.uniform1f(uniforms.uTime, now / 1000);
      gl.uniform1f(uniforms.uSpeed, parameters.speed);
      gl.uniform1f(uniforms.uSeed, parameters.seed);
      gl.uniform1f(uniforms.uFreq, parameters.frequency);
      gl.uniform1f(uniforms.uDispAmp, parameters.displacement);
      gl.uniform1f(uniforms.uDispFreq, parameters.displacementFreq);
      gl.uniform1f(uniforms.uFlowY, parameters.flowY);
      gl.uniform1f(uniforms.uFlowX, parameters.flowX);
      gl.uniform1f(uniforms.uIntensity, parameters.intensity);
      gl.uniform1f(uniforms.uSaturation, parameters.saturation);
      gl.uniform1f(uniforms.uSharpness, parameters.sharpness);
      gl.uniform1f(uniforms.uGrain, parameters.grain);
      gl.uniform1f(uniforms.uGrainTexture, parameters.grainTexture);
      gl.uniform1f(uniforms.uGrainScale, parameters.grainScale);
      gl.uniform1f(uniforms.uGrainSpeed, parameters.grainSpeed);
      gl.uniform1f(uniforms.uChromaOffset, parameters.chromaOffset);
      gl.uniform1f(uniforms.uVignette, parameters.vignette);
      gl.uniform1f(uniforms.uMouseHalo, parameters.mouseHalo);
      gl.uniform1f(uniforms.uPosterize, parameters.posterize);
      gl.uniform1f(uniforms.uColorDrift, parameters.colorDrift);
      colors.forEach(function (color, index) {
        gl.uniform3f(colorUniforms[index], color[0], color[1], color[2]);
      });
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    var raf = 0;
    function loop(now) {
      paint(now);
      raf = requestAnimationFrame(loop);
    }

    var controller = {
      start: function () {
        if (!raf) raf = requestAnimationFrame(loop);
      },
      stop: function () {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      static: function () {
        resize();
        paint(1700);
      },
      destroy: function () {
        controller.stop();
        if (resizeObserver) resizeObserver.disconnect();
        if (intersectionObserver) intersectionObserver.disconnect();
        window.removeEventListener("resize", resize);
        canvas.removeEventListener("pointermove", updatePointer);
      }
    };

    return controller;
  }

  window.initHeroShader = initHeroShader;
})();
