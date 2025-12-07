import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Brain, Camera, Sparkles, Users, Zap } from "lucide-react";
import Logo from "@/assets/logo.svg";

const Landing = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/15 rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/15 rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center p-2">
              <img src={Logo} alt="AI Tutor" className="w-full h-full object-contain dark:invert" />
            </div>
            <span className="text-2xl font-bold gradient-text">AI Tutor</span>
          </div>
          <Button 
            onClick={() => navigate('/auth')}
            className="hover-scale btn-glow"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 pt-16 pb-24">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Powered by Advanced AI
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Learn Smarter with{" "}
            <span className="gradient-text">AI Tutor</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Your personal AI-powered learning companion. Get instant answers, visual explanations, 
            and curated book recommendations for any subject.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="h-14 px-8 text-lg font-semibold hover-scale btn-glow"
            >
              Start Learning Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg glass border-border/50 hover-scale"
            >
              <Users className="w-5 h-5 mr-2" />
              Join Free
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="glass-card p-6 rounded-2xl hover-lift cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 smooth-transition">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 glass-card rounded-3xl p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">AI</div>
              <div className="text-sm text-muted-foreground mt-1">Powered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">24/7</div>
              <div className="text-sm text-muted-foreground mt-1">Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">100+</div>
              <div className="text-sm text-muted-foreground mt-1">Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">Free</div>
              <div className="text-sm text-muted-foreground mt-1">To Start</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of students who are already learning smarter with AI Tutor.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            size="lg"
            className="h-14 px-10 text-lg font-semibold hover-scale btn-glow"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5 ml-2" />
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
