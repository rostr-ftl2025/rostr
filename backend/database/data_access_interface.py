from abc import ABC, abstractmethod
from typing import List, Optional
from database.entities.user_entity import UserEntity
from database.entities.team_entity import TeamEntity
from database.entities.player_entity import PlayerEntity


# -------------------------
# User Interface
# -------------------------
class UserDataAccessInterface(ABC):
    @abstractmethod
    def create(self, user: UserEntity) -> dict:
        pass

    @abstractmethod
    def read(self, username: str) -> Optional[dict]:
        pass

    @abstractmethod
    def update(self, user: UserEntity) -> dict:
        pass

    @abstractmethod
    def delete(self, username: str) -> dict:
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
    def delete(self, team_name: str) -> dict:
        pass

    @abstractmethod
    def get_all_players(self, team_id: int) -> List[dict]:
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
    def delete(self, player_name: str) -> dict:
        pass

    # New: get all players for a specific team
    @abstractmethod
    def list_by_team(self, team_id: int) -> List[dict]:
        """
        Return all players that belong to the given team_id.
        """
        pass
