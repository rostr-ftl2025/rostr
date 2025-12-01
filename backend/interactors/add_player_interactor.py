from flask import jsonify
from ..database.data_access_interface import PlayerDataAccessInterface
from ..database.entities.player_entity import PlayerEntity
from pybaseball import pitching_stats
from ..services.pitcher_grading_service import PitcherGradingService


class AddPlayerInteractor:
    def __init__(self, player_data_access: PlayerDataAccessInterface):
        """
        player_data_access: implements PlayerDataAccessInterface
        """
        self.player_data_access = player_data_access


    def execute(self, team_id, player_name, mlbid, idfg, position):
        # Validate inputs
        if not player_name or not team_id or not position or not mlbid or not idfg:

            return jsonify({"error": "All fields are required"}), 400

        try:
            # Use the new method to fetch existing players on this team
            existing_players = self.player_data_access.list_by_team(team_id)

            # Consider a player duplicate if FanGraphs ID matches or names match case-insensitively
            name_lower = str(player_name).strip().lower()
            idfg_str = str(idfg).strip()

            already_on_team = any(
                (str(p.get("idfg")).strip() == idfg_str) or
                (str(p.get("player_name")).strip().lower() == name_lower)
                for p in existing_players
            )

            if already_on_team:
                return jsonify({"error": "Player already exists on this team"}), 409
            
            #Get the pitcher's stats
            data = pitching_stats(2025)
            player_data = data[data['Name'].str.lower() == player_name.lower()]

            if player_data.empty:
                return jsonify({"error": f"No stats found for {player_name}"}), 404
            
            strikeout_rate = float(player_data.iloc[0]['K%'])
            innings_pitched = float(player_data.iloc[0]['IP'])
            era = float(player_data.iloc[0]['ERA'])

            stats = {
                "K%": strikeout_rate,
                "IP": innings_pitched,
                "ERA": era
            }

            # Calculate grade
            grade = PitcherGradingService.calculate_pitcher_grade(stats)

            #Generate grade analysis
            analysis = PitcherGradingService.analyze_pitcher(stats, grade)

            # Create entity
            player_entity = PlayerEntity(
                team_id=team_id,
                player_name=player_name,
                mlbid=mlbid,
                idfg=idfg,
                position=position,
                grade = grade,
                analysis = analysis
            )

            # Use interface (SQL or other)
            created_player = self.player_data_access.create(player_entity)
            return jsonify(created_player), 201

        except Exception as e:
            return jsonify({"error": str(e)}), 400