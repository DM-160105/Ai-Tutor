import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  BookOpen, 
  MessageSquare, 
  Camera, 
  BookOpenCheck, 
  TrendingUp,
  Calendar,
  Brain,
  Target,
  Award,
  Clock,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FloatingHeader } from "@/components/FloatingHeader";

const Dashboard = () => {
  const [userStats, setUserStats] = useState({
    totalQuestions: 0,
    subjectsExplored: 0,
    lastActivity: null as Date | null,
    favoriteSubject: "",
  });
  const [recentActivity, setRecentActivity] = useState<Array<{
    id: string;
    subject: string;
    question: string;
    created_at: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
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

  useEffect(() => {
    const loadUserStats = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        const { data: queries, error } = await supabase
          .from('queries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (queries) {
          const totalQuestions = queries.length;
          const subjects = new Set(queries.map(q => q.subject?.toLowerCase()));
          const subjectsExplored = subjects.size;
          
          const subjectCounts: Record<string, number> = {};
          queries.forEach(q => {
            if (q.subject) {
              subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1;
            }
          });
          const favoriteSubject = Object.keys(subjectCounts).reduce((a, b) => 
            subjectCounts[a] > subjectCounts[b] ? a : b, "None"
          );

          const lastActivity = queries.length > 0 ? new Date(queries[0].created_at) : null;

          setUserStats({
            totalQuestions,
            subjectsExplored,
            lastActivity,
            favoriteSubject: favoriteSubject || "None"
          });

          setRecentActivity(queries.slice(0, 5).map(q => ({
            id: q.id,
            subject: q.subject || "Unknown",
            question: q.question || "",
            created_at: q.created_at
          })));
        }
      } catch (error) {
        console.error('Error loading user stats:', error);
        toast({
          title: "Error",
          description: "Failed to load data"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserStats();
  }, [user, toast]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getUserInitials = () => {
    const email = user?.email || "";
    return email.charAt(0).toUpperCase();
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
        <div className="flex items-center gap-3 glass-card px-6 py-4 rounded-2xl">
          <div className="animate-spin w-6 h-6 border-3 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <FloatingHeader />
      
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-20 w-64 h-64 bg-primary/10 rounded-full" />
        <div className="absolute bottom-32 left-20 w-48 h-48 bg-accent/10 rounded-full" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-14 h-14 border-2 border-primary/20">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {getGreeting()}, <span className="gradient-text">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'}</span>!
              </h1>
              <p className="text-muted-foreground">Welcome to your dashboard</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border-0">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userStats.totalQuestions}</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent/10 rounded-xl">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userStats.subjectsExplored}</p>
                  <p className="text-xs text-muted-foreground">Subjects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold truncate max-w-[80px]">{userStats.favoriteSubject}</p>
                  <p className="text-xs text-muted-foreground">Favorite</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent/10 rounded-xl">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {userStats.lastActivity ? formatDate(userStats.lastActivity) : 'Never'}
                  </p>
                  <p className="text-xs text-muted-foreground">Last Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card className="glass-card border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Jump into learning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start h-12 hover-scale rounded-xl bg-muted/30 hover:bg-muted/50" 
                onClick={() => navigate('/')}
              >
                <Brain className="w-5 h-5 mr-3 text-primary" />
                Ask AI Tutor
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start h-12 hover-scale rounded-xl bg-muted/30 hover:bg-muted/50" 
                onClick={() => navigate('/visual-learning')}
              >
                <Camera className="w-5 h-5 mr-3 text-accent" />
                Visual Learning
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start h-12 hover-scale rounded-xl bg-muted/30 hover:bg-muted/50" 
                onClick={() => navigate('/book-recommendations')}
              >
                <BookOpenCheck className="w-5 h-5 mr-3 text-primary" />
                Book Recommendations
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start h-12 hover-scale rounded-xl bg-muted/30 hover:bg-muted/50" 
                onClick={() => navigate('/student-tools')}
              >
                <TrendingUp className="w-5 h-5 mr-3 text-accent" />
                Student Tools
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-card border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-accent" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">No activity yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-modern">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="p-3 bg-muted/30 rounded-xl border border-border/20">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="secondary" className="text-xs rounded-lg">
                          {activity.subject}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm truncate">{activity.question}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="mt-6 glass-card border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-primary" />
              Achievements
            </CardTitle>
            <CardDescription>
              Your learning milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-xl border border-border/20">
                <div className="text-2xl mb-2">
                  {userStats.totalQuestions >= 50 ? '🏆' : userStats.totalQuestions >= 20 ? '🥈' : userStats.totalQuestions >= 10 ? '🥉' : '🌱'}
                </div>
                <h3 className="font-medium text-sm">Questions</h3>
                <p className="text-xs text-muted-foreground">{userStats.totalQuestions}/50</p>
              </div>
              
              <div className="text-center p-4 bg-muted/30 rounded-xl border border-border/20">
                <div className="text-2xl mb-2">
                  {userStats.subjectsExplored >= 10 ? '🌟' : userStats.subjectsExplored >= 5 ? '⭐' : '🌱'}
                </div>
                <h3 className="font-medium text-sm">Explorer</h3>
                <p className="text-xs text-muted-foreground">{userStats.subjectsExplored}/10</p>
              </div>
              
              <div className="text-center p-4 bg-muted/30 rounded-xl border border-border/20">
                <div className="text-2xl mb-2">🔥</div>
                <h3 className="font-medium text-sm">Streak</h3>
                <p className="text-xs text-muted-foreground">Keep learning!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;