import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, MessageSquare, Brain, Send, Sparkles, Camera, BookOpenCheck, Users, Award, Clock, Target, TrendingUp, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<Array<{id: string, question: string, answer: string, subject: string}>>([]);
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
          <p className="text-lg text-muted-foreground">Loading your AI Tutor...</p>
        </div>
      </div>
    );
  }

  // Removed predefined subjects - now using text input

  // Load user's conversation history
  useEffect(() => {
    const loadConversationHistory = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('queries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        if (data) {
          const formattedConversation = data.map(item => ({
            id: item.id,
            question: item.question!,
            answer: item.ai_response!,
            subject: item.subject!
          }));
          setConversation(formattedConversation.reverse());
        }
      } catch (error) {
        console.error('Error loading conversation history:', error);
      }
    };

    loadConversationHistory();
  }, [user]);

  const handleSubmitQuestion = async () => {
    if (!selectedSubject || !question.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a subject and your question.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate AI response using Gemini
      const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-tutor-response', {
        body: {
          subject: selectedSubject,
          question: question.trim()
        }
      });

      if (aiError) {
        console.error('AI generation error:', aiError);
        throw new Error('Failed to generate AI response');
      }

      if (!aiData?.response) {
        throw new Error('Invalid AI response received');
      }

      // Store the question and AI response in Supabase with user_id
      const { data, error } = await supabase
        .from('queries')
        .insert({
          subject: selectedSubject,
          question: question.trim(),
          ai_response: aiData.response,
          user_id: user?.id
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Add to conversation
        setConversation(prev => [...prev, {
          id: data.id,
          question: data.question!,
          answer: data.ai_response!,
          subject: data.subject!
        }]);
      }

      setQuestion("");
      
      toast({
        title: "Question Submitted",
        description: "Your AI tutor has responded!"
      });
    } catch (error) {
      console.error('Error submitting question:', error);
      toast({
        title: "Error",
        description: "Failed to submit your question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartVisualLearning = () => {
    navigate('/visual-learning');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <Header onStartVisualLearning={handleStartVisualLearning} />

        <div className="grid lg:grid-cols-2 gap-4 md:gap-8 max-w-7xl mx-auto">
          {/* Question Input Section */}
          <Card className="border-primary/20 shadow-lg bg-card/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Ask Your Question
              </CardTitle>
              <CardDescription>
                Select a subject and ask any question you'd like help with
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Input
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  placeholder="Enter any subject (e.g., Mathematics, Physics, History...)"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Your Question</label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What would you like to learn about?"
                  className="min-h-[120px] resize-none"
                />
              </div>
              
              <Button 
                onClick={handleSubmitQuestion}
                disabled={isLoading}
                className="w-full hover-scale"
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? "Getting Answer..." : "Ask AI Tutor"}
              </Button>
            </CardContent>
          </Card>

          {/* Conversation Section */}
          <Card className="border-secondary/20 shadow-lg bg-card/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-fade-in"
            style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Conversation History
                </div>
                {conversation.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConversation([])}
                    className="text-destructive hover:text-destructive"
                  >
                    Clear History
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Your questions and AI tutor responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {conversation.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No questions yet. Start by asking your AI tutor something!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] md:max-h-[500px] overflow-y-auto">
                  {conversation.map((item) => (
                    <div key={item.id} className="space-y-3">
                      <div className="bg-primary/10 rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-1 font-medium">
                          {item.subject}
                        </div>
                        <p className="font-medium">{item.question}</p>
                      </div>
                      <div className="bg-secondary/10 rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-1 font-medium flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          AI Tutor Response
                        </div>
                        <p className="text-foreground font-bold">{item.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;