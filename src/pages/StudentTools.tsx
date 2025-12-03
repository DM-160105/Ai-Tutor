import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  Clock, 
  Target, 
  TrendingUp, 
  BookOpen,
  Brain,
  Award,
  Users,
  FileText,
  Lightbulb,
  Camera,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { FloatingHeader } from "@/components/FloatingHeader";

const StudentTools = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
        <div className="flex items-center gap-3 glass-card px-6 py-4 rounded-2xl">
          <div className="animate-spin w-6 h-6 border-3 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const tools = [
    { icon: Calculator, title: "Math Solver", description: "Step-by-step solutions", comingSoon: true },
    { icon: Clock, title: "Practice Tests", description: "Custom quizzes", comingSoon: true },
    { icon: Target, title: "Learning Goals", description: "Track objectives", comingSoon: true },
    { icon: TrendingUp, title: "Progress", description: "Monitor learning", comingSoon: true },
    { icon: FileText, title: "Notes", description: "AI-assisted notes", comingSoon: true },
    { icon: Lightbulb, title: "Study Planner", description: "Smart schedules", comingSoon: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <FloatingHeader />
      
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-10 w-56 h-56 bg-accent/10 rounded-full" />
        <div className="absolute bottom-32 right-10 w-64 h-64 bg-primary/10 rounded-full" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Student Tools
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Learning <span className="gradient-text">Resources</span>
          </h1>
          <p className="text-muted-foreground">
            Tools to enhance your learning experience
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Available Now */}
          <Card className="glass-card border-0 mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="w-5 h-5 text-primary" />
                Available Now
              </CardTitle>
              <CardDescription>
                Ready to use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Link to="/" className="group">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border/20 hover:border-primary/30 smooth-transition hover-scale text-center">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">AI Tutor</h3>
                    <p className="text-xs text-muted-foreground">Ask anything</p>
                  </div>
                </Link>

                <Link to="/visual-learning" className="group">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border/20 hover:border-accent/30 smooth-transition hover-scale text-center">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                      <Camera className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">Visual Learning</h3>
                    <p className="text-xs text-muted-foreground">Generate images</p>
                  </div>
                </Link>

                <Link to="/book-recommendations" className="group">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border/20 hover:border-primary/30 smooth-transition hover-scale text-center">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">Books</h3>
                    <p className="text-xs text-muted-foreground">AI recommendations</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon */}
          <Card className="glass-card border-0 mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-accent" />
                Coming Soon
              </CardTitle>
              <CardDescription>
                In development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {tools.map((tool, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-muted/20 rounded-xl border border-border/10 text-center opacity-70"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-2">
                      <tool.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-sm mb-0.5">{tool.title}</h3>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Roadmap */}
          <Card className="glass-card border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-primary" />
                Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-sm">Phase 1: Core Tools</h4>
                    <p className="text-xs text-muted-foreground">AI Tutor, Visual Learning, Books ✓</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/20">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-sm">Phase 2: Assessment</h4>
                    <p className="text-xs text-muted-foreground">Practice Tests, Progress Tracker</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/20">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-sm">Phase 3: Social</h4>
                    <p className="text-xs text-muted-foreground">Notes, Study Groups, Planner</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentTools;