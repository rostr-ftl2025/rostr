from database.data_access_interface import UserDataAccessInterface, TeamDataAccessInterface

class SignupInteractor:

    def __init__(self, user_data_access: UserDataAccessInterface, team_data_access: TeamDataAccessInterface):
        self.user_data_access = user_data_access
        self.team_data_access = team_data_access

    def signup(self, username: str, password: str):

        if not username or not password:
            raise Exception("Username and password are required.")
        
        existing_user = self.user_data_access.read(username)
        if existing_user:
            raise Exception("A user with the same username already exists.")
        
        user_entity = self.user_data_access.create(username, password)
        
        # Create and assign an opponent team
        opponent_info = self.team_data_access.create_opponent_user_and_team()
        self.user_data_access.assign_opponent_team(username, opponent_info["opponent_team_id"])

        return {"username": user_entity.get_username()}
    