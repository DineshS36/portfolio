import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const STAR_VERT = `
  uniform float uTime;
  uniform float uSpeed;
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
      vColor = aColor;
      
      // Move z towards camera
      float z = position.z + uTime * uSpeed;
      // Wrap around (depth is 2000, from -1000 to 1000)
      z = mod(z + 1000.0, 2000.0) - 1000.0;
      
      vec3 newPos = vec3(position.x, position.y, z);
      vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
      
      // Size attenuation based on depth
      gl_PointSize = aSize * (800.0 / -mvPosition.z);
      
      // Twinkle effect
      vAlpha = 0.3 + 0.7 * sin(uTime * 1.5 + position.x * 100.0 + position.y * 50.0);
      
      gl_Position = projectionMatrix * mvPosition;
  }
`;

const STAR_FRAG = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
      // Circular particle
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      
      // Soft edge
      float alpha = (0.5 - dist) * 2.0 * vAlpha;
      
      gl_FragColor = vec4(vColor, alpha);
  }
`;

export default function ThreeStarfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.0005); // Fade stars in the distance

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 1000; // Looking down the -Z axis

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 1. Create 3D Static/Twinkling Stars (GPU Accelerated)
    const starCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const colorPalette = [
      new THREE.Color(0xffffff), // White
      new THREE.Color(0xccccff), // Faint Blue
      new THREE.Color(0xeebbff), // Faint Purple
      new THREE.Color(0xffffff), // White (weighted more)
    ];

    for (let i = 0; i < starCount; i++) {
      // Spread stars across a volume: X(-2000, 2000), Y(-1000, 1000), Z(-1000, 1000)
      positions[i * 3] = (Math.random() - 0.5) * 4000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    const uniforms = {
      uTime: { value: 0 },
      uSpeed: { value: 100.0 } // Forward movement speed
    };

    const starMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: STAR_VERT,
      fragmentShader: STAR_FRAG,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const starSystem = new THREE.Points(geometry, starMaterial);
    scene.add(starSystem);

    // 2. Create 3D Shooting Stars (Meteors)
    const meteors = [];
    const meteorGeometry = new THREE.CylinderGeometry(0.5, 0.1, 100, 4);
    meteorGeometry.rotateX(Math.PI / 2); // align along Z axis
    
    const meteorMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const spawnMeteor = () => {
      const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);
      
      // Start far away
      meteor.position.x = (Math.random() - 0.5) * 2000;
      meteor.position.y = (Math.random() - 0.5) * 1000 + 500; // Prefer top half
      meteor.position.z = -1000;
      
      // Angle it diagonally towards the camera
      meteor.rotation.y = (Math.random() - 0.5) * 0.5;
      meteor.rotation.x = (Math.random() * 0.2) + 0.1;

      // Speed
      meteor.userData = {
        speed: Math.random() * 20 + 30,
        active: true
      };

      scene.add(meteor);
      meteors.push(meteor);
    };

    // 3. Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Update GPU stars time
      uniforms.uTime.value = elapsedTime;

      // Random chance to spawn meteor
      if (Math.random() < 0.02 && meteors.length < 5) {
        spawnMeteor();
      }

      // Update meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        if (m.userData.active) {
          m.translateZ(m.userData.speed);
          
          // Fade out as it passes camera
          if (m.position.z > 800) {
            m.material.opacity -= 0.02;
          }

          // Remove if past camera or faded out
          if (m.position.z > 1200 || m.material.opacity <= 0) {
            scene.remove(m);
            meteors.splice(i, 1);
          }
        }
      }

      // Gentle camera sway for life
      camera.position.x = Math.sin(elapsedTime * 0.2) * 50;
      camera.position.y = Math.cos(elapsedTime * 0.15) * 30;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // 4. Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      starMaterial.dispose();
      meteorGeometry.dispose();
      meteorMaterial.dispose();
    };
  }, []);

  return (
    <canvas 
      id="three-starfield-canvas"
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        pointerEvents: 'none',
        opacity: 0 // Default opacity 0, managed by Layout GSAP
      }}
    />
  );
}
