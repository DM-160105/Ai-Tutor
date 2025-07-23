import { Scene3D } from './Scene3D';
import { InteractiveEquation } from './InteractiveEquation';
import { useNavigate } from 'react-router-dom';

export function LandingScene3D() {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <Scene3D height="60vh" interactive={true}>
        {/* Additional equations scattered around */}
        <InteractiveEquation position={[-2, 2, -1]} />
        <InteractiveEquation position={[2, -1, 1]} />
      </Scene3D>
      
      {/* Hero Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white z-10 pointer-events-auto">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Learn Smart
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Experience interactive learning in a stunning 3D environment. 
            Watch equations come to life and explore knowledge like never before.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate('/visual-learning')}
              className="bg-primary/20 backdrop-blur-sm border border-primary/30 text-white px-8 py-3 rounded-lg hover:bg-primary/30 transition-all duration-300"
            >
              Start Learning
            </button>
            <button 
              onClick={() => navigate('/student-tools')}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              Explore Tools
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}