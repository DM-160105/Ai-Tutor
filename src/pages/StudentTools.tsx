import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  Clock, 
  Target, 
  TrendingUp, 
  ArrowLeft,
  BookOpen,
  Brain,
  Award,
  Users,
  FileText,
  Lightbulb
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const StudentTools = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-lg text-muted-foreground">Loading Student Tools...</p>
        </div>
      </div>
    );
  }

  const tools = [
    {
      icon: Calculator,
      title: "Math Solver",
      description: "Step-by-step solutions for math problems and equations",
      color: "secondary",
      comingSoon: true
    },
    {
      icon: Clock,
      title: "Practice Tests",
      description: "Generate custom quizzes and practice exams for any subject",
      color: "primary",
      comingSoon: true
    },
    {
      icon: Target,
      title: "Learning Goals",
      description: "Set and track your learning objectives and milestones",
      color: "secondary",
      comingSoon: true
    },
    {
      icon: TrendingUp,
      title: "Progress Tracker",
      description: "Monitor your learning progress and identify areas for improvement",
      color: "accent",
      comingSoon: true
    },
    {
      icon: FileText,
      title: "Note Organizer",
      description: "Organize and manage your study notes with AI assistance",
      color: "primary",
      comingSoon: true
    },
    {
      icon: Lightbulb,
      title: "Study Planner",
      description: "Create personalized study schedules and reminders",
      color: "secondary",
      comingSoon: true
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Connect with other students and form study groups",
      color: "accent",
      comingSoon: true
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Earn badges and track your learning milestones",
      color: "primary",
      comingSoon: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tutor
          </Button>
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Student Tools & Resources
            </h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-lg text-muted-foreground mb-4">
              Comprehensive tools to enhance your learning experience
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/">
                <Button variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  AI Tutor Chat
                </Button>
              </Link>
              <Link to="/visual-learning">
                <Button variant="outline">
                  <Brain className="w-4 h-4 mr-2" />
                  Visual Learning
                </Button>
              </Link>
              <Link to="/book-recommendations">
                <Button variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Book Recommendations
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tools.map((tool, index) => (
              <Card 
                key={index} 
                className={`text-center border-${tool.color}/20 hover:border-${tool.color}/40 transition-colors cursor-pointer h-full relative`}
              >
                <CardContent className="pt-6">
                  <tool.icon className={`w-12 h-12 text-${tool.color} mx-auto mb-4`} />
                  <h3 className="font-semibold mb-2">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {tool.description}
                  </p>
                  {tool.comingSoon && (
                    <div className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full">
                      Coming Soon
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Currently Available Tools */}
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Currently Available Tools
              </CardTitle>
              <CardDescription>
                These tools are ready to use right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <Link to="/" className="group">
                  <Card className="text-center border-primary/20 hover:border-primary/40 transition-colors cursor-pointer h-full group-hover:shadow-md">
                    <CardContent className="pt-6">
                      <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">AI Tutor Chat</h3>
                      <p className="text-sm text-muted-foreground">
                        Ask questions and get instant AI-powered answers
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/visual-learning" className="group">
                  <Card className="text-center border-secondary/20 hover:border-secondary/40 transition-colors cursor-pointer h-full group-hover:shadow-md">
                    <CardContent className="pt-6">
                      <Brain className="w-12 h-12 text-secondary mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Visual Learning</h3>
                      <p className="text-sm text-muted-foreground">
                        Generate images and visual explanations for topics
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/book-recommendations" className="group">
                  <Card className="text-center border-accent/20 hover:border-accent/40 transition-colors cursor-pointer h-full group-hover:shadow-md">
                    <CardContent className="pt-6">
                      <BookOpen className="w-12 h-12 text-accent mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Book Recommendations</h3>
                      <p className="text-sm text-muted-foreground">
                        Get AI-curated book suggestions for any subject
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Development Roadmap */}
          <Card className="mt-8 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Development Roadmap
              </CardTitle>
              <CardDescription>
                Upcoming features and tools we're working on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold">Phase 1: Core Learning Tools</h4>
                    <p className="text-sm text-muted-foreground">AI Tutor, Visual Learning, Book Recommendations (Completed)</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold">Phase 2: Assessment & Progress</h4>
                    <p className="text-sm text-muted-foreground">Practice Tests, Progress Tracker, Learning Goals (In Development)</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold">Phase 3: Organization & Social</h4>
                    <p className="text-sm text-muted-foreground">Note Organizer, Study Planner, Study Groups (Planned)</p>
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