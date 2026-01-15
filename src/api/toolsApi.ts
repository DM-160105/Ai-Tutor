// Real API for Tools using Gemini AI via Supabase Edge Function
import { supabase } from "@/integrations/supabase/client";

export interface ToolSummary {
  summary: string;
  wordCount: number;
}

export interface FileQuestionResult {
  question: string;
  answer: string;
  timestamp: Date;
  confidence?: number;
}

export interface CodeAnalysisResult {
  mode: 'explain' | 'bugs';
  language: string;
  content: string;
  linesAnalyzed?: number;
}

export interface VideoSummaryResult {
  summary: string;
  keyTakeaways: string[];
  duration: string;
  source?: string;
}

// Helper to call AI
const callAI = async (subject: string, question: string): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('generate-tutor-response', {
    body: { subject, question }
  });

  if (error) {
    console.error('AI error:', error);
    throw new Error('Failed to get AI response');
  }

  if (!data?.response) {
    throw new Error('Invalid AI response');
  }

  return data.response;
};

export const generatePdfSummary = async (
  fileName: string,
  fileContent: string,
  length: 'short' | 'medium' | 'detailed'
): Promise<ToolSummary> => {
  const lengthInstructions = {
    short: 'Provide a brief 2-3 sentence summary.',
    medium: 'Provide a comprehensive summary in about 150-200 words with key bullet points.',
    detailed: 'Provide a detailed summary covering all main sections, key findings, and conclusions in 300-400 words.'
  };

  const prompt = `Summarize this document "${fileName}":\n\n${fileContent}\n\n${lengthInstructions[length]}`;
  
  const summary = await callAI('Document Analysis', prompt);
  
  return {
    summary,
    wordCount: summary.split(' ').length
  };
};

export const askFileQuestion = async (
  fileName: string,
  fileContent: string,
  question: string
): Promise<FileQuestionResult> => {
  const prompt = `Based on the content of the file "${fileName}":\n\n${fileContent}\n\nAnswer this question: ${question}`;
  
  const answer = await callAI('Document Q&A', prompt);
  
  return {
    question,
    answer,
    timestamp: new Date()
  };
};

export const analyzeCode = async (
  code: string,
  language: string,
  mode: 'explain' | 'bugs'
): Promise<CodeAnalysisResult> => {
  const modeInstructions = {
    explain: `Explain this ${language} code step by step. Describe what each section does, the overall logic, and the time/space complexity if applicable.`,
    bugs: `Analyze this ${language} code for potential bugs, issues, and improvements. List each issue with an explanation and suggestion for fixing it.`
  };

  const prompt = `${modeInstructions[mode]}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``;
  
  const content = await callAI('Code Analysis', prompt);
  
  return {
    mode,
    language,
    content,
    linesAnalyzed: code.split('\n').length
  };
};

export const summarizeVideo = async (
  url: string,
  focus: 'overview' | 'concepts' | 'exam'
): Promise<VideoSummaryResult> => {
  const focusInstructions = {
    overview: 'Provide a general overview of what this educational video likely covers based on its URL/topic.',
    concepts: 'Focus on identifying and explaining the key concepts and frameworks that would typically be covered.',
    exam: 'Focus on exam-relevant points, important formulas, definitions, and commonly tested topics.'
  };

  // Extract topic from URL
  const urlParts = url.split('/');
  const videoId = urlParts[urlParts.length - 1] || url;
  
  const prompt = `Based on this video URL: ${url}\n\n${focusInstructions[focus]}\n\nProvide:\n1. A summary paragraph\n2. 3-5 key takeaways as bullet points\n\nFormat your response as:\nSUMMARY:\n[summary text]\n\nKEY TAKEAWAYS:\n• [point 1]\n• [point 2]\n• [point 3]`;
  
  const response = await callAI('Video Analysis', prompt);
  
  // Parse the response
  const summaryMatch = response.match(/SUMMARY:\s*([\s\S]*?)(?=KEY TAKEAWAYS:|$)/i);
  const takeawaysMatch = response.match(/KEY TAKEAWAYS:\s*([\s\S]*?)$/i);
  
  const summary = summaryMatch ? summaryMatch[1].trim() : response;
  const takeawaysText = takeawaysMatch ? takeawaysMatch[1].trim() : '';
  const keyTakeaways = takeawaysText
    .split(/[•\-\*\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .slice(0, 5);

  return {
    summary,
    keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways : ['Key concepts from the video', 'Main learning objectives', 'Practical applications'],
    duration: 'Estimated based on content'
  };
};

// Legacy exports for backward compatibility (deprecated - will be removed)
export const mockGeneratePdfSummary = async (
  fileName: string,
  length: 'short' | 'medium' | 'detailed'
): Promise<ToolSummary> => {
  // Use AI with placeholder content when no file content provided
  return generatePdfSummary(fileName, 'Document content not provided - generating general summary based on filename.', length);
};

export const mockAskFileQuestion = async (
  fileName: string,
  question: string
): Promise<FileQuestionResult> => {
  return askFileQuestion(fileName, 'Document content not provided - answering based on general knowledge related to the filename and question.', question);
};

export const mockAnalyzeCode = analyzeCode;

export const mockSummarizeVideo = summarizeVideo;
