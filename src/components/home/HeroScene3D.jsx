import { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  MeshTransmissionMaterial,
  Sparkles,
  Float,
  useProgress,
  Html,
} from "@react-three/drei";
import * as THREE from "three";

const AMBER = "#FFC700";
const AMBER_HEX = 0xffc700;

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let frame = 0;
    let latest = { x: 0, y: 0 };
    const onMove = (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      latest = {
        x: (e.clientX / w) * 2 - 1,
        y: -(e.clientY / h) * 2 + 1,
      };
      if (!frame) {
        frame = requestAnimationFrame(() => {
          setPos(latest);
          frame = 0;
        });
      }
    };
    const onLeave = () => {
      latest = { x: 0, y: 0 };
      setPos({ x: 0, y: 0 });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return pos;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => {
      const isTouchOnly = !window.matchMedia("(hover: hover)").matches;
      const isSmall = window.innerWidth < 768;
      const saveData =
        navigator.connection && navigator.connection.saveData;
      setIsMobile(isTouchOnly || isSmall || saveData);
    };
    const checkReduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    checkMobile();
    setPrefersReduced(checkReduced());
    window.addEventListener("resize", checkMobile);
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    mql.addEventListener("change", checkReduced);
    return () => {
      window.removeEventListener("resize", checkMobile);
      mql.removeEventListener("change", checkReduced);
    };
  }, []);
  return isMobile || prefersReduced;
}

function useInViewport() {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let frame = 0;
    const hero = document.getElementById("hero-scene");
    if (!hero) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (frame) {
            cancelAnimationFrame(frame);
            frame = 0;
          }
          frame = requestAnimationFrame(() => {
            setInView(entry.isIntersecting);
          }, 0);
        });
      },
      { threshold: [0, 0.1, 0.5] }
    );
    observer.observe(hero);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return inView;
}

const APERTURE_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uMouseX;
  uniform float uAmplitude;
  varying vec2 vUv;
  varying float vElevation;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin(uv.x * 20.0 + uTime * 2.0) * 0.003;
    pos.z += wave * uAmplitude;
    vElevation = pos.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const APERTURE_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uMouseX;
  uniform vec3 uColor;
  uniform float uIris;
  varying vec2 vUv;
  varying float vElevation;
  void main() {
    float dist = length(vUv - 0.5);
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    float iris = 1.0 - smoothstep(0.3, 0.5, dist * (1.0 + uIris));
    vec3 color = uColor;
    color += vec3(0.1, 0.05, 0.0) * sin(uTime * 3.0 + vUv.x * 10.0);
    gl_FragColor = vec4(color, alpha * iris);
    if (gl_FragColor.a < 0.01) discard;
  }
`;

function ApertureBlade({ index, total }) {
  const angle = (index / total) * Math.PI * 2;
  const inner = 0.8;
  const outer = 1.8;
  const midAngle = angle;
  const base = new THREE.Shape();
  base.moveTo(Math.cos(midAngle - 0.15) * inner, Math.sin(midAngle - 0.15) * inner);
  base.lineTo(Math.cos(midAngle + 0.15) * inner, Math.sin(midAngle + 0.15) * inner);
  base.lineTo(Math.cos(midAngle + 0.35) * outer, Math.sin(midAngle + 0.35) * outer);
  base.lineTo(Math.cos(midAngle - 0.35) * outer, Math.sin(midAngle - 0.35) * outer);
  base.closePath();
  const shape = base;
  const extrudeGeometry = new THREE.ExtrudeGeometry(
    shape,
    { depth: 0.02, bevelEnabled: false }
  );
  extrudeGeometry.computeVertexNormals();

  return (
    <mesh
      geometry={extrudeGeometry}
      rotation={[0, 0, midAngle]}
      position={[0, 0, 0.01]}
    >
      <meshStandardMaterial
        color={AMBER_HEX}
        emissive={AMBER_HEX}
        emissiveIntensity={0.4}
        metalness={0.9}
        roughness={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Aperture({ mouse }) {
  const groupRef = useRef();
  const bladeCount = 8;

  const uniforms = useRef({
    uTime: { value: 0 },
    uMouseX: { value: 0 },
    uAmplitude: { value: 0.6 },
    uColor: { value: new THREE.Color(AMBER) },
    uIris: { value: 0.0 },
  });

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    uniforms.current.uTime.value = t;
    uniforms.current.uMouseX.value = mouse.x || 0;
    uniforms.current.uIris.value = (mouse.x || 0) * 0.5 + 0.5;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.x * 0.3,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouse.y * 0.15,
      0.05
    );
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: bladeCount }).map((_, i) => (
        <ApertureBlade key={i} index={i} total={bladeCount} />
      ))}
    </group>
  );
}

function LensElement({ mouse }) {
  const lensRef = useRef();

  useFrame(() => {
    if (!lensRef.current) return;
    lensRef.current.rotation.y = THREE.MathUtils.lerp(
      lensRef.current.rotation.y,
      mouse.x * 0.4,
      0.04
    );
    lensRef.current.rotation.x = THREE.MathUtils.lerp(
      lensRef.current.rotation.x,
      mouse.y * 0.2,
      0.04
    );
    lensRef.current.rotation.z += 0.0008;
  });

  return (
    <group ref={lensRef}>
      <mesh position={[0, 0, -0.01]}>
        <cylinderGeometry args={[1.1, 1.1, 0.08, 64, 1]} />
        <MeshTransmissionMaterial
          color={new THREE.Color(0.1, 0.08, 0.04)}
          backdropColor={new THREE.Color(0.98, 0.78, 0.02)}
          transparent
          opacity={0.7}
          metalness={0.1}
          roughness={0.02}
          ior={1.6}
          thickness={0.4}
          chromaticAberration={0.04}
          transmission={1.0}
          anisotropy={0.2}
          iridescence={0.3}
        />
      </mesh>
      <mesh position={[0, 0, -0.06]}>
        <torusGeometry args={[1.35, 0.06, 16, 100]} />
        <meshStandardMaterial
          color={AMBER_HEX}
          emissive={AMBER_HEX}
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function BokehParticles() {
  const groupRef = useRef();
  const count = 120;
  const positions = useRef(new Float32Array(count * 3));
  const scales = useRef(new Float32Array(count));
  const phases = useRef(new Float32Array(count));
  const colors = useRef(new Float32Array(count * 3));

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const radius = 2.5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions.current[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions.current[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions.current[i * 3 + 2] = radius * Math.cos(phi);
      scales.current[i] = 0.02 + Math.random() * 0.12;
      phases.current[i] = Math.random() * Math.PI * 2;
      const shade = 0.8 + Math.random() * 0.2;
      colors.current[i * 3] = shade;
      colors.current[i * 3 + 1] = shade * 0.8;
      colors.current[i * 3 + 2] = 0;
    }
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const pos = positions.current;
    for (let i = 0; i < count; i++) {
      const iy = i * 3 + 1;
      pos[iy] += Math.sin(t * 0.3 + phases.current[i]) * 0.0005;
    }
    groupRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={groupRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={count}
          array={scales.current}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
        vertexColors
      />
    </points>
  );
}

function SceneContent({ mouse, inView }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        color={new THREE.Color(AMBER)}
        castShadow
      />
      <spotLight
        position={[-5, 5, 5]}
        angle={0.3}
        penumbra={0.8}
        intensity={0.6}
        color={new THREE.Color(AMBER)}
      />
      <Environment
        preset="apartment"
        environmentIntensity={0.5}
        environmentRotation={Math.PI / 2}
      />
      {inView && (
        <Float
          speed={0.8}
          rotationIntensity={0.15}
          floatIntensity={0.15}
          position={[0, 0, 0]}
        >
          <Aperture mouse={mouse} />
        </Float>
      )}
      {inView && (
        <Float
          speed={1.2}
          rotationIntensity={0.1}
          floatIntensity={0.08}
          position={[0, 0, -0.5]}
        >
          <LensElement mouse={mouse} />
        </Float>
      )}
      {inView && <BokehParticles />}
      <Sparkles
        count={60}
        speed={0.3}
        scale={[8, 8, 3]}
        size={0.08}
        opacity={0.35}
        color={AMBER}
        position={[0, 0, -2]}
      />
    </>
  );
}

function SceneLoading() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 text-neutral-400">
        <div className="w-10 h-10 border-3 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
        <span className="text-xs font-medium">
          {Math.round(progress)}%
        </span>
      </div>
    </Html>
  );
}

function ErrorFallback({ onRetry }) {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 text-neutral-400">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.3"
          />
          <path
            d="M24 16v8m0 4h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <button
          onClick={onRetry}
          className="text-xs text-amber-400 hover:text-amber-300 underline"
        >
          Retry 3D scene
        </button>
      </div>
    </Html>
  );
}

export default function HeroScene3D() {
  const mouse = useMousePosition();
  const isMobile = useIsMobile();
  const inView = useInViewport();
  const [hasError, setHasError] = useState(false);

  if (isMobile || hasError) {
    return (
      <div
        id="hero-scene"
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="relative w-80 h-80">
          <SVGFallbackScene />
        </div>
      </div>
    );
  }

  return (
    <div id="hero-scene" className="absolute inset-0">
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        onPointerMissed={() => {}}
        onError={() => setHasError(true)}
      >
        <color attach="background" args={["#000000"]} />
        <Suspense fallback={<SceneLoading />}>
          <SceneContent mouse={mouse} inView={inView} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function SVGFallbackScene() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        width="320"
        height="320"
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-pulse"
      >
        <defs>
          <radialGradient
            id="amberGlow"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#FFC700" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFC700" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g className="animate-spin-slow">
          <circle cx="160" cy="160" r="70" fill="url(#amberGlow)" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x1 = 160 + 90 * Math.cos(angle);
            const y1 = 160 + 90 * Math.sin(angle);
            const x2 = 160 + 115 * Math.cos(angle);
            const y2 = 160 + 115 * Math.sin(angle);
            return (
              <path
                key={i}
                d={`M${x1} ${y1} L${x2} ${y2}`}
                stroke="#FFC700"
                strokeWidth="2"
                strokeOpacity="0.5"
                strokeLinecap="round"
              />
            );
          })}
        </g>
        <circle cx="160" cy="160" r="40" fill="none" stroke="#FFC700" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}
