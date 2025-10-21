class PlayerEntity:
    def __init__(self, team_id: int, player_name: str, mlbid: int, idfg: int, position: str):
        self.__team_id = team_id
        self.__player_name = player_name
        self.__mlbid = mlbid
        self.__idfg = idfg
        self.__position = position

    def get_team_id(self) -> int:
        return self.__team_id

    def get_player_name(self) -> str:
        return self.__player_name

    def get_mlbid(self) -> int:
        return self.__mlbid

    def get_idfg(self) -> int:
        return self.__idfg

    def get_position(self) -> str:
        return self.__position

    def set_player_name(self, player_name: str) -> None:
        self.__player_name = player_name

    def set_mlbid(self, mlbid: int) -> None:
        self.__mlbid = mlbid

    def set_idfg(self, idfg: int) -> None:
        self.__idfg = idfg

    def set_position(self, position: str) -> None:
        self.__position = position
