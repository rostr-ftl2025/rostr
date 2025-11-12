from typing import Optional

class UserEntity:
    def __init__(self, username: str, password: Optional[bytes] = None, id: Optional[int] = None):
        self.__id = id
        self.__username = username
        self.__password = password

    def get_id(self) -> Optional[int]:
        return self.__id

    def set_id(self, id: Optional[int]) -> None:
        self.__id = id

    def get_username(self) -> str:
        return self.__username

    def get_password(self) -> Optional[bytes]:
        return self.__password

    def set_username(self, username: str) -> None:
        self.__username = username

    def set_password(self, password: Optional[bytes]) -> None:
        self.__password = password
