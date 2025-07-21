import { Brain, Sparkles, LogOut, User, Camera, Settings, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ThemeSelector } from "./ThemeSelector";

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
    <div className="text-center mb-6 md:mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 md:gap-2">
          <Brain className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent drop-shadow-lg">
            AI Tutor
          </h1>
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-secondary" />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onStartVisualLearning}
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden lg:inline">Visual Learning</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex items-center gap-2"
            >
              <Link to="/dashboard">
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">Dashboard</span>
              </Link>
            </Button>
          </div>

          <ThemeSelector />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-primary/20 hover:border-primary/40 transition-colors">
                <Avatar className="h-9 w-9">
                  <AvatarImage 
                    src={user?.user_metadata?.avatar_url} 
                    alt={user?.user_metadata?.full_name || user?.email || ''} 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold">
                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage 
                        src={user?.user_metadata?.avatar_url} 
                        alt={user?.user_metadata?.full_name || user?.email || ''} 
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold text-lg">
                        {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold leading-none">
                        {user?.user_metadata?.full_name || 'Welcome!'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="p-3 cursor-pointer">
                <Link to="/dashboard" className="flex items-center">
                  <User className="mr-3 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="p-3 cursor-pointer">
                <Link to="/visual-learning" className="flex items-center">
                  <Camera className="mr-3 h-4 w-4" />
                  <span>Visual Learning</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="p-3 cursor-pointer">
                <Link to="/book-recommendations" className="flex items-center">
                  <BookOpen className="mr-3 h-4 w-4" />
                  <span>Book Recommendations</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="p-3 cursor-pointer">
                <Link to="/student-tools" className="flex items-center">
                  <Brain className="mr-3 h-4 w-4" />
                  <span>Student Tools</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive p-3 cursor-pointer"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className="text-lg md:text-xl text-muted-foreground">
        Your personal AI-powered learning companion
      </p>
    </div>
  );
};