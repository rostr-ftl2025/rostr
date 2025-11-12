from database.data_access_interface import UserDataAccessInterface

class SignupInteractor:

    def __init__(self, user_data_access: UserDataAccessInterface):
        self.user_data_access = user_data_access

    def signup(self, username: str, password: str):

        if not username or not password:
            raise Exception("Username and password are required.")
        
        existing_user = self.user_data_access.read(username)
        if existing_user:
            raise Exception("A user with the same username already exists.")
        
        user_entity = self.user_data_access.create(username, password)

        return {"username": user_entity.get_username()}
    