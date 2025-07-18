import { Brain, Sparkles, LogOut, User, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface HeaderProps {
  onStartVisualLearning: () => void;
}

export const Header = ({ onStartVisualLearning }: HeaderProps) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-10 h-10 text-primary" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent drop-shadow-lg">
            AI Tutor
          </h1>
          <Sparkles className="w-10 h-10 text-secondary" />
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onStartVisualLearning}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Visual Learning
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary/10">
                    {user?.email ? getUserInitials(user.email) : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">
                  {user?.user_metadata?.full_name || user?.email}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/visual-learning" className="flex items-center">
                  <Camera className="mr-2 h-4 w-4" />
                  <span>Visual Learning</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className="text-xl text-muted-foreground">
        Your personal AI-powered learning companion
      </p>
    </div>
  );
};