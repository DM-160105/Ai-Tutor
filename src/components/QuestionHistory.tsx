import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Trash2, Search, ChevronDown, ChevronUp, Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface Question {
  id: string;
  question: string;
  answer: string;
  subject: string;
  created_at: string;
}

export const QuestionHistory = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadQuestionHistory();
  }, [user]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuestions(filtered);
    } else {
      setFilteredQuestions(questions);
    }
  }, [searchTerm, questions]);

  const loadQuestionHistory = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('queries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedQuestions = data.map(item => ({
          id: item.id,
          question: item.question!,
          answer: item.ai_response!,
          subject: item.subject!,
          created_at: item.created_at
        }));
        setQuestions(formattedQuestions);
      }
    } catch (error) {
      console.error('Error loading question history:', error);
      toast({
        title: "Error",
        description: "Failed to load history"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('queries')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setQuestions([]);
      setFilteredQuestions([]);
      toast({
        title: "Cleared",
        description: "History has been cleared"
      });
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: "Error",
        description: "Failed to clear history"
      });
    }
  };

  const toggleExpanded = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="glass-card border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Question History
          </div>
          {questions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="text-destructive hover:text-destructive hover-scale rounded-xl border-border/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Your AI tutor conversation history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 input-focus rounded-xl border-border/50"
            />
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-6 h-6 border-3 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <History className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {searchTerm ? "No results found" : "No questions yet"}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-2 scrollbar-modern">
            <div className="space-y-3">
              {filteredQuestions.map((question) => {
                const isExpanded = expandedQuestions.has(question.id);
                return (
                  <div 
                    key={question.id} 
                    className="p-4 bg-muted/30 border border-border/30 rounded-xl hover:border-primary/30 smooth-transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-lg">
                            {question.subject}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(question.created_at)}
                          </span>
                        </div>
                        <h4 className="font-medium text-sm line-clamp-2">
                          {question.question}
                        </h4>
                        
                        {isExpanded && (
                          <div className="mt-4 p-4 bg-background/50 rounded-xl border border-border/20">
                            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1 font-medium">
                              <Brain className="w-3 h-3" />
                              AI Response
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
                                {question.answer}
                              </ReactMarkdown>
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(question.id)}
                        className="hover-scale rounded-lg shrink-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};