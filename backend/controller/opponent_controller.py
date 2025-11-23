from flask import Blueprint, request, jsonify
from ..database.data_access_interface import TeamDataAccessInterface
from .pitcher_grading_service import PitcherGradingService
from .pitcher_recomender_service import PitcherRecommenderService
from pybaseball import pitching_stats


class OpponentController:
    def __init__(self, team_data_access: TeamDataAccessInterface):
        """
        Controller for opponent team operations
        """
        self.team_data_access = team_data_access
        self.bp = Blueprint("opponent", __name__)

        # Register routes
        self.bp.add_url_rule("/api/opponent/<int:opponent_team_id>/weaknesses", 
                            view_func=self.get_opponent_weaknesses, 
                            methods=["GET"])
        self.bp.add_url_rule("/api/opponent/<int:opponent_team_id>/counter-lineup/<int:user_team_id>",
                            view_func=self.get_counter_lineup,
                            methods=["GET"])

    def get_opponent_weaknesses(self, opponent_team_id):
        """
        Analyze opponent team and return only their weaknesses
        """
        try:
            # Get all players on the opponent team
            players = self.team_data_access.get_all_players(opponent_team_id)
            if not players:
                return jsonify({"error": "No players found for opponent team"}), 404

            # Fetch MLB pitching stats (2025)
            stats = pitching_stats(2025)
            stats.columns = [c.strip().lower() for c in stats.columns]

            # Analyze each pitcher and extract weaknesses
            weaknesses_analysis = []
            total_grade = 0
            graded_count = 0

            for p in players:
                name = p.get("player_name")
                match = stats[stats["name"].str.contains(name, case=False, na=False)]
                
                if match.empty:
                    print(f"No stat match found for {name}")
                    continue

                row = match.iloc[0]
                
                # Calculate grade
                pitcher_stats = {
                    "K%": row.get("k%", 0),
                    "IP": row.get("ip", 0),
                    "ERA": row.get("era", 0)
                }
                
                grade = PitcherGradingService.calculate_pitcher_grade(pitcher_stats)
                total_grade += grade
                graded_count += 1
                
                # Get full analysis
                full_analysis = PitcherGradingService.analyze_pitcher(pitcher_stats, grade)
                
                # Extract only weaknesses from the analysis
                weaknesses = self._extract_weaknesses(full_analysis, pitcher_stats, grade)
                
                weaknesses_analysis.append({
                    "player_name": name,
                    "position": p.get("position", "SP"),
                    "grade": round(grade, 2),
                    "weaknesses": weaknesses
                })

            avg_grade = round(total_grade / graded_count, 2) if graded_count > 0 else 0

            return jsonify({
                "opponent_team_id": opponent_team_id,
                "average_grade": avg_grade,
                "pitchers": weaknesses_analysis
            }), 200

        except Exception as e:
            import traceback
            traceback.print_exc()
            return jsonify({"error": str(e)}), 500

    def _extract_weaknesses(self, full_analysis: str, stats: dict, grade: float) -> str:
        """
        Extract only weakness-related information from the full analysis
        """
        k = stats.get("K%", 0) * 100
        ip = stats.get("IP", 0)
        era = stats.get("ERA", 0)
        
        weaknesses = []
        
        # Determine tier for context
        if grade >= 80:
            tier = "Elite"
        elif grade >= 70:
            tier = "Top"
        elif grade >= 60:
            tier = "Solid"
        elif grade >= 45:
            tier = "Replacement"
        else:
            tier = "Poor"
        
        # Extract weaknesses based on stats
        if k < 20:
            weaknesses.append(f"• Low strikeout production ({k:.1f}% K rate) limits fantasy ceiling.")
        elif k < 24:
            weaknesses.append(f"• Modest strikeout output ({k:.1f}% K rate) - can be exploited with high-contact hitters.")
        
        if ip < 130:
            weaknesses.append(f"• Light innings load ({ip:.1f} IP) reduces overall fantasy impact.")
        
        if era > 4.25:
            weaknesses.append(f"• High ERA ({era:.2f}) indicates vulnerability to runs - aggressive hitting approach recommended.")
        elif era > 3.50:
            weaknesses.append(f"• Inconsistent run prevention (ERA {era:.2f}) - can be exploited in favorable matchups.")
        
        # Add strategic recommendations based on weaknesses
        if len(weaknesses) == 0:
            weaknesses.append(f"• {tier} tier pitcher with no major exploitable weaknesses - requires disciplined at-bats.")
        else:
            if era > 4.00:
                weaknesses.append("• Strategy: Focus on aggressive hitting to capitalize on poor run prevention.")
            if k < 22:
                weaknesses.append("• Strategy: Use contact-oriented hitters to exploit low strikeout rate.")
        
        return "\n".join(weaknesses)

    def get_counter_lineup(self, opponent_team_id, user_team_id):
        """
        Recommend a lineup from user's team that exploits opponent's weaknesses
        """
        try:
            # Get opponent weaknesses first
            opponent_players = self.team_data_access.get_all_players(opponent_team_id)
            if not opponent_players:
                return jsonify({"error": "No opponent players found"}), 404
            
            # Get user's team players
            user_players = self.team_data_access.get_all_players(user_team_id)
            if not user_players:
                return jsonify({"error": "No players found for your team"}), 404

            # Fetch MLB pitching stats
            stats = pitching_stats(2025)
            stats.columns = [c.strip().lower() for c in stats.columns]

            # Analyze opponent weaknesses
            opponent_analysis = self._analyze_opponent_weaknesses(opponent_players, stats)
            
            # Get profile from query string, default to strategy based on opponent weaknesses
            profile = request.args.get("profile")
            if not profile:
                profile = self._determine_counter_strategy(opponent_analysis)

            # Enrich user's pitchers with stats
            enriched_pitchers = []
            for p in user_players:
                name = p.get("player_name")
                match = stats[stats["name"].str.contains(name, case=False, na=False)]
                if match.empty:
                    continue

                row = match.iloc[0]
                enriched_pitchers.append({
                    "name": row["name"],
                    "team": row.get("team", "Unknown"),
                    "pitching+": row.get("pitching+", 100),
                    "stuff+": row.get("stuff+", 100),
                    "k-bb%": row.get("k-bb%", 0),
                    "xfip-": row.get("xfip-", 100),
                    "barrel%": row.get("barrel%", 0),
                    "hardhit%": row.get("hardhit%", 0),
                    "gb%": row.get("gb%", 0),
                    "swstr%": row.get("swstr%", 0),
                    "wpa/li": row.get("wpa/li", 0),
                })

            if not enriched_pitchers:
                return jsonify({"error": "No matching MLB stats found for your team"}), 404

            # Generate lineup recommendation
            df, explanation = PitcherRecommenderService.recommend_starting_pitchers(
                enriched_pitchers, 5, profile
            )

            records = df.to_dict(orient="records")
            formatted = [
                {
                    "rank": int(r["rank"]),
                    "name": r["name"],
                    "position": "SP",
                    "score": round(float(r["score"]), 2),
                }
                for r in records
            ]

            # Create enhanced explanation
            counter_explanation = (
                f"Counter-Strategy Analysis:\n\n"
                f"Opponent Weaknesses Identified:\n{opponent_analysis['summary']}\n\n"
                f"Recommended Strategy: {profile.upper()}\n\n"
                f"{explanation}\n\n"
                f"This lineup is optimized to exploit the opponent's vulnerabilities."
            )

            return jsonify({
                "lineup": formatted,
                "explanation": counter_explanation,
                "strategy": profile,
                "opponent_weaknesses": opponent_analysis
            }), 200

        except Exception as e:
            import traceback
            traceback.print_exc()
            return jsonify({"error": str(e)}), 500

    def _analyze_opponent_weaknesses(self, opponent_players, stats):
        """Analyze opponent team to identify collective weaknesses"""
        total_k = 0
        total_era = 0
        count = 0
        
        for p in opponent_players:
            name = p.get("player_name")
            match = stats[stats["name"].str.contains(name, case=False, na=False)]
            if match.empty:
                continue
                
            row = match.iloc[0]
            total_k += row.get("k%", 0) * 100
            total_era += row.get("era", 0)
            count += 1
        
        if count == 0:
            return {"summary": "Unable to analyze opponent", "avg_k": 0, "avg_era": 0}
        
        avg_k = total_k / count
        avg_era = total_era / count
        
        weaknesses = []
        if avg_k < 22:
            weaknesses.append(f"Low strikeout rate (avg {avg_k:.1f}% K)")
        if avg_era > 3.75:
            weaknesses.append(f"High ERA (avg {avg_era:.2f})")
        if not weaknesses:
            weaknesses.append("Well-rounded staff with no major weaknesses")
            
        return {
            "summary": " | ".join(weaknesses),
            "avg_k": round(avg_k, 1),
            "avg_era": round(avg_era, 2)
        }
    
    def _determine_counter_strategy(self, opponent_analysis):
        """Determine the best counter-strategy based on opponent weaknesses"""
        avg_k = opponent_analysis.get("avg_k", 25)
        avg_era = opponent_analysis.get("avg_era", 3.5)
        
        # If opponent has low K rate, use strikeout strategy
        if avg_k < 22:
            return "strikeout"
        # If opponent has high ERA, use control/sabermetrics
        elif avg_era > 4.0:
            return "sabermetrics"
        # Otherwise use standard
        else:
            return "standard"
