import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, FileText, Send } from "lucide-react";
import { askFileQuestion, FileQuestionResult } from "@/api/toolsApi";

const FileQuestionTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<FileQuestionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleAsk = async () => {
    setError('');
    if (!file) {
      setError('Please upload a file first');
      return;
    }
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    try {
      let fileContent = "";
      try {
        fileContent = await readFileContent(file);
      } catch (err) {
        console.error("FileReader error, falling back to name only:", err);
        fileContent = "Document content not available. Please answer based on filename: " + file.name;
      }
      const result = await askFileQuestion(file.name, fileContent, question);
      setConversation(prev => [...prev, result]);
      setQuestion('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while answering your question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="text-3xl">❓</span>
        <h3 className="text-xl font-semibold">File-based Question Solver</h3>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Upload File</label>
        <Input 
          type="file" 
          accept=".pdf,.docx,.txt" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="cursor-pointer max-w-md"
        />
        {file && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            {file.name}
          </div>
        )}
      </div>

      <div className="glass-card rounded-xl p-4 min-h-[300px] max-h-[400px] overflow-y-auto scrollbar-modern">
        {conversation.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>Ask a question about your uploaded file...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversation.map((item, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                    {item.question}
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-2 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Reading file and generating answer...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="flex gap-3">
        <Input 
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about this file..."
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleAsk()}
          className="flex-1"
        />
        <Button onClick={handleAsk} disabled={loading} className="hover-scale">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default FileQuestionTool;
