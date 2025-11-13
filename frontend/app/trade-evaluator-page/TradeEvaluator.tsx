import React, { useEffect, useState } from "react"

export default function TradeEvaluator() {
  const [sideA, setSideA] = useState("")
  const [sideB, setSideB] = useState("")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Preload sideA from ?sideA=... in the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const prefill = params.get("sideA")
    if (prefill) setSideA(prefill)
  }, [])

  const handleEvaluate = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("http://localhost:5006/api/trade/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sideA: sideA.split(",").map(s => s.trim()),
          sideB: sideB.split(",").map(s => s.trim()),
        }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5DBD5] text-gray-900 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold">Trade Evaluator</h1>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Side A</label>
            <textarea
              value={sideA}
              onChange={e => setSideA(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-2"
              rows={4}
              placeholder="Gerrit Cole, Kevin Gausman"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Side B</label>
            <textarea
              value={sideB}
              onChange={e => setSideB(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-2"
              rows={4}
              placeholder="Zac Gallen, Logan Webb"
            />
          </div>
        </div>

        <button
          onClick={handleEvaluate}
          disabled={loading}
          className="rounded-xl bg-[#562424] text-white px-4 py-2 font-semibold hover:bg-[#734343]"
        >
          {loading ? "Analyzing..." : "Evaluate Trade"}
        </button>

        {error && <div className="text-red-600">{error}</div>}

        {result && (
          <div className="bg-white rounded-2xl shadow p-4 mt-6 space-y-2">
            <h2 className="text-xl font-bold">Trade Summary</h2>
            <p>Side A Total: {result.sideA.total_grade.toFixed(2)}</p>
            <p>Side B Total: {result.sideB.total_grade.toFixed(2)}</p>
            <p>Difference: {result.diff.toFixed(2)}</p>
            <p>Winner: {result.winner}</p>
            {result.suggestion && (
              <p className="text-sm text-gray-700">{result.suggestion}</p>
            )}
          </div>
        )}

        <a
          href="/team-maker"
          className="inline-block mt-4 text-[#562424] hover:underline font-semibold"
        >
          ← Back to Team Maker
        </a>
      </div>
    </div>
  )
}
