// Mock API for User/Profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tagline: string;
  role: string;
  initials: string;
  avatarUrl?: string;
}

export interface UserStats {
  totalStudyHours: number;
  lessonsCompleted: number;
  quizzesAttempted: number;
  streakDays: number;
}

export interface SavedNote {
  id: string;
  title: string;
  source: string;
  createdAt: Date;
  content: string;
}

export interface DownloadEntry {
  id: string;
  fileName: string;
  type: string;
  fromTool: string;
  date: Date;
  size: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getUserProfile = async (): Promise<UserProfile> => {
  await delay(500);
  return {
    id: '1',
    name: 'Devang Makwana',
    email: 'devang.makwana@example.com',
    tagline: 'Computer Engineering Student',
    role: 'AI Tutor Member',
    initials: 'DM'
  };
};

export const updateUserProfile = async (
  updates: Partial<UserProfile>
): Promise<UserProfile> => {
  await delay(800);
  return {
    id: '1',
    name: updates.name || 'Devang Makwana',
    email: 'devang.makwana@example.com',
    tagline: updates.tagline || 'Computer Engineering Student',
    role: 'AI Tutor Member',
    initials: updates.name ? updates.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'DM'
  };
};

export const getUserStats = async (): Promise<UserStats> => {
  await delay(600);
  return {
    totalStudyHours: 24.5,
    lessonsCompleted: 42,
    quizzesAttempted: 18,
    streakDays: 7
  };
};

export const getSavedNotes = async (): Promise<SavedNote[]> => {
  await delay(700);
  return [
    {
      id: '1',
      title: 'Machine Learning Fundamentals',
      source: 'PDF Summary',
      createdAt: new Date('2024-12-01'),
      content: 'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience. Key concepts include supervised learning, unsupervised learning, and reinforcement learning. This summary covers the mathematical foundations and practical applications.'
    },
    {
      id: '2',
      title: 'Data Structures Overview',
      source: 'File Question',
      createdAt: new Date('2024-12-03'),
      content: 'Arrays, linked lists, stacks, queues, trees, and graphs are fundamental data structures. Each has specific use cases and trade-offs in terms of time and space complexity. Understanding when to use each structure is key to efficient programming.'
    },
    {
      id: '3',
      title: 'React Hooks Explained',
      source: 'Code Explanation',
      createdAt: new Date('2024-12-05'),
      content: 'React Hooks like useState, useEffect, and useCallback allow functional components to manage state and side effects. They provide a more direct API to React concepts without the complexity of class components.'
    },
    {
      id: '4',
      title: 'Database Normalization',
      source: 'Video Summary',
      createdAt: new Date('2024-12-06'),
      content: 'Normalization is the process of organizing database tables to minimize redundancy. The main normal forms (1NF, 2NF, 3NF, BCNF) provide progressively stricter rules for table design.'
    },
    {
      id: '5',
      title: 'Algorithm Complexity',
      source: 'PDF Summary',
      createdAt: new Date('2024-12-07'),
      content: 'Big O notation describes algorithm efficiency. Common complexities include O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, and O(n²) quadratic. Choosing efficient algorithms is crucial for scalable applications.'
    }
  ];
};

export const getDownloadHistory = async (): Promise<DownloadEntry[]> => {
  await delay(600);
  return [
    {
      id: '1',
      fileName: 'ml-fundamentals-summary.txt',
      type: 'Text',
      fromTool: 'PDF Summary',
      date: new Date('2024-12-01'),
      size: '4.2 KB'
    },
    {
      id: '2',
      fileName: 'ds-questions-answers.txt',
      type: 'Text',
      fromTool: 'File Q&A',
      date: new Date('2024-12-03'),
      size: '2.8 KB'
    },
    {
      id: '3',
      fileName: 'react-hooks-analysis.txt',
      type: 'Text',
      fromTool: 'Code Explainer',
      date: new Date('2024-12-05'),
      size: '3.5 KB'
    },
    {
      id: '4',
      fileName: 'db-lecture-notes.txt',
      type: 'Text',
      fromTool: 'Video Summary',
      date: new Date('2024-12-06'),
      size: '5.1 KB'
    }
  ];
};
