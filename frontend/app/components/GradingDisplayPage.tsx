import React, { useEffect, useState, Fragment } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertCircle } from 'lucide-react';

interface Pitcher {
  player_name: string;
  position: string;
  grade?: number | string;
  analysis?: string;
}

export function GradingDisplayPage() {
  const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const teamId = search.get('teamId');

  const [pitchers, setPitchers] = useState<Pitcher[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setError('No team selected.');
      setLoading(false);
      return;
    }

    const fetchPitchers = async () => {
      try {
        const res = await fetch(`http://localhost:5006/api/teams/${teamId}/players`);
        if (!res.ok) throw new Error('Failed to fetch pitchers');
        const data = await res.json();
        setPitchers(data);
      } catch (e: any) {
        setError(e.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchPitchers();
  }, [teamId]);

  const getAverageGrade = (): string => {
    if (!pitchers.length) return 'N/A';
    const sum = pitchers.reduce((acc, p) => acc + (typeof p.grade === 'number' ? p.grade : 0), 0);
    return (sum / pitchers.length).toFixed(1);
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 80) return 'text-green-600';
    if (grade >= 70) return 'text-blue-600';
    if (grade >= 60) return 'text-yellow-600';
    if (grade >= 45) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5DBD5] text-gray-900">
        <p className="text-lg">Loading pitcher grades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5DBD5] text-gray-900">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p>{error}</p>
        <Button asChild className="mt-6">
          <a href="/">Back to Team Maker</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 font-sans bg-[#F5DBD5]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="mb-4 text-5xl font-bold tracking-tight">Pitcher Grades</h1>
          <p className="text-xl text-muted-foreground">
            <span className="font-semibold">Team Average Grade:</span>{' '}
            <span className="text-[#562424] font-bold">{getAverageGrade()}</span>
          </p>
        </div>

        <Card className="border-2 mb-8">
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Position</th>
                    <th className="py-3 px-4 text-right font-semibold">Grade</th>
                    <th className="py-3 px-4 text-right w-32 font-semibold">Analysis</th>
                  </tr>
                </thead>
                <tbody>
                  {pitchers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500">
                        No pitchers found for this team.
                      </td>
                    </tr>
                  ) : (
                    pitchers.map((p, index) => (
                      <Fragment key={index}>
                        <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">{p.player_name}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{p.position}</Badge>
                          </td>
                          <td className={`py-3 px-4 text-right text-lg font-semibold ${getGradeColor(Number(p.grade))}`}>
                            {p.grade ?? 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {p.analysis ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                                className="text-primary hover:text-primary"
                              >
                                {expandedRow === index ? 'Hide' : 'View'}
                              </Button>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </td>
                        </tr>
                        {expandedRow === index && p.analysis && (
                          <tr className="bg-muted/30">
                            <td colSpan={4} className="px-4 py-4">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                                  {p.analysis}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Scales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Pitcher Grade Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="py-2 px-3 font-semibold">Tier</th>
                    <th className="py-2 px-3 font-semibold">Grade Range</th>
                    <th className="py-2 px-3 font-semibold">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-2 px-3">Elite</td>
                    <td className="py-2 px-3">&gt; 80</td>
                    <td className="py-2 px-3">Must-start fantasy aces.</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-3">Top</td>
                    <td className="py-2 px-3">70–80</td>
                    <td className="py-2 px-3">Reliable, high-end starters.</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-3">Solid</td>
                    <td className="py-2 px-3">60–70</td>
                    <td className="py-2 px-3">Good, matchup-dependent starters.</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-3">Replacement</td>
                    <td className="py-2 px-3">45–60</td>
                    <td className="py-2 px-3">Streamers; risky ratios.</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Poor</td>
                    <td className="py-2 px-3">&lt; 45</td>
                    <td className="py-2 px-3">Hurts ERA/WHIP; avoid.</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Team Average Grade Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="py-2 px-3 font-semibold">Team Tier</th>
                    <th className="py-2 px-3 font-semibold">Avg Grade Range</th>
                    <th className="py-2 px-3 font-semibold">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-2 px-3">Excellent Team</td>
                    <td className="py-2 px-3">&gt; 75</td>
                    <td className="py-2 px-3">Elite pitching staff.</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-3">Very Good</td>
                    <td className="py-2 px-3">65–75</td>
                    <td className="py-2 px-3">Competitive every week.</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-3">Average</td>
                    <td className="py-2 px-3">55–65</td>
                    <td className="py-2 px-3">Solid but needs upgrades.</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Weak</td>
                    <td className="py-2 px-3">&lt; 55</td>
                    <td className="py-2 px-3">Below-average team.</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <Button asChild className="mt-8">
          <a href="/">Back to Team Maker</a>
        </Button>
      </div>
    </div>
  );
}

export default GradingDisplayPage;