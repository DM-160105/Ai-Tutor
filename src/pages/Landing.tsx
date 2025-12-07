import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowRight, BookOpen, Brain, Camera, Sparkles, Users, Zap, Move, MousePointer } from "lucide-react";
import Logo from "@/assets/logo.svg";

interface DraggableItem {
  id: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const Landing = () => {
  const navigate = useNavigate();
  const [dragMode, setDragMode] = useState(false);
  const [draggables, setDraggables] = useState<DraggableItem[]>([
    { id: 'orb1', x: -160, y: -160, scale: 1, rotation: 0 },
    { id: 'orb2', x: -160, y: -160, scale: 1, rotation: 0 },
    { id: 'orb3', x: 0, y: 0, scale: 1, rotation: 0 },
  ]);
  const [dragging, setDragging] = useState<string | null>(null);
  const dragStart = useRef<{ x: number; y: number; itemX: number; itemY: number }>({ x: 0, y: 0, itemX: 0, itemY: 0 });

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Tutoring",
      description: "Get instant answers to your questions with our advanced AI tutor"
    },
    {
      icon: Camera,
      title: "Visual Learning",
      description: "Generate visual explanations for complex topics"
    },
    {
      icon: BookOpen,
      title: "Book Recommendations",
      description: "Discover the best books for any subject you want to learn"
    },
    {
      icon: Zap,
      title: "Instant Responses",
      description: "No waiting - get help exactly when you need it"
    }
  ];

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    if (!dragMode) return;
    e.preventDefault();
    const item = draggables.find(d => d.id === id);
    if (item) {
      setDragging(id);
      dragStart.current = { x: e.clientX, y: e.clientY, itemX: item.x, itemY: item.y };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    setDraggables(prev => prev.map(item => 
      item.id === dragging 
        ? { ...item, x: dragStart.current.itemX + deltaX, y: dragStart.current.itemY + deltaY }
        : item
    ));
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    if (dragMode) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragMode, dragging]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
      {/* Drag Mode Toggle */}
      <div className="fixed top-4 right-4 z-50 glass-card px-4 py-2 rounded-full flex items-center gap-3 animate-fade-in">
        <Label htmlFor="drag-mode" className="text-sm flex items-center gap-2 cursor-pointer">
          {dragMode ? <Move className="w-4 h-4" /> : <MousePointer className="w-4 h-4" />}
          <span className="hidden sm:inline">{dragMode ? 'Drag Mode' : 'View Mode'}</span>
        </Label>
        <Switch 
          id="drag-mode"
          checked={dragMode}
          onCheckedChange={setDragMode}
        />
      </div>

      {/* Background decorations - draggable */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className={`absolute -top-40 -right-40 w-96 h-96 bg-primary/15 rounded-full transition-all duration-500 animate-float ${
            dragMode ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : ''
          } ${dragging === 'orb1' ? 'scale-110' : ''}`}
          style={{ transform: `translate(${draggables[0].x}px, ${draggables[0].y}px)` }}
          onMouseDown={(e) => handleMouseDown('orb1', e)}
        />
        <div 
          className={`absolute -bottom-40 -left-40 w-96 h-96 bg-accent/15 rounded-full transition-all duration-500 ${
            dragMode ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'animate-float'
          } ${dragging === 'orb2' ? 'scale-110' : ''}`}
          style={{ 
            transform: `translate(${draggables[1].x}px, ${draggables[1].y}px)`,
            animationDelay: dragMode ? '0s' : '2s'
          }}
          onMouseDown={(e) => handleMouseDown('orb2', e)}
        />
        <div 
          className={`absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full transition-all duration-500 ${
            dragMode ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'animate-float'
          } ${dragging === 'orb3' ? 'scale-110' : ''}`}
          style={{ 
            transform: `translate(${draggables[2].x}px, ${draggables[2].y}px)`,
            animationDelay: dragMode ? '0s' : '4s'
          }}
          onMouseDown={(e) => handleMouseDown('orb3', e)}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 group">
            <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-300">
              <img src={Logo} alt="AI Tutor" className="w-full h-full object-contain dark:invert" />
            </div>
            <span className="text-2xl font-bold gradient-text">AI Tutor</span>
          </div>
          <Button 
            onClick={() => navigate('/auth')}
            className="hover-scale btn-glow group"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 pt-12 md:pt-16 pb-24">
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-20">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in hover-scale cursor-default"
            style={{ animationDelay: '0.2s' }}
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            Powered by Advanced AI
          </div>
          
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            Learn Smarter with{" "}
            <span className="gradient-text relative">
              AI Tutor
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-full scale-x-0 animate-[scale-in_0.5s_ease-out_0.8s_forwards]" />
            </span>
          </h1>
          
          <p 
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            Your personal AI-powered learning companion. Get instant answers, visual explanations, 
            and curated book recommendations for any subject.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="h-14 px-8 text-lg font-semibold hover-scale btn-glow group w-full sm:w-auto"
            >
              Start Learning Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg glass border-border/50 hover-scale group w-full sm:w-auto"
            >
              <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Join Free
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="glass-card p-6 rounded-2xl hover-lift cursor-pointer group"
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 smooth-transition">
                  <Icon className="w-7 h-7 text-primary group-hover:rotate-12 transition-transform" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div 
          className="mt-16 md:mt-20 glass-card rounded-3xl p-8 max-w-4xl mx-auto animate-fade-in"
          style={{ animationDelay: '1s' }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 'AI', label: 'Powered' },
              { value: '24/7', label: 'Available' },
              { value: '100+', label: 'Subjects' },
              { value: 'Free', label: 'To Start' }
            ].map((stat, index) => (
              <div key={index} className="text-center group cursor-default">
                <div className="text-3xl md:text-4xl font-bold gradient-text group-hover:scale-110 transition-transform">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div 
          className="mt-16 md:mt-20 text-center animate-fade-in"
          style={{ animationDelay: '1.1s' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of students who are already learning smarter with AI Tutor.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            size="lg"
            className="h-14 px-10 text-lg font-semibold hover-scale btn-glow group"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 AI Tutor. Secure • Private • AI Powered</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
