import { useState, useRef, useCallback, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Brain, Camera, Sparkles, Users, Zap } from "lucide-react";
import Logo from "@/assets/logo.svg";

// Feature data defined first
const features = [
  {
    icon: Brain,
    title: "AI-Powered Tutoring",
    description: "Get instant answers with our advanced AI tutor",
    delay: 0.1
  },
  {
    icon: Camera,
    title: "Visual Learning",
    description: "Generate visual explanations for complex topics",
    delay: 0.2
  },
  {
    icon: BookOpen,
    title: "Book Recommendations",
    description: "Discover the best books for any subject",
    delay: 0.3
  },
  {
    icon: Zap,
    title: "Instant Responses",
    description: "No waiting - get help exactly when you need it",
    delay: 0.4
  }
];

// Memoized feature card for performance
const FeatureCard = memo(({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const Icon = feature.icon;
  return (
    <motion.div 
      className="liquid-glass p-6 rounded-3xl cursor-pointer group"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: 0.6 + feature.delay, 
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      style={{ 
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden"
      }}
    >
      <motion.div 
        className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-200"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.15 }}
      >
        <Icon className="w-7 h-7 text-primary" />
      </motion.div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-200">{feature.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
    </motion.div>
  );
});

FeatureCard.displayName = "FeatureCard";

// Memoized orb component for performance
const AnimatedOrb = memo(({ 
  className, 
  animateProps, 
  transitionProps,
  style,
  dragMode
}: { 
  className: string;
  animateProps: { x?: number[]; y?: number[]; scale?: number[]; rotate?: number[] };
  transitionProps: { duration: number; repeat: number; ease: string; delay?: number };
  style?: React.CSSProperties;
  dragMode: boolean;
}) => (
  <motion.div
    className={className}
    animate={animateProps}
    transition={transitionProps}
    style={{ 
      ...style,
      willChange: "transform",
      transform: "translateZ(0)",
      backfaceVisibility: "hidden" as const
    }}
    drag={dragMode}
    dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
    dragElastic={0.1}
  />
));

AnimatedOrb.displayName = "AnimatedOrb";

const Landing = () => {
  const navigate = useNavigate();
  const [dragMode, setDragMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Optimized spring config for 90-120fps - lower stiffness, higher damping
  const springConfig = useMemo(() => ({ 
    damping: 30, 
    stiffness: 120,
    mass: 0.8,
    restDelta: 0.001
  }), []);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <div 
      className="min-h-screen bg-background overflow-hidden relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* GPU-accelerated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ perspective: "1000px" }}>
        <AnimatedOrb
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-3xl"
          animateProps={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.05, 0.98, 1],
          }}
          transitionProps={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
          dragMode={dragMode}
        />
        
        <AnimatedOrb
          className="absolute -bottom-40 -left-40 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-accent/25 to-primary/15 blur-3xl"
          animateProps={{
            x: [0, -25, 35, 0],
            y: [0, 30, -25, 0],
            scale: [1, 0.98, 1.04, 1],
          }}
          transitionProps={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
          style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" }}
          dragMode={dragMode}
        />

        <AnimatedOrb
          className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-primary/15 to-transparent blur-2xl"
          animateProps={{
            x: [0, 40, -30, 0],
            y: [0, -30, 40, 0],
          }}
          transitionProps={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            delay: 4
          }}
          dragMode={dragMode}
        />

        {/* Optimized floating particles with CSS animations */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/40 animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
              willChange: "transform, opacity"
            }}
          />
        ))}
      </div>

 

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <motion.div 
              className="w-12 h-12 liquid-glass rounded-2xl flex items-center justify-center p-2.5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <img src={Logo} alt="AI Tutor" className="w-full h-full object-contain dark:invert" />
            </motion.div>
            <span className="text-2xl font-bold gradient-text">AI Tutor</span>
          </div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.1 }}>
            <Button 
              onClick={() => navigate('/auth')}
              className="btn-glow group"
              size="lg"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-150" />
            </Button>
          </motion.div>
        </motion.div>
      </header>

      {/* Hero Section with optimized 3D Effect */}
      <main className="relative z-10 container mx-auto px-4 pt-8 md:pt-12 pb-20">
        <div 
          ref={containerRef}
          className="perspective-2000"
          style={{ perspective: "2000px" }}
        >
          <motion.div
            className="text-center max-w-4xl mx-auto mb-16 md:mb-20"
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              willChange: "transform",
              transform: "translateZ(0)"
            }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass-light text-primary text-sm font-medium mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              Powered by Advanced AI
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
            >
              Learn Smarter with{" "}
              <span className="gradient-text relative inline-block">
                AI Tutor
                <motion.span 
                  className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent rounded-full"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                />
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              Your personal AI-powered learning companion. Get instant answers, visual explanations, 
              and curated book recommendations for any subject.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.1 }}>
                <Button 
                  onClick={() => navigate('/auth')}
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold btn-glow group w-full sm:w-auto"
                >
                  Start Learning Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-150" />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.1 }}>
                <Button 
                  onClick={() => navigate('/auth')}
                  variant="glass"
                  size="lg"
                  className="h-14 px-8 text-lg group w-full sm:w-auto"
                >
                  <Users className="w-5 h-5 mr-2 group-hover:scale-105 transition-transform duration-150" />
                  Join Free
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Stats Section */}
        <motion.div 
          className="liquid-glass-strong rounded-3xl p-8 md:p-10 max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 'AI', label: 'Powered' },
              { value: '24/7', label: 'Available' },
              { value: '100+', label: 'Subjects' },
              { value: 'Free', label: 'To Start' }
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group cursor-default"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.15 }}
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of students who are already learning smarter with AI Tutor.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.1 }}>
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="h-14 px-10 text-lg font-semibold btn-glow group"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-150" />
            </Button>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 AI Tutor. Secure • Private • AI Powered</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
