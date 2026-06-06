import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

function Model() {
  const { scene } = useGLTF("/model/avatarfinal.glb");
  const groupRef = useRef();
  const clock = useRef(0);

  // Track mouse position in normalized -1 to 1 space
  const mouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // GSAP entry animation â€” rises up from below
    gsap.fromTo(
      groupRef.current.position,
      { y: -4 },
      { y: -1, duration: 1.6, ease: "power3.out", delay: 0.2 }
    );

    const handleMouseMove = (e) => {
      // Normalize to -1 .. 1
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    clock.current += delta;

    // --- Floating ---
    // Sine wave on Y, small amplitude so it's subtle
    const floatY = Math.sin(clock.current * 2) * 0.08;
    groupRef.current.position.y = -1 + floatY;

    // --- Mouse tracking (smooth lerp toward target) ---
    // Max rotation: ~12 degrees horizontal, ~6 degrees vertical
    targetRotation.current.y = mouse.current.x * 0.6;
    targetRotation.current.x = mouse.current.y * -0.3;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current.y,
      0.5  // lower = slower/smoother, raise for snappier
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      0.05
    );
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      <primitive object={scene} scale={1.8} />
    </group>
  );
}

export default function CharacterScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#a78bca" />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color="#3a7bd5" />
      <Suspense fallback={null}>
        <Model />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
