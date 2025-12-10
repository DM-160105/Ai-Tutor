import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookOpen, Brain, Camera, User, Settings, LogOut, Menu, Home, Calculator, BookOpenCheck, Wrench } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeSelector } from "./ThemeSelector";
import Logo from "@/assets/logo.svg";

export const FloatingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = useMemo(() => [
    { name: "Tutor", href: "/tutor", icon: Home },
    { name: "Visual", href: "/visual-learning", icon: Camera },
    { name: "Books", href: "/book-recommendations", icon: BookOpenCheck },
    { name: "Tools", href: "/tools", icon: Wrench },
    { name: "Dashboard", href: "/dashboard", icon: Brain },
  ], []);

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

  // Get user initials
  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return names.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "glass-nav py-2" 
          : "bg-transparent py-4"
      )}
      style={{ willChange: "transform" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => handleNavigation('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <div className={cn(
              "w-10 h-10 liquid-glass rounded-xl flex items-center justify-center p-2 transition-all duration-200",
              isScrolled ? "shadow-lg" : ""
            )}>
              <img src={Logo} alt="AI Tutor" className="w-full h-full object-contain dark:invert" />
            </div>
            <span className="font-bold text-xl gradient-text hidden sm:block">
              AI Tutor
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className={cn(
            "hidden md:flex items-center gap-1 p-1.5 rounded-2xl transition-all duration-200",
            isScrolled ? "liquid-glass-light" : "bg-muted/40"
          )}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePage(item.href);
              return (
                <motion.div key={item.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.1 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "px-4 py-2 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                        : "hover:bg-background/60"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Button>
                </motion.div>
              );
            })}
          </nav>

          {/* User Menu & Theme */}
          <div className="flex items-center gap-2">
            <ThemeSelector />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                  <Button variant="ghost" size="icon" className="rounded-xl liquid-glass-light p-0 overflow-hidden">
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={getUserDisplayName()} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary text-sm font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-60 liquid-glass rounded-2xl border-border/50 p-2"
                sideOffset={8}
              >
                {/* User Info Header */}
                <div className="px-3 py-2.5 mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={getUserDisplayName()} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{getUserDisplayName()}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-border/50 my-1" />
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/profile')}
                  className="cursor-pointer rounded-xl py-2.5 px-3 focus:bg-background/60"
                >
                  <User className="w-4 h-4 mr-2.5" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleNavigation('/dashboard')}
                  className="cursor-pointer rounded-xl py-2.5 px-3 focus:bg-background/60"
                >
                  <Settings className="w-4 h-4 mr-2.5" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50 my-1" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive rounded-xl py-2.5 px-3 focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2.5" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
                  <Button variant="ghost" size="icon" className="md:hidden rounded-xl liquid-glass-light">
                    <Menu className="w-5 h-5" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] liquid-glass-strong border-l border-border/30 p-6">
                {/* Mobile User Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/30">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={getUserDisplayName()} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold text-lg">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{getUserDisplayName()}</p>
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActivePage(item.href);
                    return (
                      <motion.div key={item.name} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.1 }}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          onClick={() => handleNavigation(item.href)}
                          className={cn(
                            "w-full justify-start rounded-xl h-12",
                            isActive && "shadow-md shadow-primary/20"
                          )}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          {item.name}
                        </Button>
                      </motion.div>
                    );
                  })}
                  <div className="border-t border-border/40 pt-4 mt-4">
                    <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.1 }}>
                      <Button
                        variant="ghost"
                        onClick={() => handleNavigation('/profile')}
                        className="w-full justify-start rounded-xl h-12"
                      >
                        <User className="w-5 h-5 mr-3" />
                        Profile
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.1 }}>
                      <Button
                        variant="ghost"
                        onClick={handleSignOut}
                        className="w-full justify-start text-destructive rounded-xl h-12 hover:text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};