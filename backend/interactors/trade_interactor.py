# trade_interactor.py

from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import List, Optional, Dict, Any

import pandas as pd

from ..services.pitcher_grading_service import PitcherGradingService
from ..services.pitcher_recomender_service import PitcherRecommenderService


# ---------- Input / Output / Helper data models ---------- #

@dataclass
class TradeEvaluateInput:
    """
    Input Data for the trade evaluation use case.
    Built by the controller from the HTTP request body.
    """
    side_a: List[str]
    side_b: List[str]
    profile: str = "standard"


@dataclass
class GradedPlayer:
    player_name: str
    grade: float
    analysis: str


@dataclass
class TradeSideResult:
    players: List[GradedPlayer]
    total_grade: float


@dataclass
class TradeEvaluateOutput:
    """
    Output Data for the trade evaluation use case.
    Returned by the Interactor; the controller/presenter can convert it to JSON.
    """
    side_a: TradeSideResult
    side_b: TradeSideResult
    diff: float
    fairness_pct: float
    winner: str
    suggestion: Optional[str]
    profile: str
    profile_explanation: str

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert to the exact JSON shape your frontend already expects.
        """
        return {
            "sideA": {
                "players": [asdict(p) for p in self.side_a.players],
                "total_grade": self.side_a.total_grade,
            },
            "sideB": {
                "players": [asdict(p) for p in self.side_b.players],
                "total_grade": self.side_b.total_grade,
            },
            "diff": self.diff,
            "fairness_pct": self.fairness_pct,
            "winner": self.winner,
            "suggestion": self.suggestion,
            "profile": self.profile,
            "profile_explanation": self.profile_explanation,
        }


# ---------- Interactor (use case) ---------- #

class TradeInteractor:
    """
    Pure use case class.
    - No Flask/request/response
    - Just: TradeEvaluateInput -> business logic -> TradeEvaluateOutput
    """

    def __init__(self, season_df: Optional[pd.DataFrame], season: int = 2025):
        self.season_df = season_df
        self.season = season

    # --- internal helpers --- #

    def _find_stats_by_name(self, name: str) -> Optional[Dict[str, float]]:
        """Return {'K%': float0to1, 'IP': float, 'ERA': float} or None."""
        if self.season_df is None:
            return None

        df = self.season_df
        row = df[df["Name"].str.lower() == str(name).strip().lower()]
        if row.empty:
            return None

        return {
            "K%": float(row.iloc[0]["K%"]),
            "IP": float(row.iloc[0]["IP"]),
            "ERA": float(row.iloc[0]["ERA"]),
        }

    def _grade_player(self, name: str) -> GradedPlayer:
        """
        Compute grade from season stats using PitcherGradingService.
        """
        stats = self._find_stats_by_name(name)
        if stats is None:
            return GradedPlayer(
                player_name=name,
                grade=0.0,
                analysis=f"No {self.season} stats found for {name}.",
            )

        grade = PitcherGradingService.calculate_pitcher_grade(stats)
        analysis = PitcherGradingService.analyze_pitcher(stats, grade)
        return GradedPlayer(
            player_name=name,
            grade=grade,
            analysis=analysis,
        )

    def _grade_side(self, names: List[str]) -> TradeSideResult:
        players = [self._grade_player(n) for n in names]
        total = round(sum(float(p.grade) for p in players), 2)
        return TradeSideResult(players=players, total_grade=total)

    # --- main use case method --- #

    def execute(self, input_data: TradeEvaluateInput) -> TradeEvaluateOutput:
        """
        Core use case: evaluate a trade between side A and side B.
        """

        # 1) Grade both sides
        side_a_result = self._grade_side(input_data.side_a)
        side_b_result = self._grade_side(input_data.side_b)

        # 2) Compute diff and fairness
        diff = round(side_a_result.total_grade - side_b_result.total_grade, 2)
        denom = max(side_a_result.total_grade, side_b_result.total_grade, 1e-9)
        fairness_pct = round(100.0 * (1.0 - abs(diff) / denom), 1)

        # Positive diff means side A is sending more value away
        if side_a_result.total_grade > side_b_result.total_grade:
            winner = "Other Team"
        elif side_b_result.total_grade > side_a_result.total_grade:
            winner = "Your Team"
        else:
            winner = "Even"

        # 3) Suggest how to get to ~95% fairness
        target_diff = round((1.0 - 0.95) * denom, 2)  # allow 5% gap
        suggestion: Optional[str] = None
        if winner == "Other Team" and diff > target_diff:
            suggestion = (
                f"Other Team needs ~{abs(diff - target_diff):.2f} grade "
                f"to make this ~95% fair."
            )
        elif winner == "Your Team" and (-diff) > target_diff:
            suggestion = (
                f"Your Team needs ~{abs(diff + target_diff):.2f} grade "
                f"to make this ~95% fair."
            )

        # 4) Strategy / profile explanation
        profile = input_data.profile
        profile_explanation = PitcherRecommenderService.EXPLANATIONS.get(
            profile,
            PitcherRecommenderService.EXPLANATIONS["standard"],
        )

        # 5) Package Output Data
        return TradeEvaluateOutput(
            side_a=side_a_result,
            side_b=side_b_result,
            diff=diff,
            fairness_pct=fairness_pct,
            winner=winner,
            suggestion=suggestion,
            profile=profile,
            profile_explanation=profile_explanation,
        )
