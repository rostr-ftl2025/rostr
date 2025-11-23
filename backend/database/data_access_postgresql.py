from typing import List, Optional
from .database import Database
from .entities.user_entity import UserEntity
from .entities.team_entity import TeamEntity
from .entities.player_entity import PlayerEntity
from .data_access_interface import (
    UserDataAccessInterface,
    TeamDataAccessInterface,
    PlayerDataAccessInterface,
)


# -------------------------
# User SQL Implementation
# -------------------------
class UserDataAccess(UserDataAccessInterface):
    def __init__(self, db: Database):
        self.db = db

    def create(self, username: str, password: Optional[bytes] = None) -> UserEntity:
        query = """
        INSERT INTO users (username, password)
        VALUES (%s, %s)
        RETURNING username;
        """
        row = self.db.execute(query, (username, password), fetchone=True)
        if not row:
            raise Exception("Failed to create user")
        # Do not return secret; construct a UserEntity with password omitted
        return UserEntity(row.get("username") or username, None)

    def read(self, username: str) -> Optional[UserEntity]:
        query = "SELECT id, username, password, opponent_team_id FROM users WHERE username = %s;"
        row = self.db.execute(query, (username,), fetchone=True)
        if not row:
            return None
        user = UserEntity(row.get("username"), row.get("password"), row.get("id"))
        user.opponent_team_id = row.get("opponent_team_id")
        return user

    def update(self, username: str, password: Optional[bytes]) -> Optional[UserEntity]:
        query = """
        UPDATE users
        SET password = %s
        WHERE username = %s
        RETURNING username;
        """
        row = self.db.execute(query, (password, username), fetchone=True)
        if not row:
            return None
        return UserEntity(row.get("username"), None)

    def delete(self, username: str) -> Optional[UserEntity]:
        query = """
        DELETE FROM users
        WHERE username = %s
        RETURNING username;
        """
        row = self.db.execute(query, (username,), fetchone=True)
        if not row:
            return None
        return UserEntity(row.get("username"), None)

    def assign_opponent_team(self, username: str, opponent_team_id: int) -> Optional[UserEntity]:
        """Assign an opponent team to a user"""
        query = """
        UPDATE users
        SET opponent_team_id = %s
        WHERE username = %s
        RETURNING username, opponent_team_id;
        """
        row = self.db.execute(query, (opponent_team_id, username), fetchone=True)
        if not row:
            return None
        return UserEntity(row.get("username"), None)
    
    def get_opponent_team_id(self, username: str) -> Optional[int]:
        """Get the opponent team ID assigned to a user"""
        query = "SELECT opponent_team_id FROM users WHERE username = %s;"
        row = self.db.execute(query, (username,), fetchone=True)
        if not row:
            return None
        return row.get("opponent_team_id")


# -------------------------
# Team SQL Implementation
# -------------------------
class TeamDataAccess(TeamDataAccessInterface):
    def __init__(self, db: Database):
        self.db = db

    def create(self, team_entity: TeamEntity):
        query = """
        INSERT INTO teams (user_id, team_name)
        VALUES (%s, %s)
        RETURNING id, team_name, user_id;
        """
        result = self.db.execute(
            query,
            (team_entity.get_user_id(), team_entity.get_team_name()),
            fetchone=True,
        )
        return result

    """Get all user's teams"""
    def read(self, user_id: int):
        query = "SELECT * FROM teams WHERE user_id = %s;"
        results = self.db.execute(query, (user_id,), fetchall=True)
        return results

    def update(self, team_entity: TeamEntity):
        query = """
        UPDATE teams
        SET team_name = %s
        WHERE user_id = %s AND team_name = %s
        RETURNING id, team_name, user_id;
        """
        result = self.db.execute(
            query,
            (team_entity.get_team_name(), team_entity.get_user_id(), team_entity.get_team_name()),
            fetchone=True,
        )
        return result

    def delete(self, team_id: int):
        query = """
        DELETE FROM teams
        WHERE id = %s
        RETURNING id, team_name;
        """
        result = self.db.execute(query, (team_id,), fetchone=True)
        return result

    def get_all_players(self, team_id: int):
        query = """
        SELECT player_name, mlbid, idfg, position, grade, analysis
        FROM players
        WHERE team_id = %s;
        """
        results = self.db.execute(query, (team_id,), fetchall=True)
        return results

    def create_opponent_user_and_team(self) -> dict:
        """Create a new 'Opponent User' with a randomly generated team"""
        import random
        from pybaseball import pitching_stats
        
        # Generate unique opponent username
        opponent_username = f"OpponentUser_{random.randint(100000, 999999)}"
        
        # Create opponent user
        user_query = """
        INSERT INTO users (username, password)
        VALUES (%s, %s)
        RETURNING id;
        """
        # Use a random password hash since this user won't login
        import bcrypt
        random_password = bcrypt.hashpw(b"opponent_password", bcrypt.gensalt())
        user_row = self.db.execute(user_query, (opponent_username, random_password), fetchone=True)
        opponent_user_id = user_row.get("id")
        
        # Create opponent team
        team_query = """
        INSERT INTO teams (user_id, team_name)
        VALUES (%s, %s)
        RETURNING id, team_name, user_id;
        """
        team_row = self.db.execute(team_query, (opponent_user_id, "Opponent Team"), fetchone=True)
        opponent_team_id = team_row.get("id")
        
        # Fetch pitching stats and randomly select 5 pitchers
        stats = pitching_stats(2025)
        stats.columns = [c.strip().lower() for c in stats.columns]
        
        # Filter for starters with sufficient innings
        qualified = stats[stats["ip"] >= 50]
        if len(qualified) < 5:
            qualified = stats.head(10)
        
        # Randomly select 5 pitchers
        selected = qualified.sample(n=min(5, len(qualified)))
        
        # Add players to the team
        for _, row in selected.iterrows():
            player_query = """
            INSERT INTO players (team_id, player_name, mlbid, idfg, position, grade, analysis)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
            """
            self.db.execute(player_query, (
                opponent_team_id,
                row["name"],
                None,  # mlbid
                None,  # idfg
                "SP",  # position
                None,  # grade (to be calculated)
                None   # analysis (to be calculated)
            ), fetchone=False)
        
        return {
            "opponent_user_id": opponent_user_id,
            "opponent_team_id": opponent_team_id,
            "opponent_username": opponent_username
        }


# -------------------------
# Player SQL Implementation
# -------------------------
class PlayerDataAccess(PlayerDataAccessInterface):
    def __init__(self, db: Database):
        self.db = db

    def create(self, player: PlayerEntity) -> dict:
        query = """
        INSERT INTO players (team_id, player_name, mlbid, idfg, position, grade, analysis)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id, team_id, player_name, mlbid, idfg, position, grade, analysis;
        """
        return self.db.execute(
            query,
            (
                player.get_team_id(),
                player.get_player_name(),
                player.get_mlbid(),
                player.get_idfg(),
                player.get_position(),
                player.get_grade(),
                player.get_analysis()
            ),
            fetchone=True,
        )

    def read(self, player_name: str) -> Optional[dict]:
        query = "SELECT * FROM players WHERE player_name = %s;"
        return self.db.execute(query, (player_name,), fetchone=True)

    def update(self, player: PlayerEntity) -> dict:
        query = """
        UPDATE players
        SET position = %s, mlbid = %s, idfg = %s
        WHERE player_name = %s
        RETURNING id, team_id, player_name, mlbid, idfg, position;
        """
        return self.db.execute(
            query,
            (
                player.get_position(),
                player.get_mlbid(),
                player.get_idfg(),
                player.get_player_name(),
            ),
            fetchone=True,
        )

    def delete(self, player_name: str, team_id: int) -> dict:
        query = """
        DELETE FROM players
        WHERE player_name = %s
        AND team_id = %s
        RETURNING idfg, team_id;
        """
        return self.db.execute(query, (player_name, team_id), fetchone=True)

    # New: list all players for a team
    def list_by_team(self, team_id: int) -> List[dict]:
        query = """
        SELECT id, team_id, player_name, mlbid, idfg, position
        FROM players
        WHERE team_id = %s;
        """
        return self.db.execute(query, (team_id,), fetchall=True)
