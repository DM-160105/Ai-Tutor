import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Video, CheckCircle } from "lucide-react";
import { mockSummarizeVideo, VideoSummaryResult } from "@/api/toolsApi";

const VideoSummaryTool = () => {
  const [url, setUrl] = useState('');
  const [focus, setFocus] = useState<'overview' | 'concepts' | 'exam'>('overview');
  const [result, setResult] = useState<VideoSummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    setError('');
    if (!url.trim()) {
      setError('Please enter a video URL');
      return;
    }

    setLoading(true);
    try {
      const result = await mockSummarizeVideo(url, focus);
      if (result.success) {
        setResult(result.data);
      } else if (!result.success) {
        setError(result.error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🎥</span>
        <h3 className="text-xl font-semibold">Video Lecture Summarizer</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Video URL</label>
            <Input 
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Focus</label>
            <Select value={focus} onValueChange={(v: 'overview' | 'concepts' | 'exam') => setFocus(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="concepts">Key Concepts</SelectItem>
                <SelectItem value="exam">Exam-Oriented</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button 
            onClick={handleSummarize} 
            disabled={loading} 
            className="w-full hover-scale"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? 'Fetching transcript...' : 'Summarize'}
          </Button>

          {result && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Video className="w-4 h-4" />
              Estimated duration: {result.duration}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Summary</label>
            <div className="glass-card rounded-xl p-4 min-h-[120px]">
              {result ? (
                <p className="text-sm">{result.summary}</p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {loading ? 'Generating summary...' : 'Summary will appear here...'}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Key Takeaways</label>
            <div className="glass-card rounded-xl p-4 min-h-[150px]">
              {result ? (
                <ul className="space-y-2">
                  {result.keyTakeaways.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Key points will appear here...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSummaryTool;
