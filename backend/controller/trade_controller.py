from flask import Blueprint, request, jsonify
from database.data_access_interface import PlayerDataAccessInterface
from controller.pitcher_grading_service import PitcherGradingService

# Optional: pull fresh stats when needed
from pybaseball import pitching_stats

class TradeController:
    def __init__(self, player_data_access: PlayerDataAccessInterface):
        self.player_data_access = player_data_access
        self.bp = Blueprint("trade", __name__)
        self.bp.add_url_rule("/api/trade/evaluate", view_func=self.evaluate_trade, methods=["POST"])

        # Cache season stats so we can produce analysis text consistently
        self.season = 2025
        self.season_df = pitching_stats(self.season)  # Name, K%, IP, ERA, ...

    def _find_stats_by_name(self, name: str):
        """Return {'K%': float0to1, 'IP': float, 'ERA': float} or None."""
        # pybaseball returns K% as 0.xx (fraction), not % integer; your service expects 0.xx too.
        df = self.season_df
        row = df[df["Name"].str.lower() == str(name).strip().lower()]
        if row.empty:
            return None
        return {
            "K%": float(row.iloc[0]["K%"]),
            "IP": float(row.iloc[0]["IP"]),
            "ERA": float(row.iloc[0]["ERA"]),
        }

    def _grade_player(self, name: str):
        """
        Try DB first (if grade stored). If absent, compute from season stats.
        Returns dict with player_name, position?, grade, analysis
        """
        # Try to locate by name in DB (optional—depends on DAO features)
        # If you have a direct get_by_name, use it; otherwise skip DB and compute from stats.
        stats = self._find_stats_by_name(name)
        if stats is None:
            return {"player_name": name, "grade": 0.0, "analysis": f"No 2025 stats found for {name}."}

        grade = PitcherGradingService.calculate_pitcher_grade(stats)
        analysis = PitcherGradingService.analyze_pitcher(stats, grade)
        return {
            "player_name": name,
            "grade": grade,
            "analysis": analysis,
        }

    def _grade_side(self, names: list[str]):
        players = [self._grade_player(n) for n in names]
        total = round(sum(float(p.get("grade", 0.0)) for p in players), 2)
        return players, total

    def evaluate_trade(self):
        """
        POST /api/trade/evaluate
        Body:
        {
          "sideA": ["Kevin Gausman", "Gerrit Cole"],
          "sideB": ["Zac Gallen"]
        }
        """
        body = request.get_json(silent=True) or {}
        sideA = body.get("sideA", [])
        sideB = body.get("sideB", [])
        if not isinstance(sideA, list) or not isinstance(sideB, list):
            return jsonify({"error": "sideA and sideB must be arrays of names"}), 400

        A_players, A_total = self._grade_side(sideA)
        B_players, B_total = self._grade_side(sideB)

        diff = round(A_total - B_total, 2)  # >0 means A is sending more value
        denom = max(A_total, B_total, 1e-9)
        fairness_pct = round(100.0 * (1.0 - abs(diff) / denom), 1)
        winner = "A" if A_total > B_total else ("B" if B_total > A_total else "Even")

        # Suggest a target to make it ~95% fair
        target_diff = round((1.0 - 0.95) * denom, 2)  # 5% gap allowed
        suggestion = None
        if winner == "A" and diff > target_diff:
            suggestion = f"Side B needs ~{abs(diff - target_diff):.2f} grade to make this ~95% fair."
        elif winner == "B" and (-diff) > target_diff:
            suggestion = f"Side A needs ~{abs(diff + target_diff):.2f} grade to make this ~95% fair."

        return jsonify({
            "sideA": {"players": A_players, "total_grade": A_total},
            "sideB": {"players": B_players, "total_grade": B_total},
            "diff": diff,
            "fairness_pct": fairness_pct,
            "winner": winner,
            "suggestion": suggestion
        }), 200
