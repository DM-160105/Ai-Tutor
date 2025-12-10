// Mock API for Tools with improved typing

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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockGeneratePdfSummary = async (
  fileName: string,
  length: 'short' | 'medium' | 'detailed'
): Promise<ToolSummary> => {
  await delay(1200);
  
  const summaries = {
    short: `This document "${fileName}" covers key concepts in the subject area. The main points include foundational principles and practical applications.`,
    medium: `This document "${fileName}" provides a comprehensive overview of the topic. It begins with fundamental concepts and progressively builds to more advanced ideas. Key sections include:\n\n• Introduction to core principles\n• Detailed methodology and approaches\n• Practical examples and case studies\n• Summary of findings and conclusions`,
    detailed: `This document "${fileName}" offers an in-depth exploration of the subject matter.\n\n**Overview:**\nThe document opens with a thorough introduction to the fundamental concepts.\n\n**Core Content:**\nThe main body delves into detailed explanations of key principles.\n\n**Key Findings:**\n• Understanding of fundamental principles is essential\n• Practical application reinforces learning\n• Multiple approaches can achieve similar results`
  };
  
  return {
    summary: summaries[length],
    wordCount: summaries[length].split(' ').length
  };
};

export const mockAskFileQuestion = async (
  fileName: string,
  question: string
): Promise<FileQuestionResult> => {
  await delay(1000);
  
  const answers = [
    `Based on the content of "${fileName}", the answer involves understanding the core concepts presented.`,
    `From analyzing "${fileName}", your question relates to a key theme in the document.`,
    `The document "${fileName}" addresses this directly in several sections.`
  ];
  
  return {
    question,
    answer: answers[Math.floor(Math.random() * answers.length)],
    timestamp: new Date()
  };
};

export const mockAnalyzeCode = async (
  code: string,
  language: string,
  mode: 'explain' | 'bugs'
): Promise<CodeAnalysisResult> => {
  await delay(1100);
  
  if (mode === 'explain') {
    return {
      mode,
      language,
      content: `**Code Explanation (${language})**\n\n1. **Initialization**: Sets up variables and configurations.\n2. **Main Logic**: Processing data through operations.\n3. **Output**: Processed data is returned.\n\n**Complexity**: O(n) based on visible operations.`
    };
  }
  
  return {
    mode,
    language,
    content: `**Potential Issues (${language})**\n\n• Consider adding input validation\n• Potential null reference - add null check\n• This loop could be optimized\n• Variable naming could be more descriptive\n\n**Recommendations:**\n1. Implement error handling\n2. Add input validation`
  };
};

export const mockSummarizeVideo = async (
  url: string,
  focus: 'overview' | 'concepts' | 'exam'
): Promise<VideoSummaryResult> => {
  await delay(1500);
  
  const focusContent = {
    overview: {
      summary: `This video lecture provides a comprehensive introduction to the topic with clear transitions between sections.`,
      keyTakeaways: ['Understanding fundamentals is crucial', 'Practical examples reinforce concepts', 'Regular review improves retention']
    },
    concepts: {
      summary: `The lecture focuses on key conceptual frameworks and their applications with supporting examples.`,
      keyTakeaways: ['Core concept: The foundational principle', 'Relationship mapping: How concepts interconnect', 'Application framework: Theory into practice']
    },
    exam: {
      summary: `This lecture covers essential exam-oriented content with emphasis on commonly tested topics.`,
      keyTakeaways: ['⭐ High-frequency exam topic', '📝 Key formula to memorize', '💡 Problem-solving strategy']
    }
  };
  
  return {
    ...focusContent[focus],
    duration: '~45 minutes'
  };
};