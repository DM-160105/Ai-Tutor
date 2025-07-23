import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Float } from '@react-three/drei';
import { Mesh } from 'three';

interface InteractiveEquationProps {
  position?: [number, number, number];
}

export function InteractiveEquation({ position = [0, 0, 0] }: InteractiveEquationProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Dynamic equation parts that change over time
  const [currentEquation, setCurrentEquation] = useState(0);
  const equations = [
    'E = mc²',
    'F = ma',
    'a² + b² = c²',
    'y = mx + b',
    '∫f(x)dx'
  ];

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
      
      // Change equation every 3 seconds
      const newEquationIndex = Math.floor(state.clock.elapsedTime / 3) % equations.length;
      if (newEquationIndex !== currentEquation) {
        setCurrentEquation(newEquationIndex);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <Center position={position}>
        <mesh
          ref={meshRef}
          scale={clicked ? 1.2 : hovered ? 1.1 : 1}
          onClick={() => setClicked(!clicked)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <Text3D
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.5}
            height={0.1}
            curveSegments={12}
          >
            {equations[currentEquation]}
            <meshStandardMaterial 
              color={hovered ? '#60a5fa' : clicked ? '#34d399' : '#8b5cf6'}
              emissive={hovered ? '#1e40af' : '#000000'}
              emissiveIntensity={hovered ? 0.2 : 0}
            />
          </Text3D>
        </mesh>
      </Center>
    </Float>
  );
}