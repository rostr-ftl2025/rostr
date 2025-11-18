import { useState } from 'react';
import { HomePage } from "~/homepage/home-page";
import { AuthModal } from "~/sign-in-page/AuthModal";
import { Navbar } from "~/components/navbar";
import type { Route } from "./+types/home";

export type Page = 'home' | 'about' | 'auth';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Rostr." },
    { name: "description", content: "Grade your roster. Optimize your lineup. Dominate your league." },
  ];
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setCurrentPage('auth');
  };

  // Navigate back to the home page and scroll to a section
  const goToHomeSection = (sectionId: 'about' | 'how-it-works') => {
    setCurrentPage('home');
    // Wait for Home to render then scroll
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={setCurrentPage} onOpenAuth={handleOpenAuth} />
      {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} onOpenAuth={handleOpenAuth} />}
      {currentPage === 'auth' && <AuthModal initialMode={authMode} onGoToHomeSection={goToHomeSection} onClose={() => setCurrentPage('home')} />}
    </div>
  );
}

// TODO:
// Update all text on landing page
