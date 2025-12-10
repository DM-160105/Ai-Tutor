import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { mockAnalyzeCode, CodeAnalysisResult } from "@/api/toolsApi";

const CodeExplainerTool = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [mode, setMode] = useState<'explain' | 'bugs'>('explain');
  const [result, setResult] = useState<CodeAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setError('');
    if (!code.trim()) {
      setError('Please paste your code first');
      return;
    }

    setLoading(true);
    try {
      const analysis = await mockAnalyzeCode(code, language, mode);
      setResult(analysis);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="text-3xl">💻</span>
        <h3 className="text-xl font-semibold">Code Explainer & Debugger</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Paste your code</label>
            <div className="relative">
              <Textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="h-64 font-mono text-sm resize-none"
              />
              <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {code.length} chars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="c">C</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Mode</label>
              <RadioGroup value={mode} onValueChange={(v: 'explain' | 'bugs') => setMode(v)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="explain" id="explain" />
                  <Label htmlFor="explain" className="cursor-pointer">Explain</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bugs" id="bugs" />
                  <Label htmlFor="bugs" className="cursor-pointer">Find Bugs</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button 
            onClick={handleAnalyze} 
            disabled={loading} 
            className="w-full hover-scale"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? 'Analyzing your code...' : 'Analyze Code'}
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Analysis Result</label>
          <div className="glass-card rounded-xl p-4 h-[340px] overflow-y-auto scrollbar-modern">
            {result ? (
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {result.content}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>{loading ? 'Analyzing...' : 'Analysis will appear here...'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeExplainerTool;
