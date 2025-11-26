import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart3, Users, Target, Zap } from 'lucide-react';
import type { Page } from '../routes/home';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import { AuthModal } from '~/sign-in-page/AuthModal';
import { getUserFromJWT } from '~/utils/getToken';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

export function HomePage({ onNavigate, onOpenAuth }: HomePageProps) {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [initialMode, setInitialMode] = useState<'signin' | 'signup'>('signin');
  const [userInfo, setUserInfo] = useState<{ username?: string; userID?: string } | null>(null);

  const handleNavigate = (page: Page) => {
    if (typeof onNavigate === 'function') {
      onNavigate(page);
    }
  };

  // Check JWT on page load (like SignInPage)
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const info = getUserFromJWT(token);
      setUserInfo(info);
      // If signed in, immediately redirect to team-maker
      if (typeof window !== 'undefined' && info?.userID) {
        window.location.href = '/team-maker';
      }
    }
  }, []);

  // If not authenticated, show modal
  // Otherwise, navigate to grading page (optionally with teamId)
  const handleGradeClick = (teamId?: number) => {
    const token = localStorage.getItem('jwtToken');
    const info = getUserFromJWT(token ?? '');
    if (info?.userID) {
      window.location.href = "/team-maker";
    } else {
      setInitialMode('signin');
      setShowAuthForm(true);
    }
  };

  // When the auth modal should be shown, render only the modal in a full-screen container
  if (showAuthForm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="w-full max-w-md">
          <AuthModal {...({ mode: initialMode, onClose: () => setShowAuthForm(false) } as any)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* What the user sees upon landing */}
      <section id="home" className="relative py-32 lg:py-48 overflow-hidden">

        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="/images/bluejays.jpg"
            alt="Blue Jays lineup"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="absolute inset-0 z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="mx-auto text-center text-white">
            <h1 className="mb-10 text-6xl lg:text-8xl tracking-tight leading-tight font-extrabold">
              Know Your Roster.<br />Own Your League.
            </h1>
            <p className="text-xl lg:text-2xl mb-13 mx-auto italic">
              Grade your roster. Optimize your lineup. Dominate your league.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center font-medium">
            <Button
              size="lg"
              className="w-60 text-xl px-6 h-16 rounded-full bg-[#070738] text-white hover:bg-[#111184] transition-all duration-200 cursor-pointer"
              onClick={() => {
                if (onOpenAuth) onOpenAuth('signup');
                else onNavigate('auth');
              }}
            >
              Start Grading
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-60 text-xl px-6 h-16 rounded-full border-2 border-white text-white transition-colors duration-200 ease-in-out hover:bg-gray-50 hover:text-[#070738] cursor-pointer"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              Learn More
            </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-28">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="relative h-[500px] rounded-3xl overflow-hidden border-2">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1601204585986-e59572e09444?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwYmFzZWJhbGwlMjBzdGF0c3xlbnwxfHx8fDE3NjI5NzYxODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Fantasy baseball stats"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-[#070738]">
              <h2 className="mb-8 text-6xl tracking-tight font-extrabold">Built for All</h2>
              <p className="text-2xl mb-9">
                Stop drowning in spreadsheets. We analyze thousands of data points 
                and serve you the insights you need—nothing more, nothing less.
              </p>
              <div className="space-y-4 text-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <p>Advanced pitcher grading and evaluation</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <Target className="h-6 w-6" />
                  </div>
                  <p>Optimized lineup strategies</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <Zap className="h-6 w-6" />
                  </div>
                  <p>Smart trade and waiver insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 bg-[#070738] text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="mb-6 text-6xl tracking-tight font-extrabold">Stats That Actually Matter</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Everything you need to dominate your league
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20">
            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Position Grades</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-base">
                  See exactly where you're crushing it and where you need help
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                  <Target className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Trade Targets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-base">
                  Know exactly who to trade for and who to deal away
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">League Intel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-base">
                  Grades tailored to your league's scoring and settings
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-xl group">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                  <Zap className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Real-Time Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-base">
                  Updated daily with the latest player performance data
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-28 bg-card">
        <div className="container mx-auto px-6 text-[#070738]">
          <div className="max-w-5xl mx-auto text-center mb-24">
            <h2 className="mb-6 text-6xl tracking-tight font-extrabold">From Roster to Results</h2>
            <p className="text-muted-foreground text-2xl">Three steps to your championship run</p>
          </div>
          <div className="grid md:grid-cols-3 gap-16">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-10 text-4xl shadow-xl font-extrabold">1</div>
              <h3 className="mb-5 text-3xl tracking-tight font-semibold">Load Your Lineup</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">Import your team or enter players manually</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-secondary text-primary-foreground flex items-center justify-center mx-auto mb-10 text-4xl shadow-xl font-extrabold">2</div>
              <h3 className="mb-5 text-3xl tracking-tight font-semibold">Get the Breakdown</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">See your grades and weaknesses instantly</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-10 text-4xl shadow-xl font-extrabold">3</div>
              <h3 className="mb-5 text-3xl tracking-tight font-semibold">Win Your League</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">Make moves that actually move the needle</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-15 bottom-0 bg-[#070738]">
        <div className="container mx-auto flex justify-end text-white py-5">
          <button
            onClick={() => window.location.reload()}
            className="flex hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="tracking-tight text-4xl font-extrabold">Rostr.</span>
          </button>
        </div>
      </footer>

    </div>
  );
}
