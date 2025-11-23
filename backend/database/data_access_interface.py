from abc import ABC, abstractmethod
from typing import List, Optional
from .entities.user_entity import UserEntity
from .entities.team_entity import TeamEntity
from .entities.player_entity import PlayerEntity


# -------------------------
# User Interface
# -------------------------
class UserDataAccessInterface(ABC):
    @abstractmethod
    def create(self, username: str, password: Optional[bytes] = None) -> UserEntity:
        """
        Create a user from primitive data and return the created UserEntity
        (do NOT include secrets in the returned entity).
        """
        pass

    @abstractmethod
    def read(self, username: str) -> Optional[UserEntity]:
        """
        Return a UserEntity for the given username or None if not found.
        """
        pass

    @abstractmethod
    def update(self, username: str, password: Optional[bytes]) -> Optional[UserEntity]:
        """
        Update the user's password and return the updated UserEntity.
        """
        pass

    @abstractmethod
    def delete(self, username: str) -> Optional[UserEntity]:
        """
        Delete the user and return the deleted UserEntity (or None if not found).
        """
        pass

    @abstractmethod
    def assign_opponent_team(self, username: str, opponent_team_id: int) -> Optional[UserEntity]:
        """
        Assign an opponent team to a user.
        """
        pass

    @abstractmethod
    def get_opponent_team_id(self, username: str) -> Optional[int]:
        """
        Get the opponent team ID assigned to a user.
        """
        pass


# -------------------------
# Team Interface
# -------------------------
class TeamDataAccessInterface(ABC):
    @abstractmethod
    def create(self, team_entity: TeamEntity) -> dict:
        pass

    @abstractmethod
    def read(self, user_id: int) -> List[dict]:
        pass

    @abstractmethod
    def update(self, team_entity: TeamEntity) -> dict:
        pass

    @abstractmethod
    def delete(self, team_id: int) -> dict:
        pass

    @abstractmethod
    def get_all_players(self, team_id: int) -> List[dict]:
        pass

    @abstractmethod
    def create_opponent_user_and_team(self) -> dict:
        """
        Create a new opponent user with a randomly generated team.
        Returns dict with opponent_user_id, opponent_team_id, and opponent_username.
        """
        pass


# -------------------------
# Player Interface
# -------------------------
class PlayerDataAccessInterface(ABC):
    @abstractmethod
    def create(self, player: PlayerEntity) -> dict:
        pass

    @abstractmethod
    def read(self, player_name: str) -> Optional[dict]:
        pass

    @abstractmethod
    def update(self, player: PlayerEntity) -> dict:
        pass

    @abstractmethod
    def delete(self, player_name: str, team_id: int) -> dict:
        pass

    # New: get all players for a specific team
    @abstractmethod
    def list_by_team(self, team_id: int) -> List[dict]:
        """
        Return all players that belong to the given team_id.
        """
        pass
