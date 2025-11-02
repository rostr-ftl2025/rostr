from pybaseball import pitching_stats
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

#df = pitching_stats(2025)

#columns = list([col.lower() for col in df.columns])

#print(df['Name'].values)

#print(df.head())
#print(columns)

class PitcherRecommenderService:
    WEIGHTS = {
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

    @staticmethod
    def norm(df: pd.DataFrame, cols: list):
        scaler = MinMaxScaler()
        df[cols] = scaler.fit_transform(df[cols])
        return df
    
    @staticmethod
    def compute_weighted_stats(df: pd.DataFrame):
        scores = np.zeros(len(df))
        for stat, weight in PitcherRecommenderService.WEIGHTS.items():
            vals = df[stat].values.copy()
            if weight < 0:
                vals = np.ones_like(vals, dtype=float) - vals
            scores += vals * abs(weight)
        return scores

    @staticmethod
    def diversity_penalty(df_candidates: pd.DataFrame, df_team: pd.DataFrame, alpha=0.4):
        features = list(PitcherRecommenderService.WEIGHTS.keys())
        sim_matrix = cosine_similarity(df_candidates[features], df_team[features])
        max_sim = sim_matrix.max(axis=1)
        penalty = -alpha * max_sim 
        return penalty

    @staticmethod
    def recommend_pitchers(current_team: list[dict], candidates: list[dict], top_n=5, alpha=0.4):
        df_team = pd.DataFrame(current_team)
        df_candidates = pd.DataFrame(candidates)
        features = list(PitcherRecommenderService.WEIGHTS.keys())
        full = pd.concat([df_team, df_candidates])
        full = PitcherRecommenderService.norm(full, features)
        df_team = full.iloc[:len(df_team)].reset_index(drop=True)
        df_candidates = full.iloc[len(df_team):].reset_index(drop=True)

        df_candidates["base_score"] = PitcherRecommenderService.compute_weighted_stats(df_candidates)

        penalty = PitcherRecommenderService.diversity_penalty(df_candidates, df_team, alpha)
        df_candidates["final_score"] = df_candidates["base_score"] + penalty

        print(df_candidates[["name", "base_score", "final_score"]])
        return df_candidates.sort_values(by="final_score", ascending=False).head(top_n)


current_team = [
    {"name": "Gerrit Cole", "team": "NYY", "pitching+": 110, "stuff+": 105, "k-bb%": 26, "xfip-": 80, "barrel%": 5.5, "hardhit%": 32, "gb%": 44, "swstr%": 15, "wpa/li": 2.1},
    {"name": "Framber Valdez", "team": "HOU", "pitching+": 102, "stuff+": 95, "k-bb%": 18, "xfip-": 90, "barrel%": 4.5, "hardhit%": 30, "gb%": 66, "swstr%": 12, "wpa/li": 1.5}
]

candidates = [
    {"name": "Tyler Glasnow", "team": "LAD", "pitching+": 115, "stuff+": 112, "k-bb%": 29, "xfip-": 72, "barrel%": 6.0, "hardhit%": 29, "gb%": 38, "swstr%": 17, "wpa/li": 2.8},
    {"name": "Marcus Stroman", "team": "NYY", "pitching+": 101, "stuff+": 90, "k-bb%": 15, "xfip-": 88, "barrel%": 4.2, "hardhit%": 28, "gb%": 57, "swstr%": 10, "wpa/li": 1.2},
    {"name": "Logan Webb", "team": "SF", "pitching+": 108, "stuff+": 100, "k-bb%": 21, "xfip-": 83, "barrel%": 4.8, "hardhit%": 33, "gb%": 61, "swstr%": 13, "wpa/li": 1.9}
]

rec = PitcherRecommenderService.recommend_pitchers(current_team, candidates, top_n=2)
print(rec[["name", "final_score"]])
