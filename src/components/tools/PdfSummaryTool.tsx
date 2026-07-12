import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Download, FileText } from "lucide-react";
import { generatePdfSummary } from "@/api/toolsApi";

const PdfSummaryTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [length, setLength] = useState<'short' | 'medium' | 'detailed'>('medium');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleGenerate = async () => {
    if (!file) return;
    setLoading(true);
    try {
      let fileContent = "";
      try {
        fileContent = await readFileContent(file);
      } catch (err) {
        console.error("FileReader error, falling back to name only:", err);
        fileContent = "Document content not available. Please answer based on filename: " + file.name;
      }
      const result = await generatePdfSummary(file.name, fileContent, length);
      setSummary(result.summary);
    } catch (err: any) {
      console.error(err);
      setSummary("Error generating summary: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.replace('.pdf', '')}-summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="text-3xl">📄</span>
        <h3 className="text-xl font-semibold">PDF → Summary Generator</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Upload PDF</label>
            <div className="relative">
              <Input 
                type="file" 
                accept=".pdf" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
              {file && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  {file.name}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Summary Length</label>
            <Select value={length} onValueChange={(v: 'short' | 'medium' | 'detailed') => setLength(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleGenerate} 
              disabled={!file || loading}
              className="flex-1 hover-scale"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Analyzing PDF...' : 'Generate Summary'}
            </Button>
            <Button 
              onClick={handleDownload} 
              variant="outline" 
              disabled={!summary}
              className="hover-scale"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Generated Summary</label>
          <Textarea 
            value={summary}
            readOnly
            placeholder={loading ? "Analyzing your PDF and generating summary..." : "Summary will appear here..."}
            className="h-64 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PdfSummaryTool;
