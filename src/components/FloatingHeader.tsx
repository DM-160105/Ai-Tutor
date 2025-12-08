import { useState, useEffect } from "react";
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: "Tutor", href: "/tutor", icon: Home },
    { name: "Visual", href: "/visual-learning", icon: Camera },
    { name: "Books", href: "/book-recommendations", icon: BookOpenCheck },
    { name: "Tools", href: "/tools", icon: Wrench },
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
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "glass-nav py-2" 
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => handleNavigation('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={cn(
              "w-10 h-10 liquid-glass rounded-xl flex items-center justify-center p-2 transition-all duration-300",
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
            "hidden md:flex items-center gap-1 p-1.5 rounded-2xl transition-all duration-300",
            isScrolled ? "liquid-glass-light" : "bg-muted/40"
          )}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePage(item.href);
              return (
                <motion.div key={item.name} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "px-4 py-2 rounded-xl transition-all duration-300",
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="rounded-xl liquid-glass-light">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 liquid-glass rounded-2xl border-border/50 p-2"
                sideOffset={8}
              >
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
                <DropdownMenuSeparator className="bg-border/50 my-2" />
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="md:hidden rounded-xl liquid-glass-light">
                    <Menu className="w-5 h-5" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] liquid-glass-strong border-l border-border/30 p-6">
                <div className="flex flex-col gap-2 mt-8">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActivePage(item.href);
                    return (
                      <motion.div key={item.name} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
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
                    <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="ghost"
                        onClick={() => handleNavigation('/profile')}
                        className="w-full justify-start rounded-xl h-12"
                      >
                        <User className="w-5 h-5 mr-3" />
                        Profile
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
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
