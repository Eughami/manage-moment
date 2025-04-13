
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Beneficiaries from './pages/Beneficiaries';
import Experts from './pages/Experts';
import Users from './pages/Users';
import Profile from './pages/Profile';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* <Route path="/" element={<Index />} /> */}
          <Route path="/" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
          <Route path="/experts" element={<Experts />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
