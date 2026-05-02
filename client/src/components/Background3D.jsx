import { useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useFrame } from '@react-three/fiber';
/**
 * Animated 3D particle background using Three.js via @react-three/fiber.
 * Renders a rotating particle field that responds to the current colour mode.
 */

function Particles({ isDarkMode }) {
  const count = 1500;
  const points = useRef();

  const particlesPosition = useMemo(() => {    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Create random points in a spherical volume — Math.random is intentional
      // inside useMemo so positions are computed once and remain stable.
      /* eslint-disable react-hooks/purity */
      const r = 3 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      /* eslint-enable react-hooks/purity */
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.05;
      points.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color={isDarkMode ? "#FF9933" : "#E65100"}
        transparent
        opacity={isDarkMode ? 0.6 : 0.8}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}

Particles.propTypes = {
  /** When true, renders dark-mode particle colours */
  isDarkMode: PropTypes.bool,
};

export default function Background3D({ isDarkMode }) {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none transition-colors duration-500">
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <fog attach="fog" args={[isDarkMode ? '#0A0A0A' : '#FFFAF5', 1, 4]} />
        <Particles isDarkMode={isDarkMode} />
      </Canvas>
    </div>
  );
}

Background3D.propTypes = {
  /** When true, renders dark-mode particle colours; otherwise uses light-mode palette */
  isDarkMode: PropTypes.bool,
};
