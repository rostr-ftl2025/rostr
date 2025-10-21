# /project/database/data_access.py

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

    def create(self, user: UserEntity) -> dict:
        query = """
        INSERT INTO users (username, password)
        VALUES (%s, %s)
        RETURNING id, username;
        """
        return self.db.execute(
            query,
            (user.get_username(), user.get_password()),
            fetchone=True,
        )

    def read(self, username: str) -> Optional[dict]:
        query = "SELECT * FROM users WHERE username = %s;"
        return self.db.execute(query, (username,), fetchone=True)

    def update(self, user: UserEntity) -> dict:
        query = """
        UPDATE users
        SET password = %s
        WHERE username = %s
        RETURNING id, username, password;
        """
        return self.db.execute(
            query,
            (user.get_password(), user.get_username()),
            fetchone=True,
        )

    def delete(self, username: str) -> dict:
        query = """
        DELETE FROM users
        WHERE username = %s
        RETURNING id, username;
        """
        return self.db.execute(query, (username,), fetchone=True)


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
        SELECT player_name, mlbid, idfg, position
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
        INSERT INTO players (team_id, player_name, mlbid, idfg, position)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id, team_id, player_name, mlbid, idfg, position;
        """
        return self.db.execute(
            query,
            (
                player.get_team_id(),
                player.get_player_name(),
                player.get_mlbid(),
                player.get_idfg(),
                player.get_position(),
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
