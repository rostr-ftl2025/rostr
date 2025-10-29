from typing import List, Optional
from database import Database
from database.entities.user_entity import UserEntity
from database.entities.team_entity import TeamEntity
from database.entities.player_entity import PlayerEntity
from database.data_access_interface import (
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
        query = "SELECT id, username, password FROM users WHERE username = %s;"
        row = self.db.execute(query, (username,), fetchone=True)
        if not row:
            return None
        return UserEntity(row.get("username"), row.get("password"), row.get("id"))

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

    def delete(self, team_name: str):
        query = """
        DELETE FROM teams
        WHERE team_name = %s
        RETURNING id, team_name;
        """
        result = self.db.execute(query, (team_name,), fetchone=True)
        return result

    def get_all_players(self, team_id: int):
        query = """
        SELECT player_name, mlbid, idfg, position, grade
        FROM players
        WHERE team_id = %s;
        """
        results = self.db.execute(query, (team_id,), fetchall=True)
        return results


# -------------------------
# Player SQL Implementation
# -------------------------
class PlayerDataAccess(PlayerDataAccessInterface):
    def __init__(self, db: Database):
        self.db = db

    def create(self, player: PlayerEntity) -> dict:
        query = """
        INSERT INTO players (team_id, player_name, mlbid, idfg, position, grade)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id, team_id, player_name, mlbid, idfg, position, grade;
        """
        return self.db.execute(
            query,
            (
                player.get_team_id(),
                player.get_player_name(),
                player.get_mlbid(),
                player.get_idfg(),
                player.get_position(),
                player.get_grade()
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

    def delete(self, player_name: str) -> dict:
        query = """
        DELETE FROM players
        WHERE player_name = %s
        RETURNING id, player_name;
        """
        return self.db.execute(query, (player_name,), fetchone=True)

    # New: list all players for a team
    def list_by_team(self, team_id: int) -> List[dict]:
        query = """
        SELECT id, team_id, player_name, mlbid, idfg, position
        FROM players
        WHERE team_id = %s;
        """
        return self.db.execute(query, (team_id,), fetchall=True)
