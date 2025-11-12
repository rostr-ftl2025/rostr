import { Card, CardContent } from './ui/card';
import { CheckCircle2, TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-28 border-b">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-8 text-5xl lg:text-6xl tracking-tight">
              Built by Baseball Fanatics
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're fantasy managers who got tired of losing to spreadsheet nerds.
              So we built the ultimate roster grading tool.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-28">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
            <div>
              <div className="inline-block mb-6 px-5 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                ⚾ Our Mission
              </div>
              <h2 className="mb-8 text-4xl tracking-tight">
                Stats That Make Sense
              </h2>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                We believe every fantasy manager deserves championship-level insights 
                without needing a PhD in sabermetrics.
              </p>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-muted-foreground text-lg">
                      Deep analysis of every position on your roster
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-muted-foreground text-lg">
                      Daily updates synced with live fantasy baseball performance from Yahoo Fantasy League
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-muted-foreground text-lg">
                      Trade and waiver recommendations you can trust
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative h-[450px] rounded-3xl overflow-hidden border-2 border-primary/10 shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1526497127495-3b388dc87620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNlYmFsbCUyMHRlYW18ZW58MXx8fHwxNzYyOTc1NDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Baseball team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Analyze */}
      <section className="py-28 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="mb-5 text-4xl tracking-tight">
              Every Angle Covered
            </h2>
            <p className="text-muted-foreground text-xl">
              We grade what matters most in fantasy baseball
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardContent className="pt-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl">Player Form</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Hot streaks, slumps, and season-long trends
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardContent className="pt-10">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="mb-3 text-xl">Position Depth</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Stack up against the competition at every spot
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardContent className="pt-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <BarChart3 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl">Category Splits</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Power, speed, average—know your strengths
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardContent className="pt-10">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                  <Zap className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="mb-3 text-xl">Health Watch</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track injury concerns before they hurt you
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-28">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-8 text-4xl tracking-tight">
              Designed by League Winners
            </h2>
            <p className="text-muted-foreground mb-6 text-xl leading-relaxed">
              We've won championships. We've made terrible trades. We've stayed up 
              until 3 AM debating waiver claims.
            </p>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Now we've built the tool we wish we'd had from day one. 
              Your wins are our wins.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}