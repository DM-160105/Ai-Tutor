// Real API for User/Profile using Supabase
import { supabase } from "@/integrations/supabase/client";

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

const getInitials = (name: string): string => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getUserProfile = async (): Promise<UserProfile> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Try to get profile from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const name = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const email = profile?.email || user.email || '';

  return {
    id: user.id,
    name,
    email,
    tagline: 'Student',
    role: 'AI Tutor Member',
    initials: getInitials(name),
    avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url
  };
};

export const updateUserProfile = async (
  updates: Partial<UserProfile>
): Promise<UserProfile> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Update in profiles table
  const { error } = await supabase
    .from('profiles')
    .upsert({
      user_id: user.id,
      full_name: updates.name,
      email: user.email,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    console.error('Profile update error:', error);
  }

  // Return updated profile
  return getUserProfile();
};

export const getUserStats = async (): Promise<UserStats> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Get queries count for this user
  const { count: queriesCount } = await supabase
    .from('queries')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get generated images count
  const { count: imagesCount } = await supabase
    .from('generated_images')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Calculate stats based on real data
  const totalQueries = queriesCount || 0;
  const totalImages = imagesCount || 0;
  
  // Estimate study hours (assume ~2 minutes per query interaction)
  const estimatedHours = Math.round((totalQueries * 2) / 60 * 10) / 10;

  return {
    totalStudyHours: estimatedHours,
    lessonsCompleted: totalImages, // Visual learning images generated
    quizzesAttempted: totalQueries, // Questions asked
    streakDays: totalQueries > 0 ? Math.min(Math.ceil(totalQueries / 3), 30) : 0 // Estimated streak
  };
};

export const getSavedNotes = async (): Promise<SavedNote[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Get recent queries as "notes"
  const { data: queries } = await supabase
    .from('queries')
    .select('id, question, subject, ai_response, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (!queries || queries.length === 0) {
    return [];
  }

  return queries.map(q => ({
    id: q.id,
    title: q.question?.slice(0, 50) + (q.question && q.question.length > 50 ? '...' : '') || 'Untitled',
    source: q.subject || 'General',
    createdAt: new Date(q.created_at || Date.now()),
    content: q.ai_response?.slice(0, 200) + (q.ai_response && q.ai_response.length > 200 ? '...' : '') || 'No response saved'
  }));
};

export const getDownloadHistory = async (): Promise<DownloadEntry[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  // Get generated images as download history
  const { data: images } = await supabase
    .from('generated_images')
    .select('id, topic, subject, created_at, image_url')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (!images || images.length === 0) {
    return [];
  }

  return images.map(img => ({
    id: img.id,
    fileName: `${img.topic.replace(/\s+/g, '-').toLowerCase()}-visual.png`,
    type: 'Image',
    fromTool: 'Visual Learning',
    date: new Date(img.created_at),
    size: '~500 KB'
  }));
};
