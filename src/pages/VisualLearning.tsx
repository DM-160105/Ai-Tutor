import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Camera, ImageIcon, Book, ArrowLeft, Send, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

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
        description: "Please select a subject and enter a topic.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate visual explanations.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate visual explanation using AI
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
        throw new Error('Failed to generate visual explanation');
      }

      if (!visualData?.image || !visualData?.explanation) {
        throw new Error('Invalid response received');
      }

      setGeneratedImage(visualData.image);
      setExplanation(visualData.explanation);
      
      toast({
        title: "Visual Explanation Generated!",
        description: "Your AI-powered visual learning content is ready."
      });
    } catch (error) {
      console.error('Error generating visual explanation:', error);
      toast({
        title: "Error",
        description: "Failed to generate visual explanation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
  if (generatedImage) {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${generatedImage}`;
    link.download = `${topic.replace(/\s+/g, '_')}_visual_explanation.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

  const handleShare = async () => {
    if (navigator.share && generatedImage) {
      try {
        await navigator.share({
          title: `Visual Explanation: ${topic}`,
          text: explanation.substring(0, 100) + '...',
          url: window.location.href
        });
      } catch (error) {
        // Fallback to copying link
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "The link has been copied to your clipboard."
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Visual Learning Lab</h1>
            <p className="text-muted-foreground">Generate images and detailed explanations for any topic</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Create Visual Content
              </CardTitle>
              <CardDescription>
                Tell us what you want to visualize and we'll create an image with a detailed explanation
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
                <label className="text-sm font-medium mb-2 block">Topic/Concept</label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Photosynthesis, Newton's Laws, DNA Structure..."
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Additional Details (Optional)</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any specific details you want included in the visualization..."
                  className="min-h-[100px] resize-none"
                />
              </div>
              
              <Button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? "Generating..." : "Generate Visual Explanation"}
              </Button>

              {/* Features */}
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">What you'll get:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <ImageIcon className="w-3 h-3 mr-1" />
                      AI-Generated Image
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Book className="w-3 h-3 mr-1" />
                      Detailed Explanation
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="border-secondary/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Generated Content
                  </CardTitle>
                  <CardDescription>
                    Your AI-powered visual learning materials
                  </CardDescription>
                </div>
                {generatedImage && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!generatedImage && !isLoading ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg mb-2">No content generated yet</p>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form and click "Generate" to create your visual explanation
                  </p>
                </div>
              ) : isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Generating your visual explanation...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Generated Image */}
                  <div className="bg-secondary/10 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Visual Representation</h3>
                    <img
  src={`data:image/png;base64,${generatedImage}`}
  alt={`Visual explanation of ${topic}`}
  className="w-full rounded-lg shadow-md"
  loading="lazy"
/>

  {generatedImage && (
  <img
    src={`data:image/png;base64,${generatedImage}`}
    alt={`Visual explanation of ${topic}`}
    className="w-full rounded-lg shadow-md mt-4"
    loading="lazy"
  />
)}
                  </div>

                  {/* Explanation */}
                  <div className="bg-primary/10 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Detailed Explanation</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-foreground whitespace-pre-wrap">{explanation}</p>
                    </div>
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
