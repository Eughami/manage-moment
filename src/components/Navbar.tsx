import { useLocation, Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Projects', path: '/' },
  { label: 'Beneficiaries', path: '/beneficiaries' },
  { label: 'Experts', path: '/experts' },
  { label: 'Users', path: '/users' },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { logout } = useAuth();
  const isProjectDetail = location.pathname.startsWith('/project/');
  const isLoginPage = location.pathname === '/login';
  
  if (isLoginPage || isProjectDetail) {
    return null;
  }

  const handleSignout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const NavContent = () => (
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "transition-colors hover:text-foreground/80 w-full md:w-auto text-center",
            location.pathname === item.path
              ? "text-foreground font-semibold border-b-2 border-primary"
              : "text-foreground/60"
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">Project Hub</Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-4">
                <NavContent />
                <div className="flex items-center justify-between mt-4">
                  <Link to="/profile" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span>Profile</span>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleSignout}
                    title="Sign out"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Project Hub</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <NavContent />
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center">
            <Link to="/profile" className="mr-4">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSignout}
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
