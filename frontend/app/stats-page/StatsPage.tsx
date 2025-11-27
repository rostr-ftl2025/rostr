import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import {
  Gauge,
  Target,
  Zap,
  Activity,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  HeartPulse,
} from "lucide-react";

export function StatsPage() {
  return (
    <div className="flex flex-col text-[#070738]">
      {/* Hero */}
      <section className="relative py-32 lg:py-48 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="/images/bluejays.jpg"
            alt="Baseball stadium"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight mb-8">
            Baseball Stats, Explained.
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto opacity-90 italic">
            A simple guide to the numbers you&apos;ll see in Rostr and on every player card.
          </p>
        </div>
      </section>

      {/* Why stats matter */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
            Why These Numbers Matter
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
            Every fantasy decision—who to start, who to bench, who to trade—comes down to
            stats. This page gives you plain-English explanations so you can look at a
            player’s line and instantly know if they&apos;re helping or hurting your team.
          </p>
        </div>
      </section>

    {/* Quick primer */}
    <section className="py-10 bg-slate-50">
  <div className="container mx-auto px-6 max-w-5xl">
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Reading a Typical Stat Line
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-base text-muted-foreground">

        <p className="text-lg text-muted-foreground leading-relaxed">
          On most sites you’ll see fantasy stat lines like:
        </p>

        <div className="mt-4 grid gap-4">
          {/* Pitcher example */}
          <div className="bg-slate-100 rounded-xl p-4 text-[#070738] shadow-sm">
            <span className="text-sm font-semibold uppercase tracking-wide opacity-70">
              Pitcher Line
            </span>
            <div className="mt-1 font-medium text-lg tracking-tight">
              IP <span className="font-mono">6.0</span> • ERA <span className="font-mono">3.25</span> • WHIP{" "}
              <span className="font-mono">1.08</span> • K <span className="font-mono">8</span>
            </div>
          </div>

          {/* Hitter example */}
          <div className="bg-slate-100 rounded-xl p-4 text-[#070738] shadow-sm">
            <span className="text-sm font-semibold uppercase tracking-wide opacity-70">
              Hitter Line
            </span>
            <div className="mt-1 font-medium text-lg tracking-tight">
              AVG <span className="font-mono">.280</span> • HR <span className="font-mono">25</span> • RBI{" "}
              <span className="font-mono">85</span> • SB <span className="font-mono">12</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          The sections below explain what each of these stats actually mean and how to use them in fantasy.
        </p>

      </CardContent>
    </Card>
  </div>
</section>


      {/* Pitching stats */}
      <section className="py-24 bg-[#070738] text-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-center">
            Pitching Stats (The Basics)
          </h2>
          <p className="text-center text-base lg:text-lg opacity-80 mb-12 max-w-3xl mx-auto">
            These are the main numbers you&apos;ll use to judge starting pitchers and relievers.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* ERA */}
            <Card className="border-2 bg-white/5 text-white hover:bg-white/10 transition-all">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                  <Gauge className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">ERA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm opacity-90">
                <p>
                  <span className="font-semibold">Earned Run Average</span>: Average runs
                  allowed per 9 innings.
                </p>
                <p>
                  <span className="font-semibold">Lower is better:</span> Around 3.00 is
                  strong, 4.00 is average, 5.00+ is bad.
                </p>
              </CardContent>
            </Card>

            {/* WHIP */}
            <Card className="border-2 bg-white/5 text-white hover:bg-white/10 transition-all">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                  <Target className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">WHIP</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm opacity-90">
                <p>
                  <span className="font-semibold">
                    Walks + Hits per Inning Pitched:
                  </span>{" "}
                  How many baserunners a pitcher allows.
                </p>
                <p>
                  <span className="font-semibold">Lower is better:</span> Under 1.10 is
                  excellent, ~1.30 is average.
                </p>
              </CardContent>
            </Card>

            {/* K% */}
            <Card className="border-2 bg-white/5 text-white hover:bg-white/10 transition-all">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                  <Zap className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">K%</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm opacity-90">
                <p>
                  <span className="font-semibold">Strikeout Rate</span>: Percentage of
                  batters the pitcher strikes out.
                </p>
                <p>
                  <span className="font-semibold">Higher is better:</span> 20–23% is
                  average, 28%+ is elite.
                </p>
              </CardContent>
            </Card>

            {/* BB% */}
            <Card className="border-2 bg-white/5 text-white hover:bg-white/10 transition-all">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                  <Activity className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">BB%</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm opacity-90">
                <p>
                  <span className="font-semibold">Walk Rate:</span> How often the pitcher
                  issues walks.
                </p>
                <p>
                  <span className="font-semibold">Lower is better:</span> Under 6% is
                  strong, 9%+ is shaky.
                </p>
              </CardContent>
            </Card>

            {/* IP */}
            <Card className="border-2 bg-white/5 text-white hover:bg-white/10 transition-all">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">IP</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm opacity-90">
                <p>
                  <span className="font-semibold">Innings Pitched:</span> Workload and
                  durability.
                </p>
                <p>
                  More IP means more strikeouts and more impact in most fantasy formats.
                </p>
              </CardContent>
            </Card>

            {/* FIP */}
            <Card className="border-2 bg-white/5 text-white hover:bg-white/10 transition-all">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">FIP</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm opacity-90">
                <p>
                  <span className="font-semibold">
                    Fielding Independent Pitching:
                  </span>{" "}
                  Focuses on Ks, walks, and homers.
                </p>
                <p>
                  Use it to see if a pitchers ERA is lucky or unlucky. Similar
                  scale to ERA.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hitting stats */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-center">
            Hitting Stats (The Basics)
          </h2>
          <p className="text-center text-base lg:text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            These are the core stats you&apos;ll see for hitters in most fantasy leagues.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* AVG */}
            <Card className="border-2">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <HeartPulse className="h-7 w-7 text-[#070738]" />
                </div>
                <CardTitle className="text-2xl">AVG</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold">Batting Average:</span> Hits divided by
                  at-bats (e.g. .280).
                </p>
                <p>
                  Around .260–.270 is solid, .300+ is excellent.
                </p>
              </CardContent>
            </Card>

            {/* OBP */}
            <Card className="border-2">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-[#070738]" />
                </div>
                <CardTitle className="text-2xl">OBP</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold">On-Base Percentage:</span> How often a
                  hitter reaches base (hits + walks + HBP).
                </p>
                <p>
                  .320–.340 is decent, .360+ is very good.
                </p>
              </CardContent>
            </Card>

            {/* SLG / OPS */}
            <Card className="border-2">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <ArrowUpRight className="h-7 w-7 text-[#070738]" />
                </div>
                <CardTitle className="text-2xl">SLG & OPS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold">SLG</span> measures power (extra-base
                  hits), and <span className="font-semibold">OPS</span> is OBP + SLG.
                </p>
                <p>
                  OPS around .750 is solid, .850+ is strong, .900+ is star-level.
                </p>
              </CardContent>
            </Card>

            {/* HR / RBI */}
            <Card className="border-2">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <Zap className="h-7 w-7 text-[#070738]" />
                </div>
                <CardTitle className="text-2xl">HR & RBI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold">HR</span> = home runs.{" "}
                  <span className="font-semibold">RBI</span> = runs batted in.
                </p>
                <p>
                  Power hitters might reach 25–35 HR with 80–100+ RBI in a full season.
                </p>
              </CardContent>
            </Card>

            {/* Runs & SB */}
            <Card className="border-2">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <Activity className="h-7 w-7 text-[#070738]" />
                </div>
                <CardTitle className="text-2xl">R & SB</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold">R</span> = runs scored.{" "}
                  <span className="font-semibold">SB</span> = stolen bases.
                </p>
                <p>
                  SB specialists might get 25–40 steals but less power. Balanced players
                  give you some of both.
                </p>
              </CardContent>
            </Card>

            {/* Fantasy Tip */}
            <Card className="border-2">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <BarChart3 className="h-7 w-7 text-[#070738]" />
                </div>
                <CardTitle className="text-2xl">How To Use This</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Don&apos;t obsess over one number. Look at{" "}
                  <span className="font-semibold">skill stats</span> (OBP, SLG, K%, BB%)
                  and{" "}
                  <span className="font-semibold">fantasy stats</span> (HR, R, RBI, SB)
                  together.
                </p>
                <p>
                  Rostr uses these to power your grades, trade scores, and recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 bg-[#070738] text-white">
        <div className="container mx-auto text-right">
          <button
            onClick={() => (window.location.href = "/")}
            className="hover:opacity-80 transition-opacity text-4xl font-extrabold"
          >
            Rostr.
          </button>
        </div>
      </footer>
    </div>
  );
}
