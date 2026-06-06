import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/CharacterScene.css";

gsap.registerPlugin(ScrollTrigger);

const get3DPositionForDOMElement = (id, camera) => {
  const el = document.getElementById(id);
  if (!el) return null;

  const rect = el.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  // Convert to NDC (-1 to 1)
  const ndcX = (x / window.innerWidth) * 2 - 1;
  const ndcY = -(y / window.innerHeight) * 2 + 1;

  // Project ray from camera
  const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
  vector.unproject(camera);
  const dir = vector.sub(camera.position).normalize();
  const distance = -camera.position.z / dir.z;
  return camera.position.clone().add(dir.multiplyScalar(distance));
};

function Model() {
  const { scene } = useGLTF("/model/avatarfinal_compressed.glb");
  const groupRef = useRef();
  const clock = useRef(0);
  const { camera } = useThree();

  const mouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const activeSection = useRef("home");
  const hasDocked = useRef(false);
  const isSpinning = useRef(false);

  // References to the lights
  const dirLightRef = useRef();
  const pointLightRef = useRef();

  // Dynamic light target colors
  const dirColorDefault = new THREE.Color("#a78bca");
  const pointColorDefault = new THREE.Color("#3a7bd5");
  const dirColorArcade = new THREE.Color("#ff00ff");
  const pointColorArcade = new THREE.Color("#00ffff");

  const currentDirColor = useRef(dirColorDefault.clone());
  const currentPointColor = useRef(pointColorDefault.clone());

  useEffect(() => {
    // Mouse movement listener for tracking
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    // ScrollTrigger to bind scroll progress of Landing page
    const trigger = ScrollTrigger.create({
      trigger: "#home",
      start: "top top",
      end: () => "+=" + window.innerHeight,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
    });

    // Logo hover spin trigger
    const triggerSpin = () => {
      if (isSpinning.current) return;
      isSpinning.current = true;
      gsap.to(groupRef.current.rotation, {
        y: groupRef.current.rotation.y + Math.PI * 2,
        x: 0,
        duration: 1.2,
        ease: "power2.out",
        onComplete: () => {
          isSpinning.current = false;
        },
      });
    };

    // Spin every 5 seconds (idle animation) - only when docked in the navbar
    const spinInterval = setInterval(() => {
      if (scrollProgress.current >= 0.9) {
        triggerSpin();
      }
    }, 5000);

    const handleSectionChange = (e) => {
      activeSection.current = e.detail;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("avatar-spin", triggerSpin);
    window.addEventListener("section-change", handleSectionChange);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("avatar-spin", triggerSpin);
      window.removeEventListener("section-change", handleSectionChange);
      clearInterval(spinInterval);
      trigger.kill();
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    clock.current += delta;

    // --- Dynamic Light Colors ---
    const isArcade = activeSection.current === "arcade";
    const targetDirColor = isArcade ? dirColorArcade : dirColorDefault;
    const targetPointColor = isArcade ? pointColorArcade : pointColorDefault;

    currentDirColor.current.lerp(targetDirColor, 0.1);
    currentPointColor.current.lerp(targetPointColor, 0.1);

    if (dirLightRef.current) dirLightRef.current.color.copy(currentDirColor.current);
    if (pointLightRef.current) pointLightRef.current.color.copy(currentPointColor.current);

    // --- Scroll Position & Scale Interpolation ---
    const progress = scrollProgress.current;

    // Docking glitch trigger event
    if (progress >= 0.9 && !hasDocked.current) {
      hasDocked.current = true;
      window.dispatchEvent(new CustomEvent("avatar-dock"));
    } else if (progress < 0.9 && hasDocked.current) {
      hasDocked.current = false;
    }

    const heroPos = get3DPositionForDOMElement("hero-avatar-anchor", camera);
    const navPos = get3DPositionForDOMElement("navbar-avatar-anchor", camera);

    if (heroPos && navPos) {
      const isMobile = window.innerWidth <= 768;
      const yBase = isMobile ? -0.1 : -1.0;
      const yStart = heroPos.y + yBase;
      const yEnd = navPos.y;

      // Concave flight trajectory: X is linear, Y uses a cubic ease-in (starts flat and sweeps up steeply at the end)
      const interpolatedPos = new THREE.Vector3(
        THREE.MathUtils.lerp(heroPos.x, navPos.x, progress),
        THREE.MathUtils.lerp(yStart, yEnd, Math.pow(progress, 3.0)),
        THREE.MathUtils.lerp(heroPos.z, navPos.z, progress)
      );

      // bobbing amplitude reduces slightly but remains active in the navbar
      const floatY = Math.sin(clock.current * 2) * THREE.MathUtils.lerp(0.08, 0.03, progress);
      interpolatedPos.y += floatY;

      groupRef.current.position.copy(interpolatedPos);

      const isMobileSize = window.innerWidth <= 768;
      const heroScale = isMobileSize ? 0.8 : 1.8;
      const navScale = isMobileSize ? 0.06 : 0.14;

      // Make minimization faster at the start using an ease-out cubic curve
      const scaleProgress = 1 - Math.pow(1 - progress, 3);
      const targetScale = THREE.MathUtils.lerp(heroScale, navScale, scaleProgress);
      groupRef.current.scale.setScalar(targetScale);
    }

    // --- Mouse Rotation Tracking ---
    if (!isSpinning.current) {
      // Scale look sensitivity down (1.0 -> 0.4) and responsiveness lerp factor up (0.05 -> 0.20) as the model docks in the navbar
      const lookWeight = THREE.MathUtils.lerp(1.0, 0.4, progress);
      targetRotation.current.y = mouse.current.x * 0.6 * lookWeight;
      targetRotation.current.x = mouse.current.y * -0.3 * lookWeight;

      const lerpFactor = THREE.MathUtils.lerp(0.05, 0.20, progress);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y,
        lerpFactor
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        lerpFactor
      );
    }
  });

  return (
    <group ref={groupRef} scale={0.001}>
      {/* Lights embedded in model so they interpolate with the model */}
      <ambientLight intensity={0.5} />
      <directionalLight ref={dirLightRef} position={[5, 5, 5]} intensity={1.2} color="#a78bca" />
      <pointLight ref={pointLightRef} position={[-3, 2, 2]} intensity={0.8} color="#3a7bd5" />
      
      <primitive object={scene} />
    </group>
  );
}

export default function CharacterScene() {
  return (
    <div className="global-canvas-container">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <Model />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
