import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Send, ArrowLeft, Sparkles, User, BookOpenCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const BookRecommendations = () => {
  const [subject, setSubject] = useState("");
  const [recommendations, setRecommendations] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
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
          <p className="text-lg text-muted-foreground">Loading Book Recommendations...</p>
        </div>
      </div>
    );
  }

  const getBookRecommendations = async () => {
    if (!subject.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a subject to get book recommendations.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate book recommendations using Gemini
      const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-tutor-response', {
        body: {
          subject: subject,
          question: `Please recommend 5-10 essential books or reference materials for studying ${subject}. Include a brief description of why each book is valuable for learners. Format your response with clear book titles, authors, and explanations.`
        }
      });

      if (aiError) {
        console.error('AI generation error:', aiError);
        throw new Error('Failed to generate book recommendations');
      }

      if (!aiData?.response) {
        throw new Error('Invalid AI response received');
      }

      setRecommendations(aiData.response);
      
      toast({
        title: "Recommendations Generated",
        description: "Here are the best books for your subject!"
      });
    } catch (error) {
      console.error('Error getting book recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to get book recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Book Recommendations
            </h1>
            <Sparkles className="w-8 h-8 text-secondary" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenCheck className="w-5 h-5" />
                Get Book Recommendations
              </CardTitle>
              <CardDescription>
                Enter any subject and get curated book recommendations from our AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject or Topic</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter any subject (e.g., Machine Learning, Ancient History, Calculus...)"
                  className="w-full"
                  onKeyPress={(e) => e.key === 'Enter' && getBookRecommendations()}
                />
              </div>
              
              <Button 
                onClick={getBookRecommendations}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? "Getting Recommendations..." : "Get Book Recommendations"}
              </Button>
            </CardContent>
          </Card>

          {/* Recommendations Section */}
          <Card className="border-secondary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Recommended Books
              </CardTitle>
              <CardDescription>
                AI-curated books and reference materials for your subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!recommendations ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Enter a subject above to get personalized book recommendations!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  <div className="bg-secondary/10 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Recommendations for: {subject}
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-foreground">
                        {recommendations}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Why Our Book Recommendations?</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="text-center border-primary/20">
              <CardContent className="pt-6">
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Curated Selection</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered recommendations based on academic excellence and user reviews
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-secondary/20">
              <CardContent className="pt-6">
                <User className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">For All Levels</h3>
                <p className="text-sm text-muted-foreground">
                  From beginner-friendly texts to advanced academic resources
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-accent/20">
              <CardContent className="pt-6">
                <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Updated Content</h3>
                <p className="text-sm text-muted-foreground">
                  Recommendations include both classic texts and latest publications
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