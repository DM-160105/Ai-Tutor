import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookOpen, Brain, Camera, User, Settings, LogOut, Menu, Home, Calculator, BookOpenCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "./ThemeSelector";

export const FloatingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Visual", href: "/visual-learning", icon: Camera },
    { name: "Books", href: "/book-recommendations", icon: BookOpenCheck },
    { name: "Tools", href: "/student-tools", icon: Calculator },
    { name: "Dashboard", href: "/dashboard", icon: Brain },
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const isActivePage = (href: string) => {
    if (href === '/' && location.pathname === '/') return true;
    return location.pathname === href;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 smooth-transition",
        isScrolled 
          ? "bg-card/95 border-b border-border/50 shadow-lg" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover-scale"
            onClick={() => handleNavigation('/')}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl gradient-text hidden sm:block">
              AI Tutor
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-muted/50">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePage(item.href);
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "hover-scale px-4 rounded-xl smooth-transition",
                    isActive && "bg-primary text-primary-foreground shadow-md"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Button>
              );
            })}
          </nav>

          {/* User Menu & Theme */}
          <div className="flex items-center gap-2">
            <ThemeSelector />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover-scale rounded-xl">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-card border-border/50">
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/dashboard')}
                  className="cursor-pointer hover-scale rounded-lg"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/dashboard')}
                  className="cursor-pointer hover-scale rounded-lg"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive hover-scale rounded-lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden hover-scale rounded-xl">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] glass-card border-l border-border/50">
                <div className="flex flex-col gap-2 mt-8">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActivePage(item.href);
                    return (
                      <Button
                        key={item.name}
                        variant={isActive ? "default" : "ghost"}
                        onClick={() => handleNavigation(item.href)}
                        className="w-full justify-start hover-scale rounded-xl"
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {item.name}
                      </Button>
                    );
                  })}
                  <div className="border-t border-border/50 pt-4 mt-4">
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-start text-destructive hover-scale rounded-xl"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};