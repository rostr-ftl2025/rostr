import { useState, Fragment } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { AlertCircle } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  position: string;
  kPercent: number;
  ip: number;
  era: number;
  grade?: number;
  analysis?: string;
}

export function GradingDisplayPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');
  const [kPercent, setKPercent] = useState('');
  const [ip, setIp] = useState('');
  const [era, setEra] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const calculatePitcherGrade = (kPercent: number, ip: number, era: number): number => {
    const grade = 150 * kPercent + 0.3 * ip - 10 * era;
    return Math.round(grade * 100) / 100;
  };

  const analyzePitcher = (name: string, kPercent: number, ip: number, era: number, grade: number): string => {
    const k = kPercent * 100;
    let tier = '';
    if (grade >= 80) tier = 'Elite';
    else if (grade >= 70) tier = 'Top';
    else if (grade >= 60) tier = 'Solid';
    else if (grade >= 45) tier = 'Replacement';
    else tier = 'Poor';

    const lines: string[] = [];

    if (k >= 32) lines.push(`• Carries your strikeout category with elite swing-and-miss skill (${k.toFixed(1)}% K rate).`);
    else if (k >= 28) lines.push(`• Provides strong strikeout output (${k.toFixed(1)}% K rate) and reliably boosts weekly totals.`);
    else if (k >= 24) lines.push(`• Offers steady strikeout support (${k.toFixed(1)}% K rate) without being overpowering.`);
    else if (k >= 20) lines.push(`• Strikeout production is modest (${k.toFixed(1)}% K rate), so pairing him with a high-K arm is beneficial.`);
    else lines.push(`• Low strikeout output (${k.toFixed(1)}% K rate) limits his fantasy ceiling.`);

    if (ip >= 170) lines.push(`• High-volume workload (${ip.toFixed(1)} IP) provides stability and contributes across all counting stats.`);
    else if (ip >= 130) lines.push(`• Moderate workload (${ip.toFixed(1)} IP) gives reliable usage without heavy innings demand.`);
    else lines.push(`• Light innings load (${ip.toFixed(1)} IP) lowers his week-to-week fantasy impact.`);

    if (era <= 2.5) lines.push(`• Limits damage exceptionally well (ERA ${era.toFixed(2)}), anchoring team ratios.`);
    else if (era <= 3.5) lines.push(`• Manages contact effectively (ERA ${era.toFixed(2)}), generally providing stable ratios.`);
    else if (era <= 4.25) lines.push(`• Inconsistent run prevention (ERA ${era.toFixed(2)}), making matchup selection important.`);
    else lines.push(`• High risk to ERA and WHIP (ERA ${era.toFixed(2)}), requiring careful matchup management.`);

    let profile = 'Balanced Profile';
    let recommendation = 'Contributes steadily without major strengths or weaknesses.';

    if (k >= 28 && ip >= 170 && era <= 3.0) {
      profile = 'Ace Workhorse';
      recommendation = 'Start every week without hesitation.';
    } else if (k >= 30 && ip < 130) {
      profile = 'Strikeout Specialist';
      recommendation = 'Great for boosting Ks, but may need innings support.';
    } else if (k < 22 && era < 3.25) {
      profile = 'Ratio Protector';
      recommendation = 'Strong ratios but limited upside in strikeouts.';
    } else if (k >= 28 && era >= 4.0) {
      profile = 'Volatile Strikeout Arm';
      recommendation = 'Useful for Ks but may hurt your ratios; stream based on matchups.';
    } else if (k < 20 && era < 3.5) {
      profile = 'Contact Manager';
      recommendation = 'Low strikeouts but provides solid ratio stability.';
    } else if (ip >= 160 && era >= 4.3) {
      profile = 'High-Volume Ratio Risk';
      recommendation = 'Provides innings but is likely harmful in ERA/WHIP.';
    }

    return `${tier} Tier:\n${lines.join('\n')}\nFantasy Recommendation: ${recommendation}`;
  };

  const addPlayer = () => {
    if (!playerName || !playerPosition || !kPercent || !ip || !era) return;

    const kPercentNum = parseFloat(kPercent) / 100;
    const ipNum = parseFloat(ip);
    const eraNum = parseFloat(era);

    const grade = calculatePitcherGrade(kPercentNum, ipNum, eraNum);
    const analysis = analyzePitcher(playerName, kPercentNum, ipNum, eraNum, grade);

    setPlayers([
      ...players,
      { id: Date.now().toString(), name: playerName, position: playerPosition, kPercent: kPercentNum, ip: ipNum, era: eraNum, grade, analysis }
    ]);

    setPlayerName('');
    setPlayerPosition('');
    setKPercent('');
    setIp('');
    setEra('');
    setShowResults(false);
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
    setShowResults(false);
  };

  const gradeRoster = () => {
    if (players.length > 0) setShowResults(true);
  };

  const getAverageGrade = (): string => {
    if (!players.length) return 'N/A';
    const sum = players.reduce((acc, p) => acc + (p.grade || 0), 0);
    return (sum / players.length).toFixed(1);
  };

  const getGradeColor = (grade: number): string => {
    if (grade >= 80) return 'text-green-600';
    if (grade >= 70) return 'text-blue-600';
    if (grade >= 60) return 'text-yellow-600';
    if (grade >= 45) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen py-20 font-sans">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="mb-4 text-5xl font-bold tracking-tight">Grade Your Pitchers</h1>
          <p className="text-xl text-muted-foreground">Enter pitcher stats to get detailed analysis with fantasy recommendations</p>
          <p className="text-base text-muted-foreground mt-2 italic">Formula: Grade = 150 × K% + 0.3 × IP − 10 × ERA</p>
        </div>

        {/* Input Section */}
        <Card className="border-2 mb-8 max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Add Pitchers to Your Roster</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="player-name">Pitcher Name</Label>
                <Input id="player-name" placeholder="e.g., Gerrit Cole" value={playerName} onChange={e => setPlayerName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select value={playerPosition} onValueChange={setPlayerPosition}>
                  <SelectTrigger id="position"><SelectValue placeholder="Select position" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SP">SP (Starting Pitcher)</SelectItem>
                    <SelectItem value="RP">RP (Relief Pitcher)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="k-percent">K% (Strikeout Percentage)</Label>
                <Input id="k-percent" type="number" step="0.1" placeholder="e.g., 28.5" value={kPercent} onChange={e => setKPercent(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ip">IP (Innings Pitched)</Label>
                <Input id="ip" type="number" step="0.1" placeholder="e.g., 180.0" value={ip} onChange={e => setIp(e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="era">ERA (Earned Run Average)</Label>
                <Input id="era" type="number" step="0.01" placeholder="e.g., 3.25" value={era} onChange={e => setEra(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={addPlayer} className="flex-1" size="lg">Add Pitcher</Button>
              {players.length > 0 && <Button onClick={gradeRoster} variant="secondary" size="lg">Analyze Roster ({players.length})</Button>}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {showResults && players.length > 0 && (
          <>
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border-2 border-primary/20">
                <p className="text-base text-muted-foreground mb-2 uppercase tracking-wider">Team Average Grade</p>
                <p className="text-6xl text-primary mb-2 font-bold">{getAverageGrade()}</p>
                <p className="text-sm text-muted-foreground">Based on {players.length} pitcher{players.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            {/* Pitchers Table */}
            <Card className="border-2 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Pitcher Grades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="py-3 px-4 font-semibold">Name</th>
                        <th className="py-3 px-4 font-semibold">Position</th>
                        <th className="py-3 px-4 text-right font-semibold">Grade</th>
                        <th className="py-3 px-4 text-right w-32 font-semibold">Analysis</th>
                        <th className="py-3 px-4 w-20"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((player, index) => (
                        <Fragment key={player.id}>
                          <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4">{player.name}</td>
                            <td className="py-3 px-4"><Badge variant="outline">{player.position}</Badge></td>
                            <td className={`py-3 px-4 text-right text-lg ${getGradeColor(player.grade || 0)} font-semibold`}>
                              {player.grade ?? 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {player.analysis ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                                  className="text-primary hover:text-primary"
                                >
                                  {expandedRow === index ? 'Hide' : 'View'}
                                </Button>
                              ) : <span className="text-muted-foreground">N/A</span>}
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removePlayer(player.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                          {expandedRow === index && player.analysis && (
                            <tr className="bg-muted/30">
                              <td colSpan={5} className="px-4 py-4">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                  <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                                    {player.analysis}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {players.length === 0 && (
          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">Add pitchers above to start grading your roster</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GradingDisplayPage;
