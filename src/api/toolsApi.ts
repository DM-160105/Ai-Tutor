// Mock API for Tools
export interface ToolSummary {
  summary: string;
  wordCount: number;
}

export interface FileQuestionResult {
  question: string;
  answer: string;
  timestamp: Date;
}

export interface CodeAnalysisResult {
  mode: 'explain' | 'bugs';
  language: string;
  content: string;
}

export interface VideoSummaryResult {
  summary: string;
  keyTakeaways: string[];
  duration: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockGeneratePdfSummary = async (
  fileName: string,
  length: 'short' | 'medium' | 'detailed'
): Promise<ToolSummary> => {
  await delay(1500);
  
  const summaries = {
    short: `This document "${fileName}" covers key concepts in the subject area. The main points include foundational principles and practical applications. It provides a concise overview suitable for quick review.`,
    medium: `This document "${fileName}" provides a comprehensive overview of the topic. It begins with fundamental concepts and progressively builds to more advanced ideas. Key sections include:\n\n• Introduction to core principles\n• Detailed methodology and approaches\n• Practical examples and case studies\n• Summary of findings and conclusions\n\nThe document is well-structured for learning and reference purposes.`,
    detailed: `This document "${fileName}" offers an in-depth exploration of the subject matter.\n\n**Overview:**\nThe document opens with a thorough introduction to the fundamental concepts, establishing the theoretical framework for the discussion.\n\n**Core Content:**\nThe main body delves into detailed explanations of key principles, supported by examples and illustrations. Each concept is broken down into manageable sections with clear explanations.\n\n**Methodology:**\nVarious approaches and techniques are discussed, comparing their effectiveness and applicability in different scenarios.\n\n**Practical Applications:**\nReal-world case studies demonstrate how the concepts can be applied, providing context for theoretical knowledge.\n\n**Key Findings:**\n• Understanding of fundamental principles is essential\n• Practical application reinforces learning\n• Multiple approaches can achieve similar results\n\n**Conclusion:**\nThe document concludes with actionable insights and recommendations for further study.`
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
  await delay(1200);
  
  const answers = [
    `Based on the content of "${fileName}", the answer to your question involves understanding the core concepts presented. The document suggests that this topic requires careful consideration of multiple factors and approaches.`,
    `From analyzing "${fileName}", I found that your question relates to a key theme in the document. The text explains this through examples and practical applications, emphasizing the importance of foundational knowledge.`,
    `The document "${fileName}" addresses this directly in several sections. The main insight is that success in this area depends on both theoretical understanding and practical application of the principles discussed.`
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
  await delay(1300);
  
  if (mode === 'explain') {
    return {
      mode,
      language,
      content: `**Code Explanation (${language})**\n\nThis code performs the following operations:\n\n1. **Initialization**: The code begins by setting up necessary variables and configurations.\n\n2. **Main Logic**: The core functionality involves processing data through a series of operations:\n   - Data validation and preprocessing\n   - Core computation or transformation\n   - Result formatting and output\n\n3. **Control Flow**: The code uses conditional statements and loops to handle different scenarios.\n\n4. **Output**: Finally, the processed data is returned or displayed.\n\n**Complexity**: The overall time complexity appears to be O(n) based on the visible operations.\n\n**Best Practices**: The code follows standard ${language} conventions for readability and maintainability.`
    };
  } else {
    return {
      mode,
      language,
      content: `**Potential Issues Found (${language})**\n\n• **Line ~5**: Consider adding input validation to handle edge cases\n• **Line ~12**: Potential null reference - add null check before accessing properties\n• **Line ~18**: This loop could be optimized using built-in methods\n• **Line ~25**: Variable naming could be more descriptive\n• **Line ~32**: Missing error handling for async operations\n• **General**: Consider adding comments for complex logic sections\n\n**Recommendations:**\n1. Implement proper error handling\n2. Add input validation\n3. Consider edge cases (empty arrays, null values)\n4. Review variable scope for potential memory leaks`
    };
  }
};

export const mockSummarizeVideo = async (
  url: string,
  focus: 'overview' | 'concepts' | 'exam'
): Promise<VideoSummaryResult> => {
  await delay(1800);
  
  const focusContent = {
    overview: {
      summary: `This video lecture provides a comprehensive introduction to the topic. The presenter begins with foundational concepts and gradually builds complexity. The content is well-organized with clear transitions between sections, making it suitable for both beginners and those looking to refresh their knowledge.`,
      keyTakeaways: [
        'Understanding the fundamentals is crucial for advanced topics',
        'Practical examples help reinforce theoretical concepts',
        'Regular practice and review improve retention',
        'Connecting new knowledge to existing understanding aids learning',
        'Active participation enhances comprehension'
      ]
    },
    concepts: {
      summary: `The lecture focuses on key conceptual frameworks and their applications. Core theories are explained with supporting examples, and relationships between different concepts are clearly illustrated. The presenter emphasizes understanding "why" rather than just "what."`,
      keyTakeaways: [
        'Core concept: The foundational principle upon which others build',
        'Secondary concept: Extends the core with practical applications',
        'Relationship mapping: How concepts interconnect and influence each other',
        'Application framework: Translating theory into practice',
        'Common misconceptions addressed and clarified'
      ]
    },
    exam: {
      summary: `This lecture covers essential exam-oriented content with emphasis on commonly tested topics. Key formulas, definitions, and problem-solving strategies are highlighted. The presenter provides tips for effective exam preparation and time management.`,
      keyTakeaways: [
        '⭐ High-frequency exam topic: Understand this concept thoroughly',
        '📝 Key formula/definition to memorize',
        '⚠️ Common exam mistake to avoid',
        '💡 Problem-solving strategy for complex questions',
        '✅ Quick revision points for last-minute prep'
      ]
    }
  };
  
  return {
    ...focusContent[focus],
    duration: '~45 minutes'
  };
};
