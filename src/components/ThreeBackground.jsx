import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RAY_VERT, RAY_FRAG, COMPOSITE_VERT, COMPOSITE_FRAG } from './shaders.js';

export default function ThreeBackground({ isHeroPage = true }) {
  const canvasRef = useRef(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const isInteractiveRef = useRef(false);
  const isHeroPageRef = useRef(isHeroPage);

  // Sync refs with state/props for use inside animation loop
  useEffect(() => {
    isInteractiveRef.current = isInteractive;
  }, [isInteractive]);

  useEffect(() => {
    isHeroPageRef.current = isHeroPage;
  }, [isHeroPage]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    let renderer, composer, bloomPass, compositePass, controls;
    let animationFrameId;
    let lastRenderMs = 0;
    const cpuCores = navigator.hardwareConcurrency || 8;
    const deviceMemory = navigator.deviceMemory || 8;
    const isLowPowerDevice = cpuCores <= 4 || deviceMemory <= 4;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch (e) {
      console.error('WebGL Initialization Error:', e);
      return;
    }

    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;

    // Detect half-float support for high dynamic range bloom
    let halfFloatOK = true;
    try {
      const gl = renderer.getContext();
      halfFloatOK = !!(
        gl.getExtension('EXT_color_buffer_float') ||
        gl.getExtension('EXT_color_buffer_half_float')
      );
    } catch (e) {
      halfFloatOK = false;
    }

    // Fullscreen raymarching quad
    const fsScene = new THREE.Scene();
    const fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const FIXED_PARAMS = {
      // Keep the shader viable on average laptops and phones. The original
      // 360-step setting was a desktop-demo quality level, not a web baseline.
      uSteps: isLowPowerDevice ? 120 : 200,
      uDin: 2.75,
      uDout: 40.0,
      uDopMax: 1.85,
      uOpNear: 0.90,
      uOpFar: 0.80,
      // Give the accretion disk enough presence behind the hero typography
      // without bringing back the expensive always-on bloom pass.
      uDiskBright: 1.42,
      uStarBright: 1.2,
      uSkyFloor: 0.0,
      // Visible differential rotation: inner rings move faster than outer ones,
      // giving the accretion disk a continuous living motion at no extra cost.
      uRotSpeed: 0.24,
      bloomStrength: 0.55,
      bloomRadius: 0.35,
      bloomThreshold: 0.55,
      vignette: 0.62,
      grain: 0.04,
      ca: 0.0008,
      fov: 44.0,
    };

    const uniforms = {
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uTime: { value: 0 },
      uCamPos: { value: new THREE.Vector3(0, 1.05, 23.98) },
      uCamTarget: { value: new THREE.Vector3(0, 0, 0) },
      uFov: { value: 1 / Math.tan(THREE.MathUtils.degToRad(FIXED_PARAMS.fov) / 2) },
      uSteps: { value: FIXED_PARAMS.uSteps | 0 },
      uRotSign: { value: 1.0 },
      uDebug: { value: 0 },
      uDin: { value: FIXED_PARAMS.uDin },
      uDout: { value: FIXED_PARAMS.uDout },
      uDopMax: { value: FIXED_PARAMS.uDopMax },
      uOpNear: { value: FIXED_PARAMS.uOpNear },
      uOpFar: { value: FIXED_PARAMS.uOpFar },
      uDiskBright: { value: FIXED_PARAMS.uDiskBright },
      uStarBright: { value: FIXED_PARAMS.uStarBright },
      uSkyFloor: { value: FIXED_PARAMS.uSkyFloor },
      uRotSpeed: { value: FIXED_PARAMS.uRotSpeed },
    };

    const fsMat = new THREE.ShaderMaterial({
      vertexShader: RAY_VERT,
      fragmentShader: RAY_FRAG,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    fsScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), fsMat));

    // Observer Camera: fixed home view, centred at yaw 0° and pitch 2.5°.
    // This keeps the accretion disk horizontal, like the chosen reference.
    const camera = new THREE.PerspectiveCamera(FIXED_PARAMS.fov, window.innerWidth / window.innerHeight, 0.01, 200);
    camera.position.set(0, 1.05, 23.98);
    camera.lookAt(0, 0, 0);

    // OrbitControls for interactive double-click exploration
    controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.0;
    controls.maxDistance = 150.0;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 0.8;
    controls.enabled = false; // Disabled initially in normal browsing mode

    // Post-processing pipeline (Bloom + Tone Mapping + Grain)
    const rtType = halfFloatOK ? THREE.HalfFloatType : THREE.UnsignedByteType;
    const rt = new THREE.WebGLRenderTarget(2, 2, { type: rtType, depthBuffer: false });
    composer = new EffectComposer(renderer, rt);
    composer.addPass(new RenderPass(fsScene, fsCam));

    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(2, 2),
      FIXED_PARAMS.bloomStrength,
      FIXED_PARAMS.bloomRadius,
      FIXED_PARAMS.bloomThreshold
    );
    // Bloom costs several extra fullscreen passes. Reserve it for the optional
    // Orbit Mode, where it is worth the GPU work.
    bloomPass.enabled = false;
    composer.addPass(bloomPass);

    compositePass = new ShaderPass(
      new THREE.ShaderMaterial({
        vertexShader: COMPOSITE_VERT,
        fragmentShader: COMPOSITE_FRAG,
        uniforms: {
          tDiffuse: { value: null },
          uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uTime: { value: 0 },
          uVignette: { value: FIXED_PARAMS.vignette },
          uGrain: { value: FIXED_PARAMS.grain },
          uCA: { value: FIXED_PARAMS.ca },
        },
      })
    );
    composer.addPass(compositePass);

    // Cursor Responsiveness (Smooth Damped LERP Parallax in normal mode)
    let mouseX = 0;
    let mouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouseY = (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };

    const handleMouseLeave = () => {
      mouseX = 0;
      mouseY = 0;
    };

    // A scroll should always settle the page back to the home composition.
    const handleScroll = () => {
      mouseX = 0;
      mouseY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Double-click toggle handler
    const handleDoubleClick = (e) => {
      const target = e.target;
      // Do not trigger if double-clicking inside interactive inputs/modals/buttons
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('.project-modal-backdrop') ||
        target.closest('a') ||
        target.closest('button')
      ) {
        return;
      }

      setIsInteractive((prev) => {
        const next = !prev;
        if (next) {
          canvas.style.pointerEvents = 'auto';
          canvas.style.zIndex = '9999'; // Elevate canvas above page content for direct, exclusive drag
          canvas.style.cursor = 'grab';
          document.body.style.userSelect = 'none';
          controls.enabled = true;
          controls.target.set(0, 0, 0);
          controls.update();
        } else {
          canvas.style.pointerEvents = 'none';
          canvas.style.zIndex = '-1'; // Return behind content for normal browsing
          canvas.style.cursor = 'default';
          document.body.style.userSelect = '';
          controls.enabled = false;
          mouseX = 0;
          mouseY = 0;
        }
        return next;
      });
    };

    const handlePointerDown = () => {
      if (isInteractiveRef.current) {
        canvas.style.cursor = 'grabbing';
      }
    };

    const handlePointerUp = () => {
      if (isInteractiveRef.current) {
        canvas.style.cursor = 'grab';
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsInteractive(false);
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        canvas.style.cursor = 'default';
        document.body.style.userSelect = '';
        controls.enabled = false;
        mouseX = 0;
        mouseY = 0;
      }
    };

    window.addEventListener('dblclick', handleDoubleClick);
    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    const _dbSize = new THREE.Vector2();
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // This shader runs per pixel. Rendering at native Retina resolution made
      // the page needlessly expensive, especially on integrated GPUs.
      const qualityDpr = isLowPowerDevice ? 0.7 : 1.0;
      const dpr = Math.min(window.devicePixelRatio || 1, qualityDpr);

      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      composer.setPixelRatio(dpr);
      composer.setSize(w, h);

      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();

      renderer.getDrawingBufferSize(_dbSize);
      uniforms.uRes.value.copy(_dbSize);
      compositePass.uniforms.uRes.value.copy(_dbSize);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const initTime = performance.now();

    // Render Animation Loop
    const tick = () => {
      // If we are not on the hero page, skip rendering entirely to free up 100% of GPU
      if (!isHeroPageRef.current) {
        animationFrameId = window.requestAnimationFrame(tick);
        return;
      }

      // If user has scrolled past the hero, pause raymarching completely (0% GPU usage)
      const isHeroVisible = window.scrollY < window.innerHeight * 1.05;
      if (!isHeroVisible && !isInteractiveRef.current) {
        animationFrameId = window.requestAnimationFrame(tick);
        return;
      }

      const now = performance.now();
      const elapsedTime = (now - initTime) * 0.001;

      if (isInteractiveRef.current) {
        // Free Orbit Mode: OrbitControls has full 3D authority
        controls.update();
      } else {
        // The non-interactive site smoothly glides with subtle mouse parallax
        smoothMouseX += (mouseX - smoothMouseX) * 0.05;
        smoothMouseY += (mouseY - smoothMouseY) * 0.05;

        const radius = 24.0;
        const baseAngle = 0; // Centered horizontal yaw: 0°
        const curAzimuth = baseAngle + smoothMouseX * 0.035;
        const baseInc = THREE.MathUtils.degToRad(2.5);
        const curInclination = THREE.MathUtils.clamp(baseInc - smoothMouseY * 0.025, 0.01, 0.16);

        const targetX = radius * Math.cos(curInclination) * Math.sin(curAzimuth);
        const targetY = radius * Math.sin(curInclination);
        const targetZ = radius * Math.cos(curInclination) * Math.cos(curAzimuth);

        // Smoothly glide back if exiting interactive mode
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;
        camera.position.z += (targetZ - camera.position.z) * 0.05;

        camera.lookAt(0, 0, 0);
      }

      // Sync uniforms
      uniforms.uTime.value = elapsedTime;
      uniforms.uCamPos.value.copy(camera.position);
      uniforms.uCamTarget.value.set(0, 0, 0);
      compositePass.uniforms.uTime.value = elapsedTime;

      // Render smoothly synced with display VSync
      const minFrameMs = isInteractiveRef.current ? 16 : (isLowPowerDevice ? 28 : 16);
      if (now - lastRenderMs >= minFrameMs) {
        bloomPass.enabled = halfFloatOK && isInteractiveRef.current;
        composer.render();
        lastRenderMs = now;
      }
      animationFrameId = window.requestAnimationFrame(tick);
    };

    tick();

    // WebGL Context Loss Handlers
    const handleContextLost = (e) => {
      e.preventDefault();
      cancelAnimationFrame(animationFrameId);
    };
    const handleContextRestored = () => {
      handleResize();
      tick();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('dblclick', handleDoubleClick);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      window.cancelAnimationFrame(animationFrameId);
      if (controls) controls.dispose();
      if (composer) composer.dispose();
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas id="webgl-canvas" ref={canvasRef}></canvas>
      <div className={`bg-overlay${isInteractive ? ' orbit-active' : ''}`}></div>

      {isInteractive && (
        <div className="orbit-mode-badge" role="status" aria-live="polite">
          <span className="badge-title">✦ 3D ORBIT ACTIVE</span>
          <span className="badge-hint">DRAG TO ROTATE · SCROLL TO ZOOM · DOUBLE-CLICK OR ESC TO EXIT</span>
        </div>
      )}
    </>
  );
}
