import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import StatCard from "@/components/profile/StatCard";
import NotesList from "@/components/profile/NotesList";
import DownloadsTable from "@/components/profile/DownloadsTable";
import { ArrowLeft, Edit2, Save, Loader2, Clock, BookOpen, Award, Flame, LogOut, Bell, Moon, Sun } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 rounded-full bg-gradient-to-br from-primary/15 to-accent/10 orb-glow"
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-56 h-56 rounded-full bg-gradient-to-tr from-accent/12 to-primary/8 orb-glow"
          animate={{ y: [0, 15, 0], scale: [1, 0.95, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
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
          <h1 className="text-3xl font-bold">Profile</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Settings */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Profile Card */}
            <div className="liquid-glass rounded-3xl p-6">
              <div className="flex flex-col items-center text-center">
                <motion.div 
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-2xl font-bold mb-4 shadow-lg shadow-primary/20"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {loadingProfile ? '...' : profile?.initials}
                </motion.div>
                
                {editing ? (
                  <div className="w-full space-y-3">
                    <Input 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your name"
                      className="rounded-xl"
                    />
                    <Input 
                      value={editTagline}
                      onChange={(e) => setEditTagline(e.target.value)}
                      placeholder="Your tagline"
                      className="rounded-xl"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => setEditing(false)} variant="outline" className="flex-1 rounded-xl">
                        Cancel
                      </Button>
                      <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button onClick={handleSaveProfile} disabled={saving} className="w-full rounded-xl btn-glow">
                          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{profile?.name || 'Loading...'}</h2>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                    <p className="text-sm text-muted-foreground">{profile?.tagline}</p>
                    <span className="inline-block mt-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
                      {profile?.role}
                    </span>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button onClick={() => setEditing(true)} variant="outline" className="mt-4 rounded-xl">
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </motion.div>
                  </>
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="liquid-glass rounded-3xl p-6">
              <h3 className="font-semibold mb-5">Account Settings</h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                    <Label className="font-medium">Dark Mode</Label>
                  </div>
                  <Switch 
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'default')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-primary" />
                    <Label className="font-medium">Email Notifications</Label>
                  </div>
                  <Switch 
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button 
                    variant="outline" 
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl h-11"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Stats, Notes, Downloads */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Learning Stats */}
            <div className="liquid-glass rounded-3xl p-6">
              <h3 className="font-semibold mb-5">Learning Overview</h3>
              {loadingStats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="animate-pulse bg-muted/50 rounded-2xl h-24" />
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
            <div className="liquid-glass rounded-3xl p-6">
              <h3 className="font-semibold mb-5">Saved Notes</h3>
              <NotesList notes={notes} loading={loadingNotes} />
            </div>

            {/* Download History */}
            <div className="liquid-glass rounded-3xl p-6">
              <h3 className="font-semibold mb-5">Download History</h3>
              <DownloadsTable downloads={downloads} loading={loadingDownloads} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
