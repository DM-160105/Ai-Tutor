import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookOpen, Brain, Camera, User, Settings, LogOut, Menu, Home, History, Calculator, BookOpenCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "./ThemeSelector";

export const FloatingHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader);
      return () => window.removeEventListener('scroll', controlHeader);
    }
  }, [lastScrollY]);

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Visual Learning", href: "/visual-learning", icon: Camera },
    { name: "Book Recommendations", href: "/book-recommendations", icon: BookOpenCheck },
    { name: "Student Tools", href: "/student-tools", icon: Calculator },
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
        "fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300",
        isVisible ? "translate-y-0" : "-translate-y-full",
        "animate-fade-in"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover-scale"
            onClick={() => handleNavigation('/')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Tutor
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant={isActivePage(item.href) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "hover-scale transition-all duration-200",
                    isActivePage(item.href) && "bg-primary text-primary-foreground shadow-glow"
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
                <Button variant="ghost" size="sm" className="hover-scale">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-sm border border-border/50">
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/dashboard')}
                  className="cursor-pointer hover-scale"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/dashboard')}
                  className="cursor-pointer hover-scale"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive hover-scale"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden hover-scale">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background/95 backdrop-blur-sm">
                <div className="flex flex-col gap-4 mt-8">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.name}
                        variant={isActivePage(item.href) ? "default" : "ghost"}
                        onClick={() => handleNavigation(item.href)}
                        className="w-full justify-start hover-scale"
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </Button>
                    );
                  })}
                  <div className="border-t border-border/50 pt-4">
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-start text-destructive hover-scale"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
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