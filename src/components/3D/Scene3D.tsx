import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import { InteractiveEquation } from './InteractiveEquation';
import { FloatingGeometry } from './FloatingGeometry';

interface Scene3DProps {
  children?: React.ReactNode;
  height?: string;
  interactive?: boolean;
}

export function Scene3D({ children, height = "100vh", interactive = true }: Scene3DProps) {
  return (
    <div style={{ height }} className="relative">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} color="#60a5fa" intensity={0.5} />
        
        {/* Environment and Stars */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="night" />
        
        {/* 3D Objects */}
        <Suspense fallback={null}>
          <InteractiveEquation position={[0, 1, 0]} />
          <FloatingGeometry position={[-3, 0, -2]} />
          <FloatingGeometry position={[3, -1, -1]} type="torus" />
          <FloatingGeometry position={[0, -2, -3]} type="sphere" />
          {children}
        </Suspense>
        
        {/* Controls */}
        {interactive && (
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={20}
            autoRotate
            autoRotateSpeed={0.5}
          />
        )}
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 text-white/80 text-sm bg-black/20 backdrop-blur-sm rounded-lg p-3">
        <p>🎯 Click equations to interact</p>
        <p>🖱️ Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
}