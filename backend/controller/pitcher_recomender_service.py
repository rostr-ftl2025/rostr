from pybaseball import pitching_stats
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler 
from sklearn.metrics.pairwise import cosine_similarity
import time


class PitcherRecommenderService:

    # Default (standard) weights
    BASE_WEIGHTS = {
        "pitching+": 0.30, # Overall Pitching performance (https://library.fangraphs.com/pitching/stuff-location-and-pitching-primer/)
        "stuff+": 0.25, # Overall Quality of pitches (https://library.fangraphs.com/pitching/stuff-location-and-pitching-primer/)
        "k-bb%": 0.20, # Strikeout minus Walk percentage
        "xfip-": -0.15, # Pure pitching effectiveness, FIP-Fielding Independent Pitching (lower is better)
        "barrel%": -0.10, # % of batted balls hit the ideal exit velocity/launch angle combination for a HR or OB play
        "hardhit%": -0.10, # % of batted balls with an exit velocity of 95+ mph
        "gb%": 0.05, # Ground Ball percentage
        "swstr%": 0.05, # Whiffs per pitch
        "wpa/li": 0.05 # Clutch performance metric (https://library.fangraphs.com/misc/wpa-li/)
    }

    # Additional user preference profiles
    PROFILES = {
        "standard": BASE_WEIGHTS,
        "strikeout": {
            "pitching+": 0.05,
            "stuff+": 0.40,      # key
            "k-bb%": 0.80,       # key
            "xfip-": -0.05,
            "barrel%": -0.03,
            "hardhit%": -0.03,
            "gb%": 0.02,
            "swstr%": 0.40,      # key
            "wpa/li": 0.02,
        },
        "control": {
            "pitching+": 0.10,
            "stuff+": 0.05,
            "k-bb%": 0.20,       # supporting
            "xfip-": -0.80,      # key negative stat
            "barrel%": -0.50,    # key negative stat
            "hardhit%": -0.50,   # key negative stat
            "gb%": 0.10,
            "swstr%": 0.05,
            "wpa/li": 0.10,
        },
        "groundball": {
            "pitching+": 0.05,
            "stuff+": 0.10,
            "k-bb%": 0.05,
            "xfip-": -0.05,
            "barrel%": -0.40,     # key
            "hardhit%": -0.40,    # key
            "gb%": 0.80,          # key
            "swstr%": 0.05,
            "wpa/li": 0.05,
        },
        "clutch": {
            "pitching+": 0.20,
            "stuff+": 0.10,
            "k-bb%": 0.10,
            "xfip-": -0.05,
            "barrel%": -0.05,
            "hardhit%": -0.05,
            "gb%": 0.05,
            "swstr%": 0.10,
            "wpa/li": 0.80,       # key
        },
        "sabermetrics": {
            "pitching+": 0.05,
            "stuff+": 0.10,
            "k-bb%": 0.40,       # key
            "xfip-": -0.80,      # key
            "barrel%": -0.05,
            "hardhit%": -0.05,
            "gb%": 0.02,
            "swstr%": 0.40,      # key
            "wpa/li": 0.02,
        },
    }

    EXPLANATIONS = {
        "standard": (
            "You selected the standard strategy, so the recommended lineup prioritizes a balanced mix of "
            "overall pitching quality, strikeout ability, contact management, and consistency. "
            "This approach highlights the best all-around performers on your roster."
        ),
        "strikeout": (
            "You selected the strikeout strategy, so the recommended lineup prioritizes pitchers with "
            "high K-BB%, strong Stuff+, and elite swinging-strike rates. "
            "This approach focuses on maximizing raw dominance and whiff potential."
        ),
        "control": (
            "You selected the control strategy, so the recommended lineup prioritizes pitchers who excel "
            "at limiting walks, suppressing hard contact, and producing strong run-prevention metrics such as xFIP-. "
            "This approach favors stability, reliability, and efficient innings."
        ),
        "groundball": (
            "You selected the groundball strategy, so the recommended lineup prioritizes pitchers with strong "
            "groundball rates, soft-contact profiles, and barrel suppression. "
            "This approach emphasizes inducing grounders and minimizing dangerous contact."
        ),
        "clutch": (
            "You selected the clutch strategy, so the recommended lineup prioritizes pitchers who perform well "
            "in high-leverage moments, supported by strong WPA/LI and reliable command. "
            "This approach highlights arms who excel under pressure and in tight matchups."
        ),
        "sabermetrics": (
            "You selected the sabermetrics strategy, so the recommended lineup prioritizes analytically efficient "
            "pitchers who excel in run-prevention metrics like xFIP-, while also valuing K-BB% and swinging-strike rate. "
            "This approach emphasizes sustainable, data-backed effectiveness."
        ),
    }


    @staticmethod
    def norm(df: pd.DataFrame, cols: list):
        """Normalize selected columns between 0 and 1."""
        scaler = MinMaxScaler()
        df[cols] = scaler.fit_transform(df[cols])
        return df
     
    @staticmethod
    def compute_weighted_stats(df: pd.DataFrame, weights: dict):
        """Compute a weighted score for each pitcher."""
        scores = np.zeros(len(df))
        for stat, weight in weights.items():
            vals = df[stat].values.copy()
            # For negatively weighted metrics (e.g., xfip-, barrel%), lower is better
            if weight < 0:
                vals = np.ones_like(vals, dtype=float) - vals
            scores += vals * abs(weight)
        return scores

    @staticmethod
    def recommend_starting_pitchers(team_pitchers: list[dict], top_n=5, profile="standard"):
        """
        Recommend the top N starting pitchers from the user's current roster.
        The weighting changes based on the selected fantasy manager profile.
        """

        # Choose profile weights
        weights = PitcherRecommenderService.PROFILES.get(profile, PitcherRecommenderService.BASE_WEIGHTS)

        # Convert to DataFrame
        df = pd.DataFrame(team_pitchers)
        features = list(weights.keys())

        # Ensure all metrics exist in the DataFrame
        for f in features:
            if f not in df.columns:
                df[f] = 0.0

        # Normalize within team
        df = PitcherRecommenderService.norm(df, features)

        # Compute weighted score using selected profile
        df["score"] = PitcherRecommenderService.compute_weighted_stats(df, weights)

        # Sort and rank
        df_sorted = df.sort_values(by="score", ascending=False).head(top_n)
        df_sorted["rank"] = range(1, len(df_sorted) + 1)

        #Get explanation
        explanation = PitcherRecommenderService.EXPLANATIONS.get(
            profile,
            PitcherRecommenderService.EXPLANATIONS["standard"]
        )

        return df_sorted[["rank", "name", "team", "score"]].reset_index(drop=True), explanation


'''
Alt implementation, works but not sure if faster than above, switch out if needed
from typing import List, Dict, Optional


class PitcherRecommenderServiceFast:
    def __init__(self, weights: Optional[Dict[str, float]] = None):
        # Your defaults (order preserved)
        self.WEIGHTS: Dict[str, float] = weights or {
            "pitching+": 0.30,
            "stuff+":    0.25,
            "k-bb%":     0.20,
            "xfip-":    -0.15,
            "barrel%":  -0.10,
            "hardhit%": -0.10,
            "gb%":       0.05,
            "swstr%":    0.05,
            "wpa/li":    0.05,
        }
        self.FEATURES = tuple(self.WEIGHTS.keys())

        # Precompute weight vectors/masks in float64 to mirror sklearn defaults
        w = np.array([self.WEIGHTS[f] for f in self.FEATURES], dtype=np.float64)
        self._pos_mask = (w > 0)
        self._neg_mask = (w < 0)
        self._w_pos = w[self._pos_mask]                  # positive weights as-is
        self._w_neg_abs = np.abs(w[self._neg_mask])      # absolute value for negative weights

        # Fallback if no neg/pos columns (edge cases)
        if self._w_pos.size == 0:
            self._w_pos = np.zeros((0,), dtype=np.float64)
        if self._w_neg_abs.size == 0:
            self._w_neg_abs = np.zeros((0,), dtype=np.float64)

        self._scaler = MinMaxScaler()  # identical to your original normalization

    def recommend_pitchers(self, current_team: List[Dict], candidates: List[Dict], top_n: int = 5, alpha:  float = 0.4):

        df_team = pd.DataFrame(current_team)
        df_cand = pd.DataFrame(candidates)

        # Build full matrix in the same column order you used
        full = pd.concat([df_team, df_cand], ignore_index=True)
        X = full.loc[:, self.FEATURES].to_numpy(dtype=np.float64, copy=False)

        # --- EXACT normalization parity (sklearn MinMaxScaler) ---
        X01 = self._scaler.fit_transform(X)

        n_team = len(df_team)
        F = len(self.FEATURES)
        X_team01 = X01[:n_team] if n_team else np.empty((0, F), dtype=np.float64)
        X_cand01 = X01[n_team:]

        # --- EXACT base score math (no constants; same as your loop) ---
        # sum_{pos} w_pos * x + sum_{neg} |w_neg| * (1 - x)
        # vectorized split to match the loop behavior precisely
        base = np.zeros(X_cand01.shape[0], dtype=np.float64)
        if self._w_pos.size:
            base += X_cand01[:, self._pos_mask] @ self._w_pos
        if self._w_neg_abs.size:
            base += (1.0 - X_cand01[:, self._neg_mask]) @ self._w_neg_abs

        # --- EXACT cosine penalty parity (sklearn cosine_similarity) ---
        if X_team01.size == 0:
            penalty = np.zeros(X_cand01.shape[0], dtype=np.float64)
        else:
            sim_matrix = cosine_similarity(X_cand01, X_team01)  # same routine as before
            max_sim = sim_matrix.max(axis=1)
            penalty = -alpha * max_sim

        final = base + penalty

        out = df_cand.copy()
        out["base_score"]  = base
        out["final_score"] = final
        return out.sort_values("final_score", ascending=False).head(top_n).reset_index(drop=True)

'''

# Delete after done testing
current_team = [
    {"name": "Gerrit Cole", "team": "NYY", "pitching+": 110, "stuff+": 105, "k-bb%": 26, "xfip-": 80, "barrel%": 5.5, "hardhit%": 32, "gb%": 44, "swstr%": 15, "wpa/li": 2.1},
    {"name": "Framber Valdez", "team": "HOU", "pitching+": 102, "stuff+": 95, "k-bb%": 18, "xfip-": 90, "barrel%": 4.5, "hardhit%": 30, "gb%": 66, "swstr%": 12, "wpa/li": 1.5},
    {"name": "Tyler Glasnow", "team": "LAD", "pitching+": 115, "stuff+": 112, "k-bb%": 29, "xfip-": 72, "barrel%": 6.0, "hardhit%": 29, "gb%": 38, "swstr%": 17, "wpa/li": 2.8},
    {"name": "Marcus Stroman", "team": "NYY", "pitching+": 101, "stuff+": 90, "k-bb%": 15, "xfip-": 88, "barrel%": 4.2, "hardhit%": 28, "gb%": 57, "swstr%": 10, "wpa/li": 1.2},
    {"name": "Logan Webb", "team": "SF", "pitching+": 108, "stuff+": 100, "k-bb%": 21, "xfip-": 83, "barrel%": 4.8, "hardhit%": 33, "gb%": 61, "swstr%": 13, "wpa/li": 1.9}
]

candidates = [
    {"name": "Tyler Glasnow", "team": "LAD", "pitching+": 115, "stuff+": 112, "k-bb%": 29, "xfip-": 72, "barrel%": 6.0, "hardhit%": 29, "gb%": 38, "swstr%": 17, "wpa/li": 2.8},
    {"name": "Marcus Stroman", "team": "NYY", "pitching+": 101, "stuff+": 90, "k-bb%": 15, "xfip-": 88, "barrel%": 4.2, "hardhit%": 28, "gb%": 57, "swstr%": 10, "wpa/li": 1.2},
    {"name": "Logan Webb", "team": "SF", "pitching+": 108, "stuff+": 100, "k-bb%": 21, "xfip-": 83, "barrel%": 4.8, "hardhit%": 33, "gb%": 61, "swstr%": 13, "wpa/li": 1.9}
]



#start_time = time.perf_counter()
#rec = PitcherRecommenderService()
#print(rec.recommend_pitchers(current_team, candidates, top_n=3))
#end_time = time.perf_counter()
#print(f"Execution time: {end_time - start_time:.6f} seconds")

rec = PitcherRecommenderService()
recommendations = rec.recommend_starting_pitchers(current_team)
# print(recommendations)