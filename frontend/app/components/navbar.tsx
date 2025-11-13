import { Button } from './ui/button';
import { Trophy } from 'lucide-react';
import type { Page } from '../App';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 hover:opacity-70 transition-opacity group"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <span className="text-2xl tracking-tight">Rostr.</span>
        </button>
        
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors ${
              currentPage === 'home' 
                ? 'text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`transition-colors ${
              currentPage === 'about' 
                ? 'text-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            About
          </button>
        </div>
      </div>
    </nav>
  );
}