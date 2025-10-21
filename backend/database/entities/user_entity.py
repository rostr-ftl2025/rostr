class UserEntity:
    def __init__(self, username: str, password: str):
        self.__username = username
        self.__password = password

    def get_username(self) -> str:
        return self.__username

    def get_password(self) -> str:
        return self.__password

    def set_username(self, username: str) -> None:
        self.__username = username

    def set_password(self, password: str) -> None:
        self.__password = password
