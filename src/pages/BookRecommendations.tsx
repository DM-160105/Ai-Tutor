import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Send, Sparkles, User, BookOpenCheck, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FloatingHeader } from "@/components/FloatingHeader";

const BookRecommendations = () => {
  const [subject, setSubject] = useState("");
  const [recommendations, setRecommendations] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
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

  const getBookRecommendations = async () => {
    if (!subject.trim()) {
      toast({
        title: "Missing Subject",
        description: "Please enter a subject."
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-tutor-response', {
        body: {
          subject: subject,
          question: `Please recommend 5-10 essential books for studying ${subject}. Include brief descriptions of why each is valuable.`
        }
      });

      if (aiError) {
        console.error('AI generation error:', aiError);
        throw new Error('Failed to generate recommendations');
      }

      if (!aiData?.response) {
        throw new Error('Invalid response');
      }

      setRecommendations(aiData.response);
      
      toast({
        title: "Done!",
        description: "Recommendations ready"
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get recommendations"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <FloatingHeader />
      
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-64 h-64 bg-primary/10 rounded-full" />
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-accent/10 rounded-full" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BookOpenCheck className="w-4 h-4" />
            Book Recommendations
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Find <span className="gradient-text">Perfect Books</span>
          </h1>
          <p className="text-muted-foreground">
            Get AI-curated book recommendations for any subject
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Input Section */}
          <Card className="glass-card border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpenCheck className="w-5 h-5 text-primary" />
                Get Recommendations
              </CardTitle>
              <CardDescription>
                Enter any subject for curated book suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Machine Learning, History..."
                  className="h-12 input-focus rounded-xl border-border/50"
                  onKeyPress={(e) => e.key === 'Enter' && getBookRecommendations()}
                />
              </div>
              
              <Button 
                onClick={getBookRecommendations}
                disabled={isLoading}
                className="w-full h-12 hover-scale btn-glow rounded-xl text-base font-semibold"
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? "Getting Books..." : "Get Recommendations"}
              </Button>
            </CardContent>
          </Card>

          {/* Recommendations Section */}
          <Card className="glass-card border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5 text-accent" />
                Recommended Books
              </CardTitle>
              <CardDescription>
                AI-curated reading list
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!recommendations ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Enter a subject to get recommendations
                  </p>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto scrollbar-modern">
                  <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1 font-medium">
                      <Sparkles className="w-3 h-3" />
                      Books for: {subject}
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>
                        {recommendations}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-center mb-6">Why Our Recommendations?</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Card className="glass-card border-0 text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Curated</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered selection
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-0 text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-medium mb-1">All Levels</h3>
                <p className="text-sm text-muted-foreground">
                  Beginner to advanced
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-0 text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Updated</h3>
                <p className="text-sm text-muted-foreground">
                  Classic & new titles
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRecommendations;
