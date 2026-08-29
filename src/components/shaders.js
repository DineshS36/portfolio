// GARGANTUA — Schwarzschild Black Hole Raytracer GLSL Kernels

export const RAY_VERT = /* glsl */`
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const RAY_FRAG = /* glsl */`
precision highp float;

varying vec2 vUv;

uniform vec2  uRes;
uniform float uTime;
uniform vec3  uCamPos;
uniform vec3  uCamTarget;
uniform float uFov;
uniform int   uSteps;
uniform float uRotSign;
uniform int   uDebug;
uniform float uDin;
uniform float uDout;
uniform float uDopMax;
uniform float uOpNear;
uniform float uOpFar;
uniform float uDiskBright;
uniform float uStarBright;
uniform float uSkyFloor;
uniform float uRotSpeed;

#define RS 1.0

// ---------------- Noise & Procedural FBM ----------------
float hash1(vec3 p){
  p = fract(p*0.3183099 + vec3(0.10,0.17,0.13));
  p *= 17.0;
  return fract(p.x*p.y*p.z*(p.x+p.y+p.z));
}
vec3 hash3(vec3 p){
  p = fract(p*vec3(0.1031,0.1030,0.0973));
  p += dot(p, p.yxz+33.33);
  return fract((p.xxy+p.yxx)*p.zyx);
}
float vnoise(vec3 x){
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f*f*(3.0-2.0*f);
  float n000 = hash1(i);
  float n100 = hash1(i+vec3(1.0,0.0,0.0));
  float n010 = hash1(i+vec3(0.0,1.0,0.0));
  float n110 = hash1(i+vec3(1.0,1.0,0.0));
  float n001 = hash1(i+vec3(0.0,0.0,1.0));
  float n101 = hash1(i+vec3(1.0,0.0,1.0));
  float n011 = hash1(i+vec3(0.0,1.0,1.0));
  float n111 = hash1(i+vec3(1.0,1.0,1.0));
  return mix(mix(mix(n000,n100,f.x), mix(n010,n110,f.x), f.y),
             mix(mix(n001,n101,f.x), mix(n011,n111,f.x), f.y), f.z);
}
float fbm(vec3 p){
  float v = 0.0;
  float a = 0.5;
  for(int i=0;i<5;i++){
    v += a*vnoise(p);
    p = p*2.03 + 11.3;
    a *= 0.5;
  }
  return v;
}

// ---------------- Pseudo-Blackbody Spectrum ----------------
vec3 blackbody(float t){
  vec3 c = mix(vec3(0.55,0.06,0.01), vec3(1.00,0.42,0.10), smoothstep(0.00,0.55,t));
  c = mix(c, vec3(1.00,0.86,0.55), smoothstep(0.50,1.05,t));
  c = mix(c, vec3(0.85,0.92,1.25), smoothstep(1.05,1.90,t));
  return c;
}

// ---------------- Starfield & Milky Way ----------------
mat3 layerRot(float ay, float ax){
  float cy = cos(ay), sy = sin(ay), cx = cos(ax), sx = sin(ax);
  return mat3(cy,0.0,-sy,  sy*sx,cx,cy*sx,  sy*cx,-sx,cy*cx);
}
vec3 starLayer(vec3 d, float scale, float thresh, mat3 rot, float sharp){
  vec3 p = rot*d*scale;
  vec3 id = floor(p);
  vec3 f = fract(p);
  float h = hash1(id);
  if(h < thresh) return vec3(0.0);
  vec3 sp = 0.15 + 0.70*hash3(id + 4.7);
  float dist = length(f - sp);
  float star = exp(-dist*dist*sharp);
  float bright = (h - thresh)/(1.0 - thresh);
  bright *= bright;
  vec3 tint = mix(vec3(0.90,0.95,1.0), vec3(1.0,0.95,0.85), hash1(id + 13.1));
  return star*bright*tint*4.0;
}
vec3 heroStars(vec3 d){
  vec3 p = d*14.0;
  vec3 id = floor(p);
  vec3 f = fract(p);
  float h = hash1(id + 91.7);
  if(h < 0.9975) return vec3(0.0);
  vec3 sp = 0.20 + 0.60*hash3(id + 3.3);
  float dist = length(f - sp);
  float glow = exp(-dist*dist*22.0)*0.85 + exp(-dist*dist*240.0)*1.5;
  vec3 tint = mix(vec3(0.92,0.96,1.0), vec3(1.0,0.92,0.80), step(0.5, hash1(id + 5.5)));
  return glow*tint;
}
vec3 milkyway(vec3 d){
  vec3 n = normalize(vec3(0.25,1.0,0.15));
  float w = dot(d,n);
  float band = exp(-w*w*7.0);
  vec3 p = d*2.6;
  float cloud = fbm(p*1.4 + 5.2);
  float dust  = fbm(p*2.3 + 9.1);
  // Pure neutral deep space - zero purple/magenta tint
  vec3 col = vec3(0.02, 0.025, 0.03) * smoothstep(0.30, 0.85, cloud);
  col *= band;
  col *= 1.0 - 0.60*smoothstep(0.45,0.85,dust);
  return col;
}
vec3 background(vec3 d){
  vec3 col = milkyway(d);
  col += starLayer(d,  26.0, 0.952, layerRot(0.7,0.4), 120.0);
  col += starLayer(d,  47.0, 0.952, layerRot(2.1,1.1), 200.0);
  col += starLayer(d,  83.0, 0.952, layerRot(4.0,2.3), 320.0);
  col += starLayer(d, 150.0, 0.968, layerRot(5.3,0.9), 480.0);
  col += heroStars(d);
  return col*uStarBright;
}

// Motion through space: stars stream from right to left.  The black hole
// bends each path near its centre, producing a passing-by / slingshot feel
// rather than a uniform orbiting vortex.
vec2 streamPath(float life, float seed){
  float x = mix(1.42, -1.48, life);
  float impact = mix(-0.62, 0.62, hash1(vec3(seed, 11.0, 2.0)));
  float side = impact < 0.0 ? -1.0 : 1.0;
  float closest = exp(-x*x*4.2);
  float pull = (0.11 + 0.28*(1.0-abs(impact))) * closest;

  // The star falls toward the black hole, then exits on a curved trajectory.
  float y = impact - side*pull;
  y += side*0.075*sin(life*3.1415926)*closest;
  return vec2(x, y);
}

vec3 gravityStars(vec2 p, float time){
  vec3 col = vec3(0.0);

  for(int i = 0; i < 18; i++){
    float id = float(i);
    float seed = hash1(vec3(id, 17.3, 83.1));
    float speed = mix(0.052, 0.095, hash1(vec3(id, 9.1, 2.7)));
    float life = fract(seed + time*speed);
    float captured = step(0.90, hash1(vec3(id, 28.4, 5.2)));
    vec2 starPos;

    if(captured > 0.5){
      // A rare star is captured and spirals into the event horizon.
      float radius = mix(1.18, 0.13, life*life);
      float angle = 0.10 + life*(2.1 + 2.0*life) + seed*0.35;
      starPos = vec2(cos(angle), sin(angle))*radius;
    } else {
      starPos = streamPath(life, seed);
    }

    float size = mix(0.0018, 0.0035, hash1(vec3(id, 41.0, 6.4)));
    float dist = length(p - starPos);
    float core = exp(-dist*dist/(size*size));
    float halo = exp(-dist*dist/(size*size*16.0))*0.16;

    // Previous path samples make a restrained high-speed star trail.
    float trail = 0.0;
    for(int j = 1; j <= 2; j++){
      float previousLife = max(life - float(j)*0.018, 0.0);
      vec2 previousPos = captured > 0.5
        ? vec2(cos(0.10 + previousLife*(2.1 + 2.0*previousLife) + seed*0.35),
               sin(0.10 + previousLife*(2.1 + 2.0*previousLife) + seed*0.35))
          * mix(1.18, 0.13, previousLife*previousLife)
        : streamPath(previousLife, seed);
      float trailDist = length(p - previousPos);
      trail += exp(-trailDist*trailDist/(size*size*2.8))*0.10/float(j);
    }

    float twinkle = 0.62 + 0.38*sin(time*(2.0 + seed*3.0) + seed*31.0);
    float horizonFade = smoothstep(0.11, 0.20, length(starPos));
    vec3 tint = mix(vec3(0.58, 0.76, 1.0), vec3(1.0, 0.72, 0.34), seed);
    col += tint*(core + halo + trail)*twinkle*horizonFade;
  }

  return col*0.36;
}

// ---------------- Schwarzschild Null-Geodesic Accel ----------------
vec3 accAt(vec3 p, vec3 v){
  vec3 h = cross(p, v);
  float r2 = dot(p, p);
  return -1.5*RS*dot(h, h)/(r2*r2*sqrt(r2))*p;
}

// ---------------- Accretion Disk Crossing ----------------
bool diskCross(vec3 a, vec3 b, vec3 rayDir, inout vec3 col, inout float trans){
  if(a.y*b.y > 0.0) return false;
  float t = abs(a.y)/(abs(a.y) + abs(b.y) + 1e-5);
  vec3 q = mix(a, b, t);
  float qr = length(q.xz);
  if(qr <= uDin || qr >= uDout) return false;

  float ang = atan(q.z, q.x);
  float x = max(qr, 3.001);
  float flux = max(pow(x/3.0, -3.0)*(1.0 - sqrt(3.0/x)), 0.0);
  float temp = pow(flux*10.0, 0.25);

  float omega = uRotSign*1.1*uRotSpeed*pow(3.0/qr, 1.5);
  float rot = omega*uTime;
  float ca = cos(rot), sa = sin(rot);
  vec3 qp = vec3(ca*q.x + sa*q.z, 0.0, -sa*q.x + ca*q.z);
  vec2 rp = qp.xz/qr;

  vec3 pc = vec3(rp.x*3.0, rp.y*3.0, qr*0.85);
  vec3 warp = vec3(
    fbm(pc*1.5),
    fbm(pc*1.5 + vec3(5.2,1.3,2.8)),
    fbm(pc*1.5 + vec3(9.7,4.1,7.3)));
  float turb = fbm(pc*2.0 + warp*1.5);
  float innerDetail = 1.0 - smoothstep(4.0, 18.0, qr);
  turb = mix(0.50, turb*1.7, innerDetail);
  float streakN = fbm(vec3(rp.x*22.0, rp.y*22.0, qr*1.4));
  float streak = mix(0.95, mix(0.55, 1.15, smoothstep(0.25, 0.85, streakN)), innerDetail);
  float lane = fbm(vec3(rp.x*5.0, rp.y*5.0, qr*0.55) + warp*0.8);
  float laneMask = mix(0.85, mix(0.50, 1.30, smoothstep(0.15, 0.80, lane)), innerDetail);
  float radialGain = mix(0.38, 1.0, innerDetail);

  float I = flux*11.0*turb*streak*laneMask*radialGain;
  I += exp(-pow((qr-3.1)*3.0, 2.0))*2.8;

  float outerFade = 1.0 - smoothstep(uDout-14.0, uDout, qr);
  I *= outerFade;

  // Relativistic Doppler Beaming + Gravitational Redshift
  float beta = sqrt(0.5/qr);
  float gamma = 1.0/sqrt(max(1.0 - beta*beta, 1e-4));
  vec3 tdir = normalize(vec3(-sin(ang), 0.0, cos(ang)))*uRotSign;
  float dop = 1.0/(gamma*(1.0 - dot(tdir*beta, rayDir)));
  dop = clamp(dop, 0.50, uDopMax);
  float g = sqrt(max(1.0 - RS/qr, 0.0));

  vec3 dcol = blackbody(temp*dop*g) * I * (dop*dop*dop) * g * uDiskBright;
  float alpha = mix(uOpFar, uOpNear, 1.0 - smoothstep(4.0, 13.0, qr)) * outerFade;
  col += trans * alpha * dcol;
  trans *= 1.0 - alpha;
  if(trans < 0.02){ trans = 0.0; return true; }
  return false;
}

// ---------------- Raymarcher Main Loop ----------------
void main(){
  vec2 p = (gl_FragCoord.xy - 0.5*uRes)/uRes.y;
  vec3 ro = uCamPos;
  vec3 ww = normalize(uCamTarget - ro);
  vec3 uu = normalize(cross(ww, vec3(0.0,1.0,0.0)));
  vec3 vv = cross(uu, ww);
  vec3 rd = normalize(p.x*uu + p.y*vv + uFov*ww);

  vec3 pos = ro;
  vec3 vel = rd;
  vec3 col = vec3(0.0);
  vec3 haloCol = vec3(0.0);
  float trans = 1.0;
  float minR = 1e5;
  float lastR = length(ro);

  for(int i=0;i<240;i++){
    if(i >= uSteps) break;
    float r = length(pos);
    lastR = r;
    if(r < 1.03*RS){ trans = 0.0; break; } // Event Horizon
    if(r > 45.0 && dot(pos,vel) > 0.0){ break; } // Escaped ray
    minR = min(minR, r);

    float dt = max(0.012, r*mix(0.02, 0.06, smoothstep(6.0, 20.0, r)));

    // Volumetric Disk Halo
    float absY = abs(pos.y);
    if(absY < 0.45 && r > uDin && r < uDout){
      float dens = exp(-absY*30.0)*0.03*(1.0 - smoothstep(10.0, uDout-1.0, r));
      float xh = max(r, 3.001);
      float fluxh = max(pow(xh/3.0, -3.0)*(1.0 - sqrt(3.0/xh)), 0.0);
      vec3 glowc = blackbody(pow(fluxh*10.0, 0.25)*0.9);
      haloCol += trans * glowc * (fluxh*3.5) * dens * dt * uDiskBright;
    }

    if(r < 4.4){
      // RK2 Midpoint sub-step integration near photon sphere
      float hdt = dt*0.5;
      bool absorbed = false;
      for(int s = 0; s < 2; s++){
        vec3 k1 = accAt(pos, vel);
        vec3 pm = pos + vel*(hdt*0.5);
        vec3 vm = normalize(vel + k1*(hdt*0.5));
        vec3 k2 = accAt(pm, vm);
        vec3 pn = pos + vm*hdt;
        vel = normalize(vel + k2*hdt);
        if(diskCross(pos, pn, vel, col, trans)) absorbed = true;
        pos = pn;
        minR = min(minR, length(pos));
      }
      if(absorbed) break;
    } else {
      vel = normalize(vel + accAt(pos, vel)*dt);
      vec3 npos = pos + vel*dt;
      if(diskCross(pos, npos, vel, col, trans)){
        pos = npos;
        break;
      }
      pos = npos;
    }
  }

  vec3 bgAdd = vec3(0.0);
  if(trans > 0.0){
    float deep = clamp((lastR-1.03)*0.45, 0.45, 1.0);
    col += haloCol * deep;
    bgAdd = trans * background(vel) * deep;
  }
  // Photon ring perigee critical curve
  vec3 ringAdd = vec3(1.0,0.92,0.80) * exp(-pow((minR-1.55)*4.0, 2.0)) * 0.05;

  vec3 outCol = col + bgAdd + ringAdd;
  outCol += gravityStars(p, uTime);
  outCol = clamp(max(outCol, vec3(0.0)), vec3(0.0), vec3(64.0));
  gl_FragColor = vec4(outCol, 1.0);
}
`;

export const COMPOSITE_VERT = /* glsl */`
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const COMPOSITE_FRAG = /* glsl */`
precision highp float;

varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform vec2  uRes;
uniform float uTime;
uniform float uVignette;
uniform float uGrain;
uniform float uCA;

vec3 aces(vec3 x){
  return clamp((x*(2.51*x + 0.03))/(x*(2.43*x + 0.59) + 0.14), 0.0, 1.0);
}
float ghash(vec2 p){
  return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453);
}
void main(){
  vec2 uv = vUv;
  vec2 dir = uv - 0.5;

  float ca = uCA*dot(dir, dir);
  vec3 col;
  col.r = texture2D(tDiffuse, uv + dir*ca).r;
  col.g = texture2D(tDiffuse, uv).g;
  col.b = texture2D(tDiffuse, uv - dir*ca).b;

  col *= 0.95;
  col = aces(col);

  float aspect = uRes.x/max(uRes.y, 1.0);
  float vig = smoothstep(1.30, 0.30, length(dir*vec2(aspect, 1.0))*1.15);
  col *= mix(1.0, vig, uVignette);

  float g = ghash(gl_FragCoord.xy + fract(uTime*13.7)*97.0) - 0.5;
  col += g*uGrain*(1.0 - 0.5*col);

  gl_FragColor = vec4(col, 1.0);
}
`;
