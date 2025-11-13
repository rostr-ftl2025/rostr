import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart3, Users, Target, Zap } from 'lucide-react';
import type { Page } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const handleNavigate = (page: Page) => {
    console.log('Navigating to:', page);
    if (typeof onNavigate === 'function') {
      onNavigate(page);
    } else {
      console.error('onNavigate is not a function:', onNavigate);
    }
  };

  return (
    <div className="flex flex-col" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Hero Section */}
      <section className="relative py-32 lg:py-48 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block mb-8 px-6 py-2.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              <span className="text-base">⚾ Fantasy Baseball Analytics</span>
            </div>
            <h1 className="mb-10 text-6xl lg:text-8xl tracking-tight leading-tight" style={{ fontWeight: 700 }}>
              Know Your Roster.<br />Own Your League.
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-14 max-w-3xl mx-auto leading-relaxed font-bold italic">
              Grade your roster. Optimize your lineup. Dominate your league.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button size="lg" className="text-lg px-12 h-16 rounded-full shadow-lg" onClick={() => handleNavigate('auth')}>
                Grade My Roster
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-12 h-16 rounded-full" onClick={() => handleNavigate('about')}>
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Image Feature Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="relative h-[500px] rounded-3xl overflow-hidden border-2 border-primary/10 shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1601204585986-e59572e09444?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwYmFzZWJhbGwlMjBzdGF0c3xlbnwxfHx8fDE3NjI5NzYxODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Fantasy baseball stats"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="mb-6 text-5xl tracking-tight" style={{ fontWeight: 700 }}>
                Stats That Actually Matter
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Stop drowning in spreadsheets. We analyze thousands of data points 
                and serve you the insights you need—nothing more, nothing less.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-lg">Position-by-position breakdowns</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-lg">Trade and waiver recommendations</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-lg">Real-time performance tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-20 border-y bg-card">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-3 gap-12 max-w-5xl mx-auto text-center">
            <div>
              <div className="text-6xl mb-3 text-primary tracking-tight" style={{ fontWeight: 700 }}>50K+</div>
              <div className="text-base text-muted-foreground uppercase tracking-wider">Managers</div>
            </div>
            <div>
              <div className="text-6xl mb-3 text-primary tracking-tight" style={{ fontWeight: 700 }}>&lt;10s</div>
              <div className="text-base text-muted-foreground uppercase tracking-wider">Analysis</div>
            </div>
            <div>
              <div className="text-6xl mb-3 text-primary tracking-tight" style={{ fontWeight: 700 }}>24/7</div>
              <div className="text-base text-muted-foreground uppercase tracking-wider">Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="mb-6 text-6xl tracking-tight" style={{ fontWeight: 700 }}>
              Built for the Diamond
            </h2>
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
                <CardTitle className="text-2xl" style={{ fontWeight: 600 }}>Position Grades</CardTitle>
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
                <CardTitle className="text-2xl" style={{ fontWeight: 600 }}>Trade Targets</CardTitle>
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
                <CardTitle className="text-2xl" style={{ fontWeight: 600 }}>League Intel</CardTitle>
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
                <CardTitle className="text-2xl" style={{ fontWeight: 600 }}>Real-Time Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-base">
                  Updated daily with the latest player performance data
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Image Feature */}
          <div className="max-w-5xl mx-auto">
            <div className="relative h-[400px] rounded-3xl overflow-hidden border-2 border-primary/10 shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1761189464901-ad97229f1d48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNlYmFsbCUyMHBsYXllciUyMGFjdGlvbnxlbnwxfHx8fDE3NjI5NzYxODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Baseball player in action"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-12 text-center">
                <h3 className="text-4xl mb-4 text-foreground tracking-tight" style={{ fontWeight: 700 }}>
                  Every Stat. Every Player. Every Day.
                </h3>
                <p className="text-xl text-foreground/80">
                  Stay ahead with insights that update as the season unfolds
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="mb-6 text-6xl tracking-tight" style={{ fontWeight: 700 }}>
                From Roster to Results
              </h2>
              <p className="text-muted-foreground text-xl">
                Three steps to your championship run
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-16">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-10 text-4xl shadow-xl" style={{ fontWeight: 700 }}>
                  1
                </div>
                <h3 className="mb-5 text-3xl tracking-tight" style={{ fontWeight: 600 }}>Load Your Lineup</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Import your team or enter players manually
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-secondary text-primary-foreground flex items-center justify-center mx-auto mb-10 text-4xl shadow-xl" style={{ fontWeight: 700 }}>
                  2
                </div>
                <h3 className="mb-5 text-3xl tracking-tight" style={{ fontWeight: 600 }}>Get the Breakdown</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  See your grades and weaknesses instantly
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-10 text-4xl shadow-xl" style={{ fontWeight: 700 }}>
                  3
                </div>
                <h3 className="mb-5 text-3xl tracking-tight" style={{ fontWeight: 600 }}>Win Your League</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Make moves that actually move the needle
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 rounded-3xl p-20 border-2 border-primary/20 shadow-2xl">
            <h2 className="mb-8 text-6xl tracking-tight leading-tight" style={{ fontWeight: 700 }}>
              Your Championship<br />Starts Here
            </h2>
            <p className="text-2xl text-muted-foreground mb-12 leading-relaxed">
              Stop guessing. Start winning.<br />Join 50,000+ managers using rostr.
            </p>
            <Button 
              size="lg" 
              className="text-xl px-14 h-20 rounded-full shadow-xl hover:shadow-2xl transition-shadow" 
              onClick={() => handleNavigate('auth')}
              style={{ fontWeight: 600 }}
            >
              Grade My Roster Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}