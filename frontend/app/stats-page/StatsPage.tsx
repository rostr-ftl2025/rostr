import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../components/ui/Card";
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
  Percent,
  Ruler,
  Timer,
  ArrowRight,
  BookOpen,
  Info,
  Crosshair,
  MapPin,
  Split,
  Scale,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MousePointerClick,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function StatsPage() {
  return (
    <div className="flex flex-col text-[#070738]">
      {/* Hero */}
      <div className="container mx-auto px-6 relative z-10 text-center mt-10">
        <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
          Baseball Stats.&nbsp;  Explained.
        </h1>
        <p className="text-xl lg:text-2xl max-w-3xl mx-auto opacity-90 italic">
          A simple guide to the numbers you&apos;ll see in Rostr and on every
          player card.
        </p>
      </div>

      {/* Table of contents / quick nav */}
      <section className="py-8 bg-slate-50 border-b">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <AnchorPill href="#why-stats">Why Stats Matter</AnchorPill>
            <AnchorPill href="#primer">Reading a Stat Line</AnchorPill>
            <AnchorPill href="#pitching-basics">Pitching Basics</AnchorPill>
            <AnchorPill href="#pitching-advanced">Advanced Pitching</AnchorPill>
            <AnchorPill href="#hitting-basics">Hitting Basics</AnchorPill>
            <AnchorPill href="#statcast">Statcast &amp; Quality</AnchorPill>
            <AnchorPill href="#context">Context (Park/Splits)</AnchorPill>
            <AnchorPill href="#quiz">Who Do I Start?</AnchorPill>
            <AnchorPill href="#plate-discipline">Plate Discipline</AnchorPill>
            <AnchorPill href="#fantasy-formats">Fantasy Formats</AnchorPill>
            <AnchorPill href="#glossary">Quick Glossary</AnchorPill>
          </div>
        </div>
      </section>

      {/* Why stats matter */}
      <section id="why-stats" className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
            Why These Numbers Matter
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-6">
            Every fantasy decision, who to start, who to bench, who to trade, 
            comes down to stats. This page gives you plain-English explanations
            so you can look at a player’s line and instantly know if they&apos;re
            helping or hurting your team.
          </p>
          <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
            Rostr uses these stats behind the scenes to generate grades,
            identify weaknesses, and suggest moves. The more you understand the
            numbers, the easier it is to trust (or challenge) what the model is
            telling you.
          </p>
        </div>
      </section>

      {/* Quick primer */}
      <section id="primer" className="py-10 bg-slate-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#070738]" />
                Reading a Typical Stat Line
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base text-muted-foreground">
              <p className="text-lg leading-relaxed">
                On most sites you’ll see fantasy stat lines like:
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {/* Pitcher example */}
                <div className="bg-slate-100 rounded-xl p-4 text-[#070738] shadow-sm">
                  <span className="text-sm font-semibold uppercase tracking-wide opacity-70">
                    Pitcher Line
                  </span>
                  <div className="mt-1 font-medium text-lg tracking-tight">
                    IP <span className="font-mono">6.0</span> • ERA{" "}
                    <span className="font-mono">3.25</span> • WHIP{" "}
                    <span className="font-mono">1.08</span> • K{" "}
                    <span className="font-mono">8</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This means:{" "}
                    <span className="font-semibold">
                      6 innings, 3.25 ERA pace, very few baserunners, 8 Ks
                    </span>
                    . That&apos;s usually a strong fantasy start.
                  </p>
                </div>

                {/* Hitter example */}
                <div className="bg-slate-100 rounded-xl p-4 text-[#070738] shadow-sm">
                  <span className="text-sm font-semibold uppercase tracking-wide opacity-70">
                    Hitter Line
                  </span>
                  <div className="mt-1 font-medium text-lg tracking-tight">
                    AVG <span className="font-mono">.280</span> • HR{" "}
                    <span className="font-mono">25</span> • RBI{" "}
                    <span className="font-mono">85</span> • SB{" "}
                    <span className="font-mono">12</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Solid batting average, good power, strong RBI total, plus
                    some steals.{" "}
                    <span className="font-semibold">
                      This is an all-around fantasy contributor.
                    </span>
                  </p>
                </div>
              </div>

              <p className="mt-4 text-lg leading-relaxed">
                The sections below explain what each of these stats actually
                mean and how to use them in fantasy lineups, trades, and
                waiver-wire decisions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pitching basics */}
      <section id="pitching-basics" className="py-24 bg-[#070738] text-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-center">
            Pitching Stats (The Basics)
          </h2>
          <p className="text-center text-base lg:text-lg opacity-80 mb-12 max-w-3xl mx-auto">
            These are the main numbers you&apos;ll use to judge starting pitchers
            and relievers. Most fantasy leagues use some mix of these categories.
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
                  <span className="font-semibold">Earned Run Average</span>: average
                  earned runs allowed per 9 innings.
                </p>
                <p>
                  <span className="font-semibold">Lower is better:</span> Around 3.00 is
                  strong, 4.00 is average, 5.00+ is rough.
                </p>
                <p className="text-xs opacity-75">
                  Use ERA for a quick snapshot of run prevention, but pair it with WHIP
                  and K% to see if it&apos;s sustainable.
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
                    Walks + Hits per Inning Pitched
                  </span>
                  : how many baserunners a pitcher allows.
                </p>
                <p>
                  <span className="font-semibold">Lower is better:</span> Under 1.10 is
                  excellent, around 1.30 is average.
                </p>
                <p className="text-xs opacity-75">
                  WHIP is less noisy than ERA. Pitchers with good WHIP but bad ERA are
                  often good buy-low targets.
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
                  <span className="font-semibold">Strikeout Rate</span>: percentage of
                  batters the pitcher strikes out.
                </p>
                <p>
                  <span className="font-semibold">Higher is better:</span> 20–23% is
                  average, 28%+ is elite.
                </p>
                <p className="text-xs opacity-75">
                  High K% pitchers are fantasy gold—they rack up strikeouts and are
                  more likely to dominate even in fewer innings.
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
                  <span className="font-semibold">Walk Rate</span>: how often the pitcher
                  issues walks.
                </p>
                <p>
                  <span className="font-semibold">Lower is better:</span> Under 6% is
                  strong, 9%+ is shaky.
                </p>
                <p className="text-xs opacity-75">
                  Pitchers with both high K% and low BB% are usually very safe fantasy
                  anchors.
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
                  <span className="font-semibold">Innings Pitched</span>: workload and
                  durability.
                </p>
                <p>
                  More IP means more strikeouts, more chances for wins, and a bigger
                  impact on your team&apos;s ratios.
                </p>
                <p className="text-xs opacity-75">
                  In points leagues, high-IP workhorses can outscore flashier,
                  inconsistent arms.
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
                  <span className="font-semibold">Fielding Independent Pitching</span>:
                  focuses on strikeouts, walks, and home runs allowed.
                </p>
                <p>
                  Use it to see if a pitcher&apos;s ERA is driven by luck or defense.
                  FIP on a similar scale to ERA.
                </p>
                <p className="text-xs opacity-75">
                  If ERA is 5.00 but FIP is 3.50, that pitcher may be a{" "}
                  <span className="font-semibold">great buy-low candidate</span>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced pitching section */}
      <section id="pitching-advanced" className="py-24 bg-slate-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-2">
                Advanced Pitching Stats &amp; Fantasy Context
              </h2>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                Once you&apos;re comfortable with ERA and WHIP, these stats help you dig
                deeper. They show{" "}
                <span className="font-semibold">how</span> a pitcher is getting
                results, by overpowering hitters, limiting walks, or keeping the ball in
                the park.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Rostr uses several of these under the hood when grading pitchers and
                recommending matchups, especially in the{" "}
                <span className="font-semibold">Starting Rotation</span> and{" "}
                <span className="font-semibold">Counter Lineup</span> tools.
              </p>
            </div>

            <div className="flex-1 grid md:grid-cols-2 gap-6">
              {/* K/9 */}
              <StatDetailCard
                icon={<Zap className="h-6 w-6 text-[#070738]" />}
                label="K/9"
                subtitle="Strikeouts per 9 innings"
                body1="How many strikeouts a pitcher averages every 9 innings."
                body2="Around 8–9 K/9 is solid, 10+ is dominant."
                fantasyTip="In leagues that count total Ks, K/9 helps you spot high-impact arms, even if they don't go deep into games."
              />
              {/* BB/9 */}
              <StatDetailCard
                icon={<Activity className="h-6 w-6 text-[#070738]" />}
                label="BB/9"
                subtitle="Walks per 9 innings"
                body1="How many walks a pitcher allows every 9 innings."
                body2="Lower is better; under 2.0 BB/9 is excellent."
                fantasyTip="High BB/9 can signal WHIP problems and blow-up starts. Be careful streaming wild pitchers."
              />
              {/* HR/9 */}
              <StatDetailCard
                icon={<Gauge className="h-6 w-6 text-[#070738]" />}
                label="HR/9"
                subtitle="Home runs allowed per 9"
                body1="How often a pitcher gives up home runs."
                body2="Low HR/9 is a sign they keep the ball in the park."
                fantasyTip="HR/9 matters a lot in hitter-friendly parks; avoid HR-prone pitchers in bad stadium matchups."
              />
              {/* QS */}
              <StatDetailCard
                icon={<Timer className="h-6 w-6 text-[#070738]" />}
                label="QS"
                subtitle="Quality Starts"
                body1="A start with 6+ IP and 3 or fewer earned runs."
                body2="Some leagues use QS instead of wins."
                fantasyTip="Target steady, 6+ inning starters in QS leagues, even if their team doesn&apos;t give them many wins."
              />
              {/* Saves */}
              <StatDetailCard
                icon={<Target className="h-6 w-6 text-[#070738]" />}
                label="SV"
                subtitle="Saves"
                body1="When a reliever finishes a close win under certain conditions."
                body2="Mostly tied to closers."
                fantasyTip="Closer roles can change quickly. Track who&apos;s actually getting save opportunities, not just who is 'the closer' on paper."
              />
              {/* Holds */}
              <StatDetailCard
                icon={<ArrowRight className="h-6 w-6 text-[#070738]" />}
                label="HLD"
                subtitle="Holds"
                body1="A stat for setup relievers who protect a lead before the closer."
                body2="Used in SV+HLD formats."
                fantasyTip="In holds leagues, elite setup men become fantasy-relevant, not just closers."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hitting basics */}
      <section id="hitting-basics" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-center">
            Hitting Stats (The Basics)
          </h2>
          <p className="text-center text-base lg:text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            These are the core stats you&apos;ll see for hitters in most fantasy
            leagues. They show batting skill, power, and how often a player
            scores or drives in runs.
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
                  <span className="font-semibold">Batting Average:</span> hits
                  divided by at-bats (e.g. .280).
                </p>
                <p>.260–.270 is solid, .300+ is excellent.</p>
                <p className="text-xs opacity-75">
                  Strong AVG stabilizes your team&apos;s ratios and lets you take
                  more risks on low-AVG power bats.
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
                  <span className="font-semibold">On-Base Percentage:</span> how
                  often a hitter reaches base (hits + walks + HBP).
                </p>
                <p>.320–.340 is decent, .360+ is very good.</p>
                <p className="text-xs opacity-75">
                  In OBP leagues, patient hitters get a huge boost compared to
                  free swingers.
                </p>
              </CardContent>
            </Card>

            {/* SLG / OPS */}
            <Card className="border-2">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <ArrowUpRight className="h-7 w-7 text-[#070738]" />
                </div>
                <CardTitle className="text-2xl">SLG &amp; OPS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold">SLG</span> measures power
                  (extra-base hits) and{" "}
                  <span className="font-semibold">OPS</span> is OBP + SLG.
                </p>
                <p>
                  OPS around .750 is solid, .850+ is strong, .900+ is
                  star-level.
                </p>
                <p className="text-xs opacity-75">
                  OPS is a good one-number snapshot of hitting talent when your
                  league doesn&apos;t track more advanced stats.
                </p>
              </CardContent>
            </Card>

            {/* HR / RBI */}
            <Card className="border-2">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <Zap className="h-7 w-7 text-[#070738]" />
                </div>
                <CardTitle className="text-2xl">HR &amp; RBI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold">HR</span> = home runs.{" "}
                  <span className="font-semibold">RBI</span> = runs batted in.
                </p>
                <p>
                  Power hitters might reach 25–35 HR with 80–100+ RBI in a full
                  season.
                </p>
                <p className="text-xs opacity-75">
                  Great power hitters might go through slumps, but they can win
                  you a week with a few huge games.
                </p>
              </CardContent>
            </Card>

            {/* Runs & SB */}
            <Card className="border-2">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <Activity className="h-7 w-7 text-[#070738]" />
                </div>
                <CardTitle className="text-2xl">R &amp; SB</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold">R</span> = runs scored.{" "}
                  <span className="font-semibold">SB</span> = stolen bases.
                </p>
                <p>
                  SB specialists might get 25–40 steals with less power. Balanced
                  players give you some of both.
                </p>
                <p className="text-xs opacity-75">
                  SB is often a scarce category. One good speedster can swing
                  weekly matchups.
                </p>
              </CardContent>
            </Card>

            {/* Tip card */}
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
                  <span className="font-semibold">skill stats</span> (OBP, SLG,
                  K%, BB%) and{" "}
                  <span className="font-semibold">fantasy stats</span> (HR, R,
                  RBI, SB) together.
                </p>
                <p>
                  Rostr combines these to power your grades, trade scores, and
                  lineup recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statcast Section */}
      <section id="statcast" className="py-24 bg-[#070738] text-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
              The Statcast Revolution
            </h2>
            <p className="text-xl opacity-80 max-w-3xl mx-auto leading-relaxed">
              In modern fantasy baseball, we don't just look at the result (Did
              he get a hit?). We look at the <em>process</em> (Did he crush the
              ball?). This data helps you find breakout stars before they get
              hot.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: The Concept */}
            <div className="space-y-8">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-2xl font-bold flex items-center gap-3 mb-4">
                  <Crosshair className="h-6 w-6 text-blue-400" />
                  Quality of Contact
                </h3>
                <p className="opacity-80 leading-relaxed mb-4">
                  If a batter hits the ball 110 mph, it's usually a hit, even if
                  it's caught right now. If a batter hits it 60 mph, it's
                  usually an out, even if it falls for a bloop single.
                </p>
                <p className="font-semibold text-blue-300">
                  Bet on the guy hitting the ball hard. The results will follow.
                </p>
              </div>

              <div className="grid gap-4">
                <StatcastRow
                  label="Exit Velocity (EV)"
                  value="95+ mph"
                  desc="How fast the ball leaves the bat. Harder hits = better results."
                />
                <StatcastRow
                  label="Launch Angle (LA)"
                  value="10° - 30°"
                  desc="The vertical angle. <10° is a grounder, >50° is a pop-up. The sweet spot is in the middle."
                />
                <StatcastRow
                  label="Hard Hit %"
                  value="40%+"
                  desc="The percentage of balls hit at 95 mph or harder."
                />
              </div>
            </div>

            {/* Right: The Barrel Card (UPDATED STYLING) */}
            <Card className="bg-white/5 border border-white/10 text-white">
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <Target className="h-8 w-8 text-yellow-400" />
                  The "Barrel"
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg font-medium opacity-90 leading-relaxed">
                  The holy grail of hitting metrics. A "Barrel" is a ball hit
                  with the perfect combination of <strong>Exit Velocity</strong>{" "}
                  and <strong>Launch Angle</strong>.
                </p>

                <div className="bg-black/30 rounded-xl p-5 backdrop-blur-sm border border-white/10">
                  <div className="flex justify-between items-center mb-2 text-sm uppercase tracking-widest opacity-70">
                    <span>The Formula</span>
                  </div>
                  <div className="text-2xl font-mono font-bold flex flex-col sm:flex-row gap-2 sm:items-center">
                    <span className="text-green-400">High Speed</span>
                    <span className="hidden sm:inline opacity-50">+</span>
                    <span className="text-yellow-400">Perfect Angle</span>
                    <span className="hidden sm:inline opacity-50">=</span>
                    <span className="text-white">Home Run</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm opacity-80">
                  <p>
                    <span className="font-bold text-white">Barrel %:</span> How
                    often a player barrels the ball per plate appearance.
                  </p>
                  <p>
                    <span className="font-bold text-white">Fantasy Tip:</span>{" "}
                    If a player has a high Barrel % but few Home Runs, trade for
                    him immediately. He is getting unlucky and the homers are
                    coming.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Context & Environment */}
      <section id="context" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#070738]">
                Context is Everything
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A 3.50 ERA is good. A 3.50 ERA while pitching half your games in
                Colorado is <em>incredible</em>. A .280 AVG is solid, but if he
                bats .150 against lefties, you can't start him every day.
              </p>
              <p className="text-base text-muted-foreground">
                Rostr adjusts for these factors, but knowing them helps you make
                smart daily lineup decisions.
              </p>

              <div className="grid gap-6 mt-8">
                <ContextCard
                  icon={<MapPin className="h-6 w-6 text-red-500" />}
                  title="Park Factors"
                  desc="Every stadium plays differently due to altitude, wall distance, and wind."
                  good="Great for Hitters: Coors Field (COL), Great American (CIN), Fenway (BOS)."
                  bad="Great for Pitchers: T-Mobile (SEA), Citi Field (NYM), Oracle (SF)."
                />
                <ContextCard
                  icon={<Split className="h-6 w-6 text-indigo-500" />}
                  title="Platoon Splits"
                  desc="Most hitters perform better against opposite-handed pitchers (Righty vs. Lefty)."
                  good="Platoon Advantage: Start your left-handed hitters when they face a right-handed pitcher."
                  bad="The 'Short Side': Avoid starting lefty hitters against elite lefty pitchers (like Chris Sale)."
                />
              </div>
            </div>

            {/* Visualizing wRC+ */}
            <div className="flex-1 w-full">
              <Card className="border-2 overflow-hidden w-full">
                <div className="bg-[#070738] p-6 text-white text-center">
                  <Scale className="h-10 w-10 mx-auto mb-3 text-emerald-400" />
                  <h3 className="text-2xl font-bold">The Great Equalizer: wRC+</h3>
                  <p className="text-sm opacity-80 mt-2">
                    Weighted Runs Created Plus
                  </p>
                </div>
                <CardContent className="p-8 space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    How do you compare a player from 1990 to today? Or a player
                    in Colorado to a player in Seattle? You use <strong>wRC+</strong>.
                  </p>
                  <p className="text-muted-foreground">
                    It takes all hitting stats, adjusts for park and league
                    averages, and puts it on a scale where <strong>100</strong> is
                    average.
                  </p>

                  <div className="space-y-3 pt-4">
                    <WRCScale value={160} label="MVP Level (Judge/Ohtani)" color="bg-purple-600" width="100%" />
                    <WRCScale value={140} label="All-Star" color="bg-blue-500" width="85%" />
                    <WRCScale value={115} label="Solid Regular" color="bg-green-500" width="60%" />
                    <WRCScale value={100} label="League Average" color="bg-gray-400" width="45%" />
                    <WRCScale value={70} label="Replacement Level" color="bg-red-400" width="20%" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quiz Section */}
      <section id="quiz" className="py-24 bg-white border-y border-slate-200">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-full mb-6">
            <HelpCircle className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-4xl font-extrabold mb-4 text-[#070738]">
            Pop Quiz: Who Do You Start?
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Test your knowledge. Based on the stats above, pick the player
            likely to perform better moving forward.
          </p>

          <div className="space-y-12 text-left">
            <QuizCard 
              scenario="Scenario 1: The Breakout Hitter"
              question="You need a power hitter for the rest of the season. Who do you add?"
              playerA={{
                name: "Player A",
                stats: "25 HR, .290 AVG, 5% Barrel Rate, .390 BABIP",
                isCorrect: false
              }}
              playerB={{
                name: "Player B",
                stats: "18 HR, .240 AVG, 15% Barrel Rate, .260 BABIP",
                isCorrect: true
              }}
              explanation="Player B is the better bet. Player A has a high BABIP (lucky) and low Barrel Rate (weak contact), suggesting regression. Player B is hitting the ball hard (high Barrel %) but has been unlucky (.260 BABIP)."
            />

            <QuizCard 
              scenario="Scenario 2: The Reliable Arm"
              question="You're looking for a pitcher to lower your ratios next week."
              playerA={{
                name: "Player A",
                stats: "2.50 ERA, 4.80 xFIP, 88% LOB%",
                isCorrect: false
              }}
              playerB={{
                name: "Player B",
                stats: "3.80 ERA, 3.40 xFIP, 70% LOB%",
                isCorrect: true
              }}
              explanation="Trust Player B. Player A has a shiny ERA, but his xFIP is terrible and his LOB% (Left on Base) is unsustainably lucky. He's a ticking time bomb. Player B's underlying metrics show he's actually pitching better than his ERA suggests."
            />
          </div>
        </div>
      </section>

      {/* Plate discipline & batted ball */}
      <section
        id="plate-discipline"
        className="py-24 bg-slate-50 border-t border-slate-200"
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-2">
                Plate Discipline &amp; Contact
              </h2>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                These stats explain <span className="font-semibold">why</span> a
                hitter&apos;s line looks the way it does. Are they crushing the
                ball but unlucky, or just getting fluky bloop hits?
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You&apos;ll see some of these mentioned in Rostr when we flag
                overperforming or underperforming players in trade or lineup
                suggestions.
              </p>
            </div>

            <div className="flex-1 grid md:grid-cols-2 gap-6">
              {/* BB% */}
              <StatDetailCard
                icon={<Percent className="h-6 w-6 text-[#070738]" />}
                label="BB%"
                subtitle="Walk rate"
                body1="Percentage of plate appearances that end in a walk."
                body2="Higher is better; patient hitters post strong OBP even without huge AVG."
                fantasyTip="High BB% boosts OBP and often signals trust in the hitter's batting order spot."
              />
              {/* K% */}
              <StatDetailCard
                icon={<Zap className="h-6 w-6 text-[#070738]" />}
                label="K%"
                subtitle="Strikeout rate"
                body1="Percentage of plate appearances that end in a strikeout."
                body2="Lower K% means more balls in play and usually a safer batting average."
                fantasyTip="Extreme K% hitters can be streaky; build a stable batting-average core first."
              />
              {/* ISO */}
              <StatDetailCard
                icon={<ArrowUpRight className="h-6 w-6 text-[#070738]" />}
                label="ISO"
                subtitle="Isolated Power"
                body1="Slugging percentage minus batting average."
                body2="Measures pure power; .140–.170 is average, .200+ is strong."
                fantasyTip="Useful to spot rising power bats before the HR totals explode."
              />
              {/* BABIP */}
              <StatDetailCard
                icon={<Ruler className="h-6 w-6 text-[#070738]" />}
                label="BABIP"
                subtitle="Batting Average on Balls in Play"
                body1="How often balls in play fall for hits."
                body2="Very high or low BABIP can signal luck."
                fantasyTip="If a hitter has a low AVG but normal plate skills and a tiny BABIP, they may be a buy-low candidate."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fantasy formats & category tips */}
      <section id="fantasy-formats" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-6 text-center">
            Putting It All Together in Fantasy
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto text-center mb-10">
            Different league formats care about different stats. Here&apos;s how
            to adjust your thinking in{" "}
            <span className="font-semibold">categories</span> vs.{" "}
            <span className="font-semibold">points</span> leagues.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Categories leagues */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-[#070738]" />
                  Categories Leagues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  You&apos;re trying to win{" "}
                  <span className="font-semibold">specific stats</span> (like
                  HR, R, RBI, SB, AVG / ERA, WHIP, K, SV, W, etc.).
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <span className="font-semibold">Hitters:</span> balance
                    power (HR, RBI) with speed (SB) and ratios (AVG/OBP).
                  </li>
                  <li>
                    <span className="font-semibold">Pitchers:</span> chase Ks
                    and wins, but protect ERA and WHIP.
                  </li>
                  <li>
                    Think in terms of{" "}
                    <span className="font-semibold">team needs</span>, not just
                    “best player overall.”
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Points leagues */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Activity className="h-6 w-6 text-[#070738]" />
                  Points Leagues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Players earn points for each event (1B, 2B, HR, BB, IP, K,
                  etc.) and lose points for others (K, ER, BB, etc.).
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <span className="font-semibold">Hitters:</span> OBP and
                    extra-base hits matter a lot; low-K, high-contact guys get a
                    boost.
                  </li>
                  <li>
                    <span className="font-semibold">Pitchers:</span> volume
                    matters. High-IP workhorses can outscore high-ERA aces.
                  </li>
                  <li>
                    Check your specific scoring rules and map them to the stats
                    here.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Glossary */}
      <section id="glossary" className="py-24 bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex items-center gap-2 mb-6">
            <Info className="h-5 w-5 text-[#070738]" />
            <h2 className="text-3xl lg:text-4xl font-extrabold">
              Quick Glossary
            </h2>
          </div>
          <p className="text-base lg:text-lg text-muted-foreground mb-8">
            A rapid-fire reference for the most common stats you&apos;ll see in
            Rostr:
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <GlossaryRow code="AVG" label="Batting Average" text="Hits ÷ at-bats." />
            <GlossaryRow code="OBP" label="On-Base %" text="How often a hitter reaches base." />
            <GlossaryRow code="SLG" label="Slugging %" text="Total bases ÷ at-bats." />
            <GlossaryRow code="OPS" label="On-base + Slugging" text="Quick snapshot of hitting talent." />
            <GlossaryRow code="HR" label="Home Runs" text="Over-the-fence hits." />
            <GlossaryRow code="RBI" label="Runs Batted In" text="Teammates driven in by a hitter." />
            <GlossaryRow code="R" label="Runs" text="Times a player scores." />
            <GlossaryRow code="SB" label="Stolen Bases" text="Extra bases taken on the pitcher/catcher." />
            <GlossaryRow code="ERA" label="Earned Run Avg" text="Runs allowed per 9 IP." />
            <GlossaryRow code="WHIP" label="Walks + Hits / IP" text="Baserunners allowed per inning." />
            <GlossaryRow code="K%" label="Strikeout Rate" text="% of batters or PAs that end in a K." />
            <GlossaryRow code="BB%" label="Walk Rate" text="% of batters or PAs that end in a walk." />
            <GlossaryRow code="K/9" label="Strikeouts per 9" text="How many Ks per 9 innings." />
            <GlossaryRow code="QS" label="Quality Start" text="6+ IP, 3 or fewer ER." />
            <GlossaryRow code="SV" label="Save" text="Closer preserves a lead at game&apos;s end." />
            <GlossaryRow code="HLD" label="Hold" text="Setup reliever preserves a lead before the closer." />
            <GlossaryRow code="wRC+" label="Weighted Runs Created+" text="Total offense adjusted for park/league. 100 is avg." />
            <GlossaryRow code="ISO" label="Isolated Power" text="Raw power metric (SLG - AVG)." />
            <GlossaryRow code="BABIP" label="Batting Avg on Balls In Play" text="Luck metric." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 bg-[#070738] text-white">
        <div className="container mx-auto flex items-center justify-between px-6">
          <p className="text-sm opacity-80 max-w-xl">
            This guide is meant as a quick reference while you&apos;re using
            Rostr. Keep it open in a tab, and flip back whenever you&apos;re unsure
            what a stat means.
          </p>
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

/* ---------- Helper Components ---------- */

type StatDetailCardProps = {
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  body1: string;
  body2: string;
  fantasyTip: string;
};

function StatDetailCard({
  icon,
  label,
  subtitle,
  body1,
  body2,
  fantasyTip,
}: StatDetailCardProps) {
  return (
    <Card className="border-2 bg-white">
      <CardHeader>
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
          {icon}
        </div>
        <CardTitle className="text-xl flex flex-col gap-1">
          <span>{label}</span>
          <span className="text-xs font-normal text-muted-foreground uppercase tracking-wide">
            {subtitle}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs sm:text-sm text-muted-foreground">
        <p>{body1}</p>
        <p>{body2}</p>
        <p className="pt-1 border-t text-[11px] sm:text-xs leading-snug">
          <span className="font-semibold">Fantasy tip:</span> {fantasyTip}
        </p>
      </CardContent>
    </Card>
  );
}

type GlossaryRowProps = {
  code: string;
  label: string;
  text: string;
};

function GlossaryRow({ code, label, text }: GlossaryRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-white p-3 border">
      <div className="px-2 py-1 rounded-md bg-slate-100 text-xs font-mono font-semibold text-[#070738]">
        {code}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">
          {label}
        </p>
        <p className="text-xs text-muted-foreground">
          {text}
        </p>
      </div>
    </div>
  );
}

type AnchorPillProps = {
  href: string;
  children: React.ReactNode;
};

function AnchorPill({ href, children }: AnchorPillProps) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1 rounded-full border bg-white px-4 py-1.5 text-xs font-medium text-[#070738] hover:bg-slate-100 transition-colors"
    >
      {children}
    </a>
  );
}

/* New Helpers for Statcast/Context/Quiz */

function StatcastRow({ label, value, desc }: { label: string, value: string, desc: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-lg">{label}</span>
          <span className="font-mono text-blue-300 font-semibold">{value}</span>
        </div>
        <p className="text-sm opacity-70 leading-snug">{desc}</p>
      </div>
    </div>
  )
}

function ContextCard({ icon, title, desc, good, bad }: { icon: any, title: string, desc: string, good: string, bad: string }) {
  return (
    <div className="bg-white p-5 rounded-xl border-2 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-slate-100 rounded-lg">{icon}</div>
        <h4 className="font-bold text-lg text-[#070738]">{title}</h4>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{desc}</p>
      <div className="space-y-2 text-xs">
        <div className="flex gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
          <span className="text-green-800 bg-green-50 px-2 py-0.5 rounded">{good}</span>
        </div>
        <div className="flex gap-2">
          <XCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span className="text-red-800 bg-red-50 px-2 py-0.5 rounded">{bad}</span>
        </div>
      </div>
    </div>
  )
}

function WRCScale({ value, label, color, width }: { value: number, label: string, color: string, width: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-8 font-mono font-bold text-right">{value}</span>
      <div className="flex-1 bg-slate-100 h-8 rounded-md overflow-hidden relative">
        <div className={`h-full ${color} flex items-center px-3 text-white text-xs font-bold whitespace-nowrap`} style={{ width }}>
          {label}
        </div>
      </div>
    </div>
  )
}

function QuizCard({ scenario, question, playerA, playerB, explanation }: any) {
  const [selected, setSelected] = useState<string | null>(null);
  const isSelected = selected !== null;

  return (
    <Card className="border-2 overflow-hidden transition-all duration-500">
      <CardHeader className="bg-slate-50 border-b">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          <MousePointerClick className="h-4 w-4" />
          {scenario}
        </div>
        <CardTitle className="text-xl text-[#070738]">{question}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2">
          <button 
            disabled={isSelected}
            onClick={() => setSelected('A')}
            className={`p-6 text-left transition-all border-b md:border-b-0 md:border-r hover:bg-slate-50 relative group
              ${selected === 'A' ? (playerA.isCorrect ? 'bg-green-50' : 'bg-red-50') : ''}
            `}
          >
            <div className="font-bold text-lg mb-2 group-hover:text-indigo-600 transition-colors">{playerA.name}</div>
            <div className="font-mono text-sm bg-slate-100 inline-block px-2 py-1 rounded text-slate-700">{playerA.stats}</div>
            {selected === 'A' && (
              <div className="absolute top-4 right-4">
                {playerA.isCorrect ? <CheckCircle2 className="text-green-600 h-6 w-6"/> : <XCircle className="text-red-600 h-6 w-6"/>}
              </div>
            )}
          </button>

          <button 
            disabled={isSelected}
            onClick={() => setSelected('B')}
            className={`p-6 text-left transition-all hover:bg-slate-50 relative group
              ${selected === 'B' ? (playerB.isCorrect ? 'bg-green-50' : 'bg-red-50') : ''}
            `}
          >
            <div className="font-bold text-lg mb-2 group-hover:text-indigo-600 transition-colors">{playerB.name}</div>
            <div className="font-mono text-sm bg-slate-100 inline-block px-2 py-1 rounded text-slate-700">{playerB.stats}</div>
            {selected === 'B' && (
              <div className="absolute top-4 right-4">
                {playerB.isCorrect ? <CheckCircle2 className="text-green-600 h-6 w-6"/> : <XCircle className="text-red-600 h-6 w-6"/>}
              </div>
            )}
          </button>
        </div>

        {isSelected && (
           <div className="p-6 bg-indigo-50 border-t animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex gap-3">
               <Info className="h-6 w-6 text-indigo-600 shrink-0 mt-0.5" />
               <div>
                 <h4 className="font-bold text-[#070738] mb-1">The Answer</h4>
                 <p className="text-sm text-slate-700 leading-relaxed">{explanation}</p>
               </div>
             </div>
           </div>
        )}
      </CardContent>
    </Card>
  )
}