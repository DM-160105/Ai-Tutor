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
  LogOut,
  TrendingUp,
  Calendar,
  Brain,
  Target,
  Award,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, loading, signOut } = useAuth();
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
          <p className="text-lg text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Load user statistics
  useEffect(() => {
    const loadUserStats = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Get user's queries
        const { data: queries, error } = await supabase
          .from('queries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (queries) {
          // Calculate stats
          const totalQuestions = queries.length;
          const subjects = new Set(queries.map(q => q.subject?.toLowerCase()));
          const subjectsExplored = subjects.size;
          
          // Find most common subject
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

          // Set recent activity (last 5 queries)
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
          description: "Failed to load dashboard data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserStats();
  }, [user, toast]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

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
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-lg text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                {getGreeting()}, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'}!
              </h1>
              <p className="text-muted-foreground">Welcome to your learning dashboard</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              <Brain className="w-4 h-4 mr-2" />
              AI Tutor
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userStats.totalQuestions}</p>
                  <p className="text-sm text-muted-foreground">Questions Asked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userStats.subjectsExplored}</p>
                  <p className="text-sm text-muted-foreground">Subjects Explored</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold truncate">{userStats.favoriteSubject}</p>
                  <p className="text-sm text-muted-foreground">Favorite Subject</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {userStats.lastActivity ? formatDate(userStats.lastActivity) : 'Never'}
                  </p>
                  <p className="text-sm text-muted-foreground">Last Activity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Jump into your learning activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => navigate('/')}
              >
                <Brain className="w-4 h-4 mr-3" />
                Ask AI Tutor
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => navigate('/visual-learning')}
              >
                <Camera className="w-4 h-4 mr-3" />
                Visual Learning
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => navigate('/book-recommendations')}
              >
                <BookOpenCheck className="w-4 h-4 mr-3" />
                Book Recommendations
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => navigate('/student-tools')}
              >
                <TrendingUp className="w-4 h-4 mr-3" />
                Student Tools
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-secondary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest questions and topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-6">
                  <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No recent activity</p>
                  <p className="text-sm text-muted-foreground">Start asking questions to see your activity here!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
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

        {/* Achievement Section */}
        <Card className="mt-8 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Learning Achievements
            </CardTitle>
            <CardDescription>
              Track your learning milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">
                  {userStats.totalQuestions >= 50 ? '🏆' : userStats.totalQuestions >= 20 ? '🥈' : userStats.totalQuestions >= 10 ? '🥉' : '🌱'}
                </div>
                <h3 className="font-semibold">Question Master</h3>
                <p className="text-sm text-muted-foreground">
                  {userStats.totalQuestions}/50 questions asked
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">
                  {userStats.subjectsExplored >= 10 ? '🌟' : userStats.subjectsExplored >= 5 ? '⭐' : '🌱'}
                </div>
                <h3 className="font-semibold">Subject Explorer</h3>
                <p className="text-sm text-muted-foreground">
                  {userStats.subjectsExplored}/10 subjects explored
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">🔥</div>
                <h3 className="font-semibold">Learning Streak</h3>
                <p className="text-sm text-muted-foreground">Keep up the momentum!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;