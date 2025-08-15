import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  BookOpen, 
  Camera, 
  Calculator, 
  Settings, 
  LogOut, 
  User, 
  Menu,
  BookOpenCheck,
  TrendingUp,
  Home 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeSelector } from "./ThemeSelector";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  onStartVisualLearning?: () => void;
}

export function Header({ onStartVisualLearning }: HeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const tools = [
    { 
      name: "Visual Learning", 
      href: "/visual-learning", 
      icon: Camera, 
      description: "Generate images and visual explanations" 
    },
    { 
      name: "Book Recommendations", 
      href: "/book-recommendations", 
      icon: BookOpenCheck, 
      description: "AI-curated reading suggestions" 
    },
    { 
      name: "Student Tools", 
      href: "/student-tools", 
      icon: TrendingUp, 
      description: "All learning resources in one place" 
    }
  ];

  return (
    <header className="w-full mb-8">
      <div className="flex items-center justify-between">
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center gap-3 hover-scale">
          <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl shadow-lg">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Tutor
            </h1>
            <p className="text-xs text-muted-foreground">Personalized Learning Assistant</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" className="hover-scale">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>

          {/* Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover-scale">
                <Calculator className="w-4 h-4 mr-2" />
                Tools
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-64 animate-scale-in">
              {tools.map((tool) => (
                <DropdownMenuItem key={tool.name} asChild className="cursor-pointer">
                  <Link to={tool.href} className="flex items-start gap-3 p-3">
                    <tool.icon className="w-4 h-4 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-xs text-muted-foreground">{tool.description}</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeSelector />

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover-scale">
                  <User className="w-4 h-4 mr-2" />
                  {user.user_metadata?.full_name || user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 animate-scale-in">
                <DropdownMenuItem disabled>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover-scale">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 animate-scale-in">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {tools.map((tool) => (
                <DropdownMenuItem key={tool.name} asChild className="cursor-pointer">
                  <Link to={tool.href} className="flex items-start gap-3 p-2">
                    <tool.icon className="w-4 h-4 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-xs text-muted-foreground">{tool.description}</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              
              <div className="p-2">
                <ThemeSelector />
              </div>
              
              {user && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    <User className="w-4 h-4 mr-2" />
                    {user.user_metadata?.full_name || user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}