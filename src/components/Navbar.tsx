
import { useLocation, Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const navItems = [
  { label: 'Projects', path: '/' },
  { label: 'Beneficiaries', path: '/beneficiaries' },
  { label: 'Experts', path: '/experts' },
  { label: 'Users', path: '/users' },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isProjectDetail = location.pathname.startsWith('/project/');
  
  if (isProjectDetail) {
    return null; // Hide navbar when inside a project
  }
  
  const handleSignout = () => {
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Project Hub</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  location.pathname === item.path
                    ? "text-foreground font-semibold border-b-2 border-primary"
                    : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
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
