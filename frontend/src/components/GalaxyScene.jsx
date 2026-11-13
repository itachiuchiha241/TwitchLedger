
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Billboard, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";

import profilePic from "../assets/prem2.png";

// Expanded orbital distances
const ORBIT_DISTANCES = [3.0, 4.5, 6.0];

// Each ring rotates at a consistent speed so creators stay evenly spaced.
const ORBIT_SPEEDS = [0.025, -0.018, 0.012];

const GALAXY_Y_OFFSET = 0.35;
const ORBIT_TILT = Math.atan2(0.65, 0.58);

const HOME_CAMERA_POSITION = new THREE.Vector3(0, 0, 13);
const HOME_CAMERA_TARGET = new THREE.Vector3(0, GALAXY_Y_OFFSET, 0);

// Distribute creators evenly across three rings.
function getCreatorOrbit(index, total) {
  const ringCount = ORBIT_DISTANCES.length;
  const ringIndex = index % ringCount;

  const positionInRing = Math.floor(index / ringCount);

  const creatorsInRing = Math.ceil(
    Math.max(total - ringIndex, 0) / ringCount
  );

  const safeCreatorsInRing = Math.max(creatorsInRing, 1);

  const angleOffset =
    (Math.PI * 2 / safeCreatorsInRing) * positionInRing;

  const radius = ORBIT_DISTANCES[ringIndex];
  const speed = ORBIT_SPEEDS[ringIndex];

  const verticalOffset = ((index % 3) - 1) * 0.08;

  return {
    angleOffset,
    radius,
    speed,
    verticalOffset,
    ringIndex,
  };
}

function getOrbitPosition(angle, radius, verticalOffset = 0) {
  return new THREE.Vector3(
    Math.cos(angle) * radius,
    Math.sin(angle) * radius * Math.cos(ORBIT_TILT) +
    verticalOffset,
    Math.sin(angle) * radius * Math.sin(ORBIT_TILT)
  );
}

function GalaxyCore() {
  const profileTexture = useLoader(THREE.TextureLoader, profilePic);

  const coreTexture = useMemo(() => {
    const texture = profileTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [profileTexture]);

  const coreRef = useRef(null);
  const glowRef = useRef(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (coreRef.current) {
      coreRef.current.rotation.z = Math.sin(time * 0.25) * 0.025;
      coreRef.current.scale.setScalar(
        1 + Math.sin(time * 1.5) * 0.02
      );
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(
        1 + Math.sin(time * 1.2) * 0.06
      );
    }
  });

  return (
    <group>
      <Billboard follow>
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
            map={coreTexture}
            transparent
            toneMapped={false}
          />
        </mesh>

        <mesh position={[0, 0, 0.03]}>
          <torusGeometry args={[0.62, 0.014, 16, 96]} />
          <meshBasicMaterial
            color="#9147ff"
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh position={[0, 0, 0.02]}>
          <torusGeometry args={[0.74, 0.009, 16, 96]} />
          <meshBasicMaterial
            color="#a970ff"
            transparent
            opacity={0.32}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Billboard>

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
  const ringRefs = useRef([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    ringRefs.current.forEach((ring, index) => {
      if (!ring) return;

      ring.rotation.z = time * ORBIT_SPEEDS[index];
    });
  });

  if (!visible) return null;

  return (
    <group>
      {ORBIT_DISTANCES.map((radius, index) => (
        <group key={radius} rotation={[ORBIT_TILT, 0, 0]}>
          <mesh
            ref={(element) => {
              ringRefs.current[index] = element;
            }}
            position={[0, 0, -0.04 * (index + 1)]}
          >
            <torusGeometry
              args={[radius, 0.007 - index * 0.001, 12, 128]}
            />

            <meshBasicMaterial
              color={["#9147ff", "#a970ff", "#772ce8"][index]}
              transparent
              opacity={[0.17, 0.11, 0.07][index]}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function CreatorOrbit({
  channel,
  index,
  total,
  selectedCreator,
  setSelectedCreator,
}) {
  const groupRef = useRef(null);

  // Use a fallback avatar if the creator has no image.
  // Load creator avatar separately from your own profile picture.
  const texture = useLoader(
    THREE.TextureLoader,
    channel.avatar || profilePic
  );

  const avatarTexture = useMemo(() => {
    // Creator has no avatar: show a neutral purple placeholder.
    if (!channel.avatar) {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;

      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#24103d";
      ctx.fillRect(0, 0, 128, 128);

      ctx.fillStyle = "#9147ff";
      ctx.beginPath();
      ctx.arc(64, 64, 42, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        (channel.name || "?").charAt(0).toUpperCase(),
        64,
        64
      );

      const placeholder = new THREE.CanvasTexture(canvas);
      placeholder.colorSpace = THREE.SRGBColorSpace;
      placeholder.needsUpdate = true;

      return placeholder;
    }

    const nextTexture = texture.clone();
    nextTexture.colorSpace = THREE.SRGBColorSpace;
    nextTexture.needsUpdate = true;

    return nextTexture;
  }, [texture, channel.avatar, channel.name]);

  const { angleOffset, radius, speed, verticalOffset } =
    getCreatorOrbit(index, total);

  const supportScore = (channel.subs || 0) * 10 + (channel.bits || 0);

  const creatorSize = Math.min(
    0.22,
    Math.max(0.14, 0.14 + supportScore / 350000)
  );

  const isSelected = selectedCreator?.id
    ? selectedCreator.id === channel.id
    : selectedCreator?.name === channel.name;

  useEffect(() => {
    return () => {
      document.body.style.cursor = "default";
    };
  }, []);

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
    document.body.style.cursor = "grab";
  };

  return (
    <group ref={groupRef}>
      <Billboard follow>
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
            map={avatarTexture}
            transparent
            toneMapped={false}
          />
        </mesh>

        <mesh
          position={[0, 0, 0.02]}
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
      </Billboard>
    </group>
  );
}

function Creators({
  channels,
  selectedCreator,
  setSelectedCreator,
}) {
  return (
    <group>
      {channels.map((channel, index) => (
        <CreatorOrbit
          key={channel.id || channel.name}
          channel={channel}
          index={index}
          total={channels.length}
          selectedCreator={selectedCreator}
          setSelectedCreator={setSelectedCreator}
        />
      ))}
    </group>
  );
}

function OrbitCamera({
  channels,
  selectedCreator,
  controlsRef,
}) {
  const lookTargetRef = useRef(new THREE.Vector3());
  const wasSelectedRef = useRef(false);

  useFrame((state, delta) => {
    const camera = state.camera;
    const time = state.clock.getElapsedTime();

    const positionDamping = 1 - Math.exp(-delta * 3.2);
    const targetDamping = 1 - Math.exp(-delta * 5);

    if (!selectedCreator) {
      if (!wasSelectedRef.current) return;

      camera.position.lerp(
        HOME_CAMERA_POSITION,
        positionDamping
      );

      lookTargetRef.current.lerp(
        HOME_CAMERA_TARGET,
        targetDamping
      );

      if (controlsRef.current) {
        controlsRef.current.target.lerp(
          HOME_CAMERA_TARGET,
          targetDamping
        );

        controlsRef.current.update();
      } else {
        camera.lookAt(lookTargetRef.current);
      }

      if (
        camera.position.distanceTo(HOME_CAMERA_POSITION) < 0.02
      ) {
        camera.position.copy(HOME_CAMERA_POSITION);
        lookTargetRef.current.copy(HOME_CAMERA_TARGET);

        controlsRef.current?.target.copy(HOME_CAMERA_TARGET);
        controlsRef.current?.update();

        wasSelectedRef.current = false;
      }

      return;
    }

    wasSelectedRef.current = true;

    const selectedIndex = channels.findIndex((channel) =>
      selectedCreator.id
        ? channel.id === selectedCreator.id
        : channel.name === selectedCreator.name
    );

    if (selectedIndex === -1) return;

    const { angleOffset, radius, speed, verticalOffset } =
      getCreatorOrbit(selectedIndex, channels.length);

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
      .add(outwardDirection.multiplyScalar(3.5))
      .add(orbitDirection.multiplyScalar(-1.1));

    const targetLookAt = creatorPosition.clone();

    camera.position.lerp(
      desiredCameraPosition,
      positionDamping
    );

    lookTargetRef.current.lerp(
      targetLookAt,
      targetDamping
    );

    camera.lookAt(lookTargetRef.current);
  });

  return null;
}

function GalaxyContent({
  channels,
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
        channels={channels}
        selectedCreator={selectedCreator}
        setSelectedCreator={setSelectedCreator}
      />
    </group>
  );
}

function GalaxyScene({
  channels = [],
  selectedCreator,
  setSelectedCreator,
}) {
  const controlsRef = useRef(null);

  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 60 }}
      dpr={[1, 2]}
      onPointerMissed={() => setSelectedCreator(null)}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
    >
      <color attach="background" args={["#030108"]} />

      <OrbitCamera
        channels={channels}
        selectedCreator={selectedCreator}
        controlsRef={controlsRef}
      />

      <OrbitControls
        ref={controlsRef}
        enabled={!selectedCreator}
        target={[0, GALAXY_Y_OFFSET, 0]}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        zoomSpeed={0.75}
        minDistance={6}
        maxDistance={24}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />

      <GalaxyContent
        channels={channels}
        selectedCreator={selectedCreator}
        setSelectedCreator={setSelectedCreator}
      />
    </Canvas>
  );
}

export default GalaxyScene;
