import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import StatCard from "@/components/profile/StatCard";
import NotesList from "@/components/profile/NotesList";
import DownloadsTable from "@/components/profile/DownloadsTable";
import { ArrowLeft, Edit2, Save, Loader2, Clock, BookOpen, Award, Flame, LogOut, Bell } from "lucide-react";
import { getUserProfile, updateUserProfile, getUserStats, getSavedNotes, getDownloadHistory, UserProfile, UserStats, SavedNote, DownloadEntry } from "@/api/userApi";
import { toast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [notes, setNotes] = useState<SavedNote[]>([]);
  const [downloads, setDownloads] = useState<DownloadEntry[]>([]);
  
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTagline, setEditTagline] = useState('');
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingDownloads, setLoadingDownloads] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, statsData, notesData, downloadsData] = await Promise.all([
          getUserProfile(),
          getUserStats(),
          getSavedNotes(),
          getDownloadHistory()
        ]);
        
        setProfile(profileData);
        setEditName(profileData.name);
        setEditTagline(profileData.tagline);
        setLoadingProfile(false);
        
        setStats(statsData);
        setLoadingStats(false);
        
        setNotes(notesData);
        setLoadingNotes(false);
        
        setDownloads(downloadsData);
        setLoadingDownloads(false);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };

    if (user) fetchData();
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updated = await updateUserProfile({ name: editName, tagline: editTagline });
      setProfile(updated);
      setEditing(false);
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/tutor')} className="hover-scale">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Settings */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mb-4">
                  {loadingProfile ? '...' : profile?.initials}
                </div>
                
                {editing ? (
                  <div className="w-full space-y-3">
                    <Input 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your name"
                    />
                    <Input 
                      value={editTagline}
                      onChange={(e) => setEditTagline(e.target.value)}
                      placeholder="Your tagline"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => setEditing(false)} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={saving} className="flex-1 hover-scale">
                        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{profile?.name || 'Loading...'}</h2>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                    <p className="text-sm text-muted-foreground">{profile?.tagline}</p>
                    <span className="inline-block mt-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {profile?.role}
                    </span>
                    <Button onClick={() => setEditing(true)} variant="outline" className="mt-4 hover-scale">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌙</span>
                    <Label>Dark Mode</Label>
                  </div>
                  <Switch 
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'default')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    <Label>Email Notifications</Label>
                  </div>
                  <Switch 
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <Button 
                  variant="outline" 
                  className="w-full text-destructive hover:text-destructive hover-scale"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Stats, Notes, Downloads */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Stats */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Learning Overview</h3>
              {loadingStats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="animate-pulse bg-muted rounded-xl h-24" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard 
                    value={stats?.totalStudyHours || 0} 
                    label="Study Hours"
                    icon={<Clock className="w-5 h-5" />}
                  />
                  <StatCard 
                    value={stats?.lessonsCompleted || 0} 
                    label="Lessons"
                    icon={<BookOpen className="w-5 h-5" />}
                  />
                  <StatCard 
                    value={stats?.quizzesAttempted || 0} 
                    label="Quizzes"
                    icon={<Award className="w-5 h-5" />}
                  />
                  <StatCard 
                    value={`${stats?.streakDays || 0} 🔥`} 
                    label="Day Streak"
                    icon={<Flame className="w-5 h-5" />}
                  />
                </div>
              )}
            </div>

            {/* Saved Notes */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Saved Notes</h3>
              <NotesList notes={notes} loading={loadingNotes} />
            </div>

            {/* Download History */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Download History</h3>
              <DownloadsTable downloads={downloads} loading={loadingDownloads} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
