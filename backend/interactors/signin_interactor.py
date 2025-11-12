from database.data_access_interface import UserDataAccessInterface
import bcrypt

class SigninInteractor:

    def __init__(self, user_data_access: UserDataAccessInterface):
        self.user_data_access = user_data_access

    def signin(self, username: str, password: str):

        if not username or not password:
            raise Exception("Username and password are required.")
        
        user_entity = self.user_data_access.read(username)

        if not user_entity:
            raise Exception("Incorrect username or password.")

        password_correct = bcrypt.checkpw(password.encode(), user_entity.get_password())

        if not password_correct:
            raise Exception("Incorrect username or password.")

        return {"username": user_entity.get_username(), "id": user_entity.get_id()}
    