import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useState } from "react";
import gsap from "gsap";

import profilePic from "../assets/prem.png";
import { channels } from "../services/data";

const ORBIT_DISTANCES = [2.0, 2.65, 3.35];
const GALAXY_Y_OFFSET = 0.35;

function getCreatorOrbit(index) {
  const total = channels.length;
  const angleOffset = (Math.PI * 2 / total) * index;
  const orbitIndex = index % ORBIT_DISTANCES.length;
  const radius = ORBIT_DISTANCES[orbitIndex];
  const speed = 0.035 + (index % 4) * 0.008;
  const verticalOffset = ((index % 3) - 1) * 0.08;

  return {
    angleOffset,
    radius,
    speed,
    verticalOffset,
  };
}

function getOrbitPosition(angle, radius, verticalOffset = 0) {
  return new THREE.Vector3(
    Math.cos(angle) * radius,
    Math.sin(angle) * radius * 0.58 + verticalOffset,
    Math.sin(angle) * 0.65
  );
}

function GalaxyCore() {
  const profileTexture = useLoader(THREE.TextureLoader, profilePic);
  const coreRef = useRef(null);
  const glowRef = useRef(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (coreRef.current) {
      coreRef.current.rotation.z = Math.sin(time * 0.25) * 0.025;
      coreRef.current.scale.setScalar(1 + Math.sin(time * 1.5) * 0.02);
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(time * 1.2) * 0.06);
    }
  });

  return (
    <group>
      <mesh ref={glowRef} position={[0, 0, -0.15]}>
        <circleGeometry args={[0.86, 64]} />
        <meshBasicMaterial
          color="#9147ff"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0, -0.1]}>
        <circleGeometry args={[0.74, 64]} />
        <meshBasicMaterial
          color="#a970ff"
          transparent
          opacity={0.11}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={coreRef}>
        <circleGeometry args={[0.48, 64]} />
        <meshBasicMaterial
          map={profileTexture}
          transparent
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0, -0.2]}>
        <torusGeometry args={[0.62, 0.014, 16, 96]} />
        <meshBasicMaterial
          color="#9147ff"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh position={[0, 0, -0.25]}>
        <torusGeometry args={[0.74, 0.009, 16, 96]} />
        <meshBasicMaterial
          color="#a970ff"
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <pointLight
        position={[0, 0, 1]}
        color="#9147ff"
        intensity={2.5}
        distance={7}
      />
    </group>
  );
}

function GalaxyOrbitRings({ visible }) {
  const ringOne = useRef(null);
  const ringTwo = useRef(null);
  const ringThree = useRef(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (ringOne.current) ringOne.current.rotation.z = time * 0.08;
    if (ringTwo.current) ringTwo.current.rotation.z = -time * 0.055;
    if (ringThree.current) ringThree.current.rotation.z = time * 0.035;
  });

  if (!visible) return null;

  return (
    <group>
      <mesh
        ref={ringOne}
        position={[0, 0, -0.4]}
        scale={[1, 0.58, 1]}
      >
        <torusGeometry args={[2.0, 0.007, 16, 128]} />
        <meshBasicMaterial
          color="#9147ff"
          transparent
          opacity={0.17}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={ringTwo}
        position={[0, 0, -0.5]}
        rotation={[0.12, 0.25, 0]}
        scale={[1, 0.58, 1]}
      >
        <torusGeometry args={[2.65, 0.005, 16, 128]} />
        <meshBasicMaterial
          color="#a970ff"
          transparent
          opacity={0.11}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={ringThree}
        position={[0, 0, -0.6]}
        rotation={[-0.15, 0.2, 0]}
        scale={[1, 0.58, 1]}
      >
        <torusGeometry args={[3.35, 0.004, 16, 128]} />
        <meshBasicMaterial
          color="#772ce8"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function CreatorOrbit({
  channel,
  index,
  selectedCreator,
  setSelectedCreator,
}) {
  const groupRef = useRef(null);
  const texture = useLoader(THREE.TextureLoader, channel.avatar);

  const { angleOffset, radius, speed, verticalOffset } =
    getCreatorOrbit(index);

  const supportScore = channel.subs * 10 + channel.bits;

  const creatorSize = Math.min(
    0.22,
    Math.max(0.14, 0.14 + supportScore / 350000)
  );

  const isSelected = selectedCreator?.name === channel.name;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const angle = angleOffset + time * speed;
    const position = getOrbitPosition(
      angle,
      radius,
      verticalOffset
    );

    if (!groupRef.current) return;

    groupRef.current.position.set(
      position.x,
      position.y + Math.sin(time * 1.2 + index) * 0.025,
      position.z
    );

    const targetScale = isSelected ? 1.3 : 1;
    const nextScale = THREE.MathUtils.lerp(
      groupRef.current.scale.x,
      targetScale,
      0.08
    );

    groupRef.current.scale.setScalar(nextScale);
  });

  const handleClick = (event) => {
    event.stopPropagation();
    setSelectedCreator(isSelected ? null : channel);
  };

  const handlePointerOver = (event) => {
    event.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "default";
  };

  return (
    <group ref={groupRef}>
      <mesh
        position={[0, 0, -0.04]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <circleGeometry
          args={[creatorSize * (isSelected ? 1.6 : 1.3), 48]}
        />
        <meshBasicMaterial
          color="#9147ff"
          transparent
          opacity={isSelected ? 0.2 : 0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <circleGeometry args={[creatorSize, 48]} />
        <meshBasicMaterial
          map={texture}
          transparent
          toneMapped={false}
        />
      </mesh>

      <mesh
        position={[0, 0, -0.05]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <torusGeometry
          args={[
            creatorSize + (isSelected ? 0.06 : 0.035),
            isSelected ? 0.014 : 0.009,
            12,
            48,
          ]}
        />
        <meshBasicMaterial
          color={channel.verified ? "#a970ff" : "#772ce8"}
          transparent
          opacity={
            isSelected
              ? 1
              : channel.verified
                ? 0.75
                : 0.45
          }
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function Creators({ selectedCreator, setSelectedCreator }) {
  return (
    <group>
      {channels.map((channel, index) => (
        <CreatorOrbit
          key={channel.name}
          channel={channel}
          index={index}
          selectedCreator={selectedCreator}
          setSelectedCreator={setSelectedCreator}
        />
      ))}
    </group>
  );
}

function OrbitCamera({ selectedCreator }) {
  const transitionRef = useRef(false);
  const activeCreatorRef = useRef(null);
  const previousSelectedRef = useRef(null);

  useFrame((state) => {
    const camera = state.camera;
    const time = state.clock.getElapsedTime();

    if (!selectedCreator) {
      if (
        previousSelectedRef.current !== null &&
        !transitionRef.current
      ) {
        transitionRef.current = true;

        gsap.killTweensOf(camera.position);

        gsap.to(camera.position, {
          x: 0,
          y: 0,
          z: 8,
          duration: 1.2,
          ease: "power3.inOut",
          onComplete: () => {
            transitionRef.current = false;
            activeCreatorRef.current = null;
            previousSelectedRef.current = null;
            camera.lookAt(0, 0, 0);
          },
        });
      }

      return;
    }

    const selectedIndex = channels.findIndex(
      (channel) => channel.name === selectedCreator.name
    );

    if (selectedIndex === -1) return;

    const {
      angleOffset,
      radius,
      speed,
      verticalOffset,
    } = getCreatorOrbit(selectedIndex);

    const creatorAngle = angleOffset + time * speed;

    const creatorPosition = getOrbitPosition(
      creatorAngle,
      radius,
      verticalOffset
    );

    creatorPosition.y += GALAXY_Y_OFFSET;
    creatorPosition.y +=
      Math.sin(time * 1.2 + selectedIndex) * 0.025;

    const orbitDirection = new THREE.Vector3(
      -Math.sin(creatorAngle),
      Math.cos(creatorAngle) * 0.58,
      Math.cos(creatorAngle) * 0.65
    ).normalize();

    const outwardDirection = new THREE.Vector3(
      creatorPosition.x,
      creatorPosition.y - GALAXY_Y_OFFSET,
      creatorPosition.z
    ).normalize();

    const desiredCameraPosition = creatorPosition
      .clone()
      .add(outwardDirection.multiplyScalar(0.95))
      .add(orbitDirection.multiplyScalar(-0.35));

    const targetLookAt = creatorPosition.clone();

    if (
      previousSelectedRef.current !== selectedIndex
    ) {
      previousSelectedRef.current = selectedIndex;
      activeCreatorRef.current = selectedIndex;
      transitionRef.current = true;

      gsap.killTweensOf(camera.position);

      gsap.to(camera.position, {
        x: desiredCameraPosition.x,
        y: desiredCameraPosition.y,
        z: desiredCameraPosition.z,
        duration: 1.6,
        ease: "power3.inOut",
        onComplete: () => {
          transitionRef.current = false;
        },
      });

      return;
    }

    if (!transitionRef.current) {
      camera.position.lerp(desiredCameraPosition, 0.075);
    }

    const lookTarget = targetLookAt.clone();
    camera.lookAt(lookTarget);
  });

  return null;
}

function GalaxyContent({
  selectedCreator,
  setSelectedCreator,
}) {
  return (
    <group position={[0, GALAXY_Y_OFFSET, 0]}>
      <ambientLight intensity={0.35} />

      <Stars
        radius={100}
        depth={60}
        count={3500}
        factor={3}
        saturation={0}
        fade
        speed={0.35}
      />

      <GalaxyCore />

      <GalaxyOrbitRings visible={!selectedCreator} />

      <Creators
        selectedCreator={selectedCreator}
        setSelectedCreator={setSelectedCreator}
      />
    </group>
  );
}

function GalaxyScene() {
  const [selectedCreator, setSelectedCreator] = useState(null);

  return (
    <Canvas
      camera={{
        position: [0, 0, 8],
        fov: 60,
      }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#030108"]} />

      <OrbitCamera selectedCreator={selectedCreator} />

      <GalaxyContent
        selectedCreator={selectedCreator}
        setSelectedCreator={setSelectedCreator}
      />
    </Canvas>
  );
}

export default GalaxyScene;
