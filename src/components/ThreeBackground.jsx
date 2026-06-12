import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.0015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Central Wireframe Geometry
    const geometry = new THREE.IcosahedronGeometry(12, 1);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
    const wireframe = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), material);
    scene.add(wireframe);

    const coreGeometry = new THREE.IcosahedronGeometry(8, 0);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // Particle System
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 100;
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05, color: 0xffffff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 30;

    let mouseX = 0; 
    let mouseY = 0;
    let targetX = 0; 
    let targetY = 0;

    const handleMouseMove = (event) => {
        mouseX = (event.clientX - window.innerWidth / 2);
        mouseY = (event.clientY - window.innerHeight / 2);
    };

    document.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    let animationFrameId;

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        wireframe.rotation.y = elapsedTime * 0.1;
        wireframe.rotation.x = elapsedTime * 0.05;
        core.rotation.y = elapsedTime * 0.15;
        core.rotation.z = elapsedTime * 0.05;

        particlesMesh.rotation.y = -elapsedTime * 0.02;
        particlesMesh.rotation.x = elapsedTime * 0.01;

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        camera.position.x += (targetX * 5 - camera.position.x) * 0.05;
        camera.position.y += (-targetY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        animationFrameId = window.requestAnimationFrame(tick);
    };

    tick();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listeners and animations on unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId);
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas id="webgl-canvas" ref={canvasRef}></canvas>
      <div className="bg-overlay"></div>
    </>
  );
}
