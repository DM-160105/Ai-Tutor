import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Brain, Send, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FloatingHeader } from "@/components/FloatingHeader";
import { QuestionHistory } from "@/components/QuestionHistory";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [currentResponse, setCurrentResponse] = useState<{question: string, answer: string, subject: string} | null>(null);
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

  // No need to load conversation history as we only show current response

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
        // Set current response
        setCurrentResponse({
          question: data.question!,
          answer: data.ai_response!,
          subject: data.subject!
        });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <FloatingHeader />
      <div className="pt-20 container mx-auto px-4 py-8">
        <Tabs defaultValue="ask" className="w-full max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="ask" className="hover-scale">Ask Question</TabsTrigger>
            <TabsTrigger value="history" className="hover-scale">Question History</TabsTrigger>
          </TabsList>

          <TabsContent value="ask" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Question Input Section */}
              <Card className="border-primary/20 shadow-lg bg-card/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Ask Your Question
                  </CardTitle>
                  <CardDescription>
                    Enter any subject and ask your question to get detailed AI-powered explanations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      placeholder="Enter any subject (e.g., Mathematics, Physics, History...)"
                      className="w-full hover-scale"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Question</label>
                    <Textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="What would you like to learn about?"
                      className="min-h-[120px] resize-none hover-scale"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSubmitQuestion}
                    disabled={isLoading}
                    className="w-full hover-scale shadow-glow"
                    size="lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isLoading ? "Getting Answer..." : "Ask AI Tutor"}
                  </Button>
                </CardContent>
              </Card>

              {/* Current Response Section */}
              <Card className="border-secondary/20 shadow-lg bg-card/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{animationDelay: '0.1s'}}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Response
                  </CardTitle>
                  <CardDescription>
                    Get detailed explanations with markdown formatting and mathematical equations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!currentResponse ? (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Ask a question to see your AI tutor's response here!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fade-in">
                      <div className="bg-primary/10 rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-1 font-medium">
                          {currentResponse.subject}
                        </div>
                        <p className="font-medium">{currentResponse.question}</p>
                      </div>
                      <div className="bg-secondary/10 rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          AI Tutor Response
                        </div>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              code({ className, children, ...props }: any) {
                                return (
                                  <code className={`${className} bg-muted px-1 py-0.5 rounded text-sm`} {...props}>
                                    {children}
                                  </code>
                                );
                              }
                            }}
                          >
                            {currentResponse.answer}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <QuestionHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;