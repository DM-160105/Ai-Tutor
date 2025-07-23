import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface FloatingGeometryProps {
  position?: [number, number, number];
  type?: 'box' | 'sphere' | 'torus' | 'octahedron';
}

export function FloatingGeometry({ 
  position = [0, 0, 0], 
  type = 'box' 
}: FloatingGeometryProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Different rotation patterns for each type
      switch (type) {
        case 'box':
          meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
          meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
          break;
        case 'sphere':
          meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
          break;
        case 'torus':
          meshRef.current.rotation.x = state.clock.elapsedTime * 0.6;
          meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
          break;
        case 'octahedron':
          meshRef.current.rotation.y = state.clock.elapsedTime * 0.7;
          meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
          break;
      }
      
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
    }
  });

  const getGeometry = () => {
    switch (type) {
      case 'sphere':
        return <sphereGeometry args={[0.8, 32, 32]} />;
      case 'torus':
        return <torusGeometry args={[0.8, 0.3, 16, 100]} />;
      case 'octahedron':
        return <octahedronGeometry args={[1]} />;
      default:
        return <boxGeometry args={[1.2, 1.2, 1.2]} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'sphere':
        return '#34d399';
      case 'torus':
        return '#f59e0b';
      case 'octahedron':
        return '#ef4444';
      default:
        return '#8b5cf6';
    }
  };

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      {getGeometry()}
      <meshStandardMaterial 
        color={getColor()}
        metalness={0.3}
        roughness={0.4}
        emissive={getColor()}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}