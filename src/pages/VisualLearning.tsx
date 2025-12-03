import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Camera, ImageIcon, Book, ArrowLeft, Send, Download, Share2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { FloatingHeader } from "@/components/FloatingHeader";

const VisualLearning = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const subjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", "History", 
    "Literature", "Computer Science", "Economics", "Psychology", "Philosophy",
    "Art", "Geography", "Astronomy", "Medicine", "Engineering"
  ];

  const handleGenerate = async () => {
    if (!selectedSubject || !topic.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a subject and enter a topic."
      });
      return;
    }

    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to generate visuals."
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: visualData, error: visualError } = await supabase.functions.invoke('generate-visual-explanation', {
        body: {
          subject: selectedSubject,
          topic: topic.trim(),
          description: description.trim(),
          user_id: user.id
        }
      });

      if (visualError) {
        console.error('Visual generation error:', visualError);
        throw new Error('Failed to generate visual');
      }

      if (!visualData?.image || !visualData?.explanation) {
        throw new Error('Invalid response received');
      }

      setGeneratedImage(visualData.image);
      setExplanation(visualData.explanation);
      
      toast({
        title: "Generated!",
        description: "Your visual content is ready."
      });
    } catch (error) {
      console.error('Error generating visual:', error);
      toast({
        title: "Error",
        description: "Failed to generate. Try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage?.startsWith("http")
        ? generatedImage
        : `data:image/png;base64,${generatedImage}`;
      link.download = `${topic.replace(/\s+/g, '_')}_visual.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (navigator.share && generatedImage) {
      try {
        await navigator.share({
          title: `Visual: ${topic}`,
          text: explanation.substring(0, 100) + '...',
          url: window.location.href
        });
      } catch (error) {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Link copied to clipboard."
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <FloatingHeader />
      
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-72 h-72 bg-accent/10 rounded-full" />
        <div className="absolute bottom-40 left-20 w-56 h-56 bg-primary/10 rounded-full" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Visual Learning Lab
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Create <span className="gradient-text">Visual Content</span>
          </h1>
          <p className="text-muted-foreground">
            Generate images and detailed explanations for any topic
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Input Section */}
          <Card className="glass-card border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Camera className="w-5 h-5 text-primary" />
                Create Visual
              </CardTitle>
              <CardDescription>
                Enter topic details to generate an image with explanation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="h-12 rounded-xl border-border/50">
                    <SelectValue placeholder="Choose a subject" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-border/50">
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject} className="rounded-lg">
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Topic</label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Photosynthesis, DNA Structure..."
                  className="h-12 input-focus rounded-xl border-border/50"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Details (Optional)</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Any specific details for the visualization..."
                  className="min-h-[100px] resize-none input-focus rounded-xl border-border/50"
                />
              </div>
              
              <Button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full h-12 hover-scale btn-glow rounded-xl text-base font-semibold"
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? "Generating..." : "Generate Visual"}
              </Button>

              {/* Features */}
              <div className="pt-4 border-t border-border/30">
                <p className="text-sm font-medium mb-3">What you get:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-lg">
                    <ImageIcon className="w-3 h-3 mr-1" />
                    AI Image
                  </Badge>
                  <Badge variant="secondary" className="rounded-lg">
                    <Book className="w-3 h-3 mr-1" />
                    Explanation
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="glass-card border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon className="w-5 h-5 text-accent" />
                    Generated Content
                  </CardTitle>
                  <CardDescription>
                    Your visual learning materials
                  </CardDescription>
                </div>
                {generatedImage && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownload} className="hover-scale rounded-lg border-border/50">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare} className="hover-scale rounded-lg border-border/50">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!generatedImage && !isLoading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Fill the form and generate to see content
                  </p>
                </div>
              ) : isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Generating visual...</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-modern">
                  {/* Generated Image */}
                  <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
                    <h3 className="font-medium text-sm mb-3">Visual</h3>
                    {generatedImage && (
                      <img
                        src={
                          generatedImage?.startsWith("http")
                            ? generatedImage
                            : `data:image/png;base64,${generatedImage}`
                        }
                        alt={`Visual of ${topic}`}
                        className="w-full rounded-lg shadow-md"
                        loading="lazy"
                      />
                    )}
                  </div>

                  {/* Explanation */}
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <h3 className="font-medium text-sm mb-3">Explanation</h3>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {explanation}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisualLearning;