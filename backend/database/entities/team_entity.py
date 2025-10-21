class TeamEntity:
    def __init__(self, user_id: int, team_name: str):
        self.__user_id = user_id
        self.__team_name = team_name

    def get_user_id(self) -> int:
        return self.__user_id

    def get_team_name(self) -> str:
        return self.__team_name

    def set_team_name(self, team_name: str) -> None:
        self.__team_name = team_name
