import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3"
    >
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
      <span className="text-muted-foreground">Loading tool...</span>
    </motion.div>
  </div>
);

const ToolsPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTool, setActiveTool] = useState<ToolType>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="liquid-glass px-6 py-4 rounded-2xl flex items-center gap-3"
        >
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading...</span>
        </motion.div>
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-primary/15 to-accent/10 orb-glow"
          animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 -left-20 w-64 h-64 rounded-full bg-gradient-to-tr from-accent/15 to-primary/8 orb-glow"
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" onClick={() => navigate('/tutor')} className="rounded-xl liquid-glass-light">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold">AI Tools</h1>
            <p className="text-muted-foreground">Utility tools to supercharge your study workflow.</p>
          </div>
        </motion.div>

        {/* Tool Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <ToolCard
                icon={tool.icon}
                title={tool.title}
                description={tool.description}
                badges={tool.badges}
                isActive={activeTool === tool.id}
                onOpen={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Active Tool UI */}
        {activeTool && (
          <motion.div 
            className="liquid-glass rounded-3xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Suspense fallback={<ToolLoader />}>
              {renderTool()}
            </Suspense>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ToolsPage;
