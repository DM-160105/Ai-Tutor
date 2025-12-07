import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ToolCard from "@/components/tools/ToolCard";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Lazy load tool components for performance
const PdfSummaryTool = lazy(() => import("@/components/tools/PdfSummaryTool"));
const FileQuestionTool = lazy(() => import("@/components/tools/FileQuestionTool"));
const CodeExplainerTool = lazy(() => import("@/components/tools/CodeExplainerTool"));
const VideoSummaryTool = lazy(() => import("@/components/tools/VideoSummaryTool"));

type ToolType = 'pdf' | 'file' | 'code' | 'video' | null;

const tools = [
  {
    id: 'pdf' as ToolType,
    icon: '📄',
    title: 'PDF → Summary Generator',
    description: 'Upload a PDF and get a concise summary of its contents.',
    badges: ['Fast', 'Accurate']
  },
  {
    id: 'file' as ToolType,
    icon: '❓',
    title: 'File-based Question Solver',
    description: 'Ask questions about any uploaded document.',
    badges: ['Interactive', 'Smart']
  },
  {
    id: 'code' as ToolType,
    icon: '💻',
    title: 'Code Explainer & Debugger',
    description: 'Explain code or find potential bugs instantly.',
    badges: ['Student-friendly', 'Multi-language']
  },
  {
    id: 'video' as ToolType,
    icon: '🎥',
    title: 'Video Lecture Summarizer',
    description: 'Get summaries and key points from video lectures.',
    badges: ['Exam-ready', 'Time-saver']
  }
];

const ToolLoader = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const ToolsPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTool, setActiveTool] = useState<ToolType>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const renderTool = () => {
    switch (activeTool) {
      case 'pdf':
        return <PdfSummaryTool />;
      case 'file':
        return <FileQuestionTool />;
      case 'code':
        return <CodeExplainerTool />;
      case 'video':
        return <VideoSummaryTool />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/tutor')} className="hover-scale">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">AI Tools</h1>
            <p className="text-muted-foreground">Utility tools to supercharge your study workflow.</p>
          </div>
        </div>

        {/* Tool Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {tools.map(tool => (
            <ToolCard
              key={tool.id}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              badges={tool.badges}
              isActive={activeTool === tool.id}
              onOpen={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
            />
          ))}
        </div>

        {/* Active Tool UI */}
        {activeTool && (
          <div className="glass-card rounded-2xl p-6 animate-fade-in">
            <Suspense fallback={<ToolLoader />}>
              {renderTool()}
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsPage;
