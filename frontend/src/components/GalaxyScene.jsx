import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

function GalaxyScene() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 8],
        fov: 60,
      }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#05030a"]} />

      <ambientLight intensity={0.5} />

      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />
    </Canvas>
  );
}

export default GalaxyScene;