from flask import Blueprint, request, jsonify
from database.data_access_interface import TeamDataAccessInterface
from database.entities.team_entity import TeamEntity
from controller.pitcher_recomender_service import PitcherRecommenderService
from pybaseball import pitching_stats


class TeamController:
    def __init__(self, team_data_access: TeamDataAccessInterface):
        """
        team_data_access: An implementation of TeamDataAccessInterface (e.g., TeamDataAccess)
        """
        self.team_data_access = team_data_access
        self.bp = Blueprint("teams", __name__)

        # Register routes
        self.bp.add_url_rule("/api/create-team", view_func=self.create_team, methods=["POST"])
        self.bp.add_url_rule("/api/delete-team/<int:team_id>", view_func=self.delete_team, methods=["DELETE"])
        self.bp.add_url_rule("/api/team-search/<int:user_id>", view_func=self.get_user_teams, methods=["GET"])
        self.bp.add_url_rule("/api/teams/<int:team_id>/players", view_func=self.get_team_players, methods=["GET"])
        self.bp.add_url_rule("/api/teams/<int:team_id>/recommend-lineup", view_func=self.recommend_lineup, methods=["GET"])

    # ----------------------------------------------------
    # CREATE TEAM
    # ----------------------------------------------------
    def create_team(self):
        data = request.json or {}
        user_id = data.get("user_id")
        team_name = data.get("team_name")

        if not user_id or not team_name:
            return jsonify({"error": "user_id and team_name are required"}), 400

        try:
            # Create TeamEntity
            team_entity = TeamEntity(user_id=user_id, team_name=team_name)

            # Persist using data access interface
            created_team = self.team_data_access.create(team_entity)
            return jsonify(created_team), 201

        except Exception as e:
            return jsonify({"error": str(e)}), 400

    # ----------------------------------------------------
    # DELETE TEAM
    # ----------------------------------------------------
    def delete_team(self, team_id):
        if not team_id:
            return jsonify({"error": "Team ID required"}), 400

        try:
            deleted = self.team_data_access.delete(team_id)
            if not deleted:
                return jsonify({"error": "Team not found"}), 404
            return jsonify({"message": f"Deleted team '{team_id}'"}), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 400

    # ----------------------------------------------------
    # GET ALL TEAMS FOR USER
    # ----------------------------------------------------
    def get_user_teams(self, user_id):
        try:
            # In SQL data access, you can have a get_by_user() that filters by user_id
            results = self.team_data_access.read(user_id)

            # Map to frontend format
            teams = [
                {"team_id": r["id"], "team_name": r["team_name"]}
                for r in results
            ]
            return jsonify(teams), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # ----------------------------------------------------
    # GET PLAYERS IN TEAM
    # ----------------------------------------------------
    def get_team_players(self, team_id):
        try:
            players = self.team_data_access.get_all_players(team_id)

            result = [
                {
                    "player_name": p["player_name"],
                    "mlbid": p.get("mlbid"),
                    "idfg": p.get("idfg"),
                    "position": p.get("position"),
                    "grade": p.get("grade"),
                    "analysis": p.get("analysis")
                }
                for p in players
            ]
            return jsonify(result), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    # ----------------------------------------------------
    # RECOMMEND STARTING PITCHERS (LINEUP)
    # ----------------------------------------------------
    
    def recommend_lineup(self, team_id):
        try:
            # Get profile from query string (default to "standard")
            profile = request.args.get("profile", "standard")

            # Get all players on this team
            players = self.team_data_access.get_all_players(team_id)
            if not players:
                return jsonify({"error": "No players found for this team"}), 404

            # Fetch MLB pitching stats (2025)
            stats = pitching_stats(2025)
            stats.columns = [c.strip().lower() for c in stats.columns]

            #For each player, try to find matching MLB stat row
            enriched_pitchers = []
            for p in players:
                name = p.get("player_name")
                match = stats[stats["name"].str.contains(name, case=False, na=False)]
                if match.empty:
                    print(f"No stat match found for {name}")
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

            # Handle case where none were matched
            if not enriched_pitchers:
                return jsonify({"error": "No matching MLB stats found for team players"}), 404

            # Generate lineup recommendation using the selected profile
            recommendations = PitcherRecommenderService.recommend_starting_pitchers(enriched_pitchers, 5, profile)

            # Convert DataFrame to list of dicts with consistent key names
            records = recommendations.to_dict(orient="records")

            # Add 'position' and make sure keys are frontend-friendly
            formatted = [
                {
                    "rank": int(r["rank"]),
                    "name": r["name"],
                    "position": "SP",  # since all are pitchers
                    "score": round(float(r["score"]), 2),
                }
                for r in records
            ]

            return jsonify(formatted), 200

        except Exception as e:
            import traceback
            traceback.print_exc()
            return jsonify({"error": str(e)}), 500