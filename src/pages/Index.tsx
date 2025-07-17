import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, MessageSquare, Brain, Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<Array<{id: string, question: string, answer: string, subject: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "History", 
    "Literature", "Computer Science", "Economics", "Psychology", "Philosophy"
  ];

  const handleSubmitQuestion = async () => {
    if (!selectedSubject || !question.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a subject and enter your question.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Store the question in Supabase
      const { data, error } = await supabase
        .from('queries')
        .insert({
          subject: selectedSubject,
          question: question.trim(),
          ai_response: "This is a simulated AI response. In a real implementation, this would connect to an AI service to provide personalized tutoring based on your question about " + selectedSubject + "."
        })
        .select()
        .single();

      if (error) throw error;

      // Add to conversation
      setConversation(prev => [...prev, {
        id: data.id,
        question: data.question!,
        answer: data.ai_response!,
        subject: data.subject!
      }]);

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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Tutor
            </h1>
            <Sparkles className="w-8 h-8 text-secondary" />
          </div>
          <p className="text-xl text-muted-foreground">
            Your personal AI-powered learning companion
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Question Input Section */}
          <Card className="border-primary/20 shadow-lg">
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
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                className="w-full"
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? "Getting Answer..." : "Ask AI Tutor"}
              </Button>
            </CardContent>
          </Card>

          {/* Conversation Section */}
          <Card className="border-secondary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Conversation History
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
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
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
                        <p className="text-foreground">{item.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose AI Tutor?</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center border-primary/20">
              <CardContent className="pt-6">
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Multi-Subject Support</h3>
                <p className="text-sm text-muted-foreground">
                  Get help across various subjects from math to literature
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-secondary/20">
              <CardContent className="pt-6">
                <Brain className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Intelligent Responses</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered explanations tailored to your learning style
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-accent/20">
              <CardContent className="pt-6">
                <MessageSquare className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Conversation History</h3>
                <p className="text-sm text-muted-foreground">
                  Track your learning progress and revisit past questions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;