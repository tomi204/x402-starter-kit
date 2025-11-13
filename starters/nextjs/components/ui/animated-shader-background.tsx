"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const AnimatedShaderBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      antialias: false, // Disable antialiasing for better performance
      alpha: true,
      powerPreference: 'high-performance', // Request high-performance GPU
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio for performance
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;

        #define NUM_OCTAVES 3

        float rand(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 u = fract(p);
          u = u*u*(3.0-2.0*u);

          float res = mix(
            mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
            mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
          return res * res;
        }

        float fbm(vec2 x) {
          float v = 0.0;
          float a = 0.3;
          vec2 shift = vec2(100);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x = rot * x * 2.0 + shift;
            a *= 0.4;
          }
          return v;
        }

        void main() {
          vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
          vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
          vec2 v;
          vec4 o = vec4(0.0);

          float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5;

          // Reduced iterations for better performance (25 instead of 40)
          for (float i = 0.0; i < 25.0; i++) {
            v = p + cos(i * i + (iTime + p.x * 0.1) * 0.04 + i * vec2(13.0, 11.0)) * 3.0 + vec2(sin(iTime * 4.0 + i) * 0.008, cos(iTime * 4.5 - i) * 0.008);
            float tailNoise = fbm(v + vec2(iTime * 0.8, i)) * 0.5 * (1.0 - (i / 25.0));

            // AVALANCHE RED COLOR SCHEME - OPTIMIZED
            vec4 auroraColors = vec4(
              0.92 + 0.08 * sin(i * 0.2 + iTime * 0.5),  // Very high red (0.92-1.0)
              0.18 + 0.15 * cos(i * 0.3 + iTime * 0.6),  // Medium green (0.18-0.33)
              0.18 + 0.15 * sin(i * 0.4 + iTime * 0.4),  // Medium blue (0.18-0.33)
              1.0
            );

            vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * 1.0)) / length(max(v, vec2(v.x * f * 0.012, v.y * 1.2)));
            float thinnessFactor = smoothstep(0.0, 1.0, i / 25.0) * 0.85;
            o += currentContribution * (1.0 + tailNoise * 1.3) * thinnessFactor;
          }

          o = tanh(pow(o / 70.0, vec4(1.35)));

          // Enhance red tones dramatically
          o.r *= 2.4; // Much more red
          o.g *= 0.35; // Keep some warmth
          o.b *= 0.35; // Keep some warmth

          gl_FragColor = o * 2.8;
        }
      `,
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId: number;
    let lastTime = 0;
    const targetFPS = 30; // Target 30 FPS for better performance (was 60)
    const frameTime = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      frameId = requestAnimationFrame(animate);

      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameTime) return; // Skip frame if too soon

      lastTime = currentTime - (deltaTime % frameTime);
      material.uniforms.iTime.value += 0.02; // Smooth animation
      renderer.render(scene, camera);
    };
    animate(0);

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [mounted]);

  // Don't render anything on server
  if (!mounted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-10 opacity-60"
      style={{
        pointerEvents: 'none',
        willChange: 'transform', // Optimize for animations
      }}
    />
  );
};

export default AnimatedShaderBackground;
