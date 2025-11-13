import { useState } from 'react';
import { HomePage } from "~/components/home-page";
import { AboutPage } from "~/components/about-page";
import { AuthPage } from "~/components/auth-page";
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} />}
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'auth' && <AuthPage />}
    </div>
  );
}
