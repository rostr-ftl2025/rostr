from ..database.data_access_interface import UserDataAccessInterface, TeamDataAccessInterface
import bcrypt

class SigninInteractor:

    def __init__(self, user_data_access: UserDataAccessInterface, team_data_access: TeamDataAccessInterface):
        self.user_data_access = user_data_access
        self.team_data_access = team_data_access

    def signin(self, username: str, password: str):

        if not username or not password:
            raise Exception("Username and password are required.")
        
        user_entity = self.user_data_access.read(username)

        if not user_entity:
            raise Exception("Incorrect username or password.")

        password_correct = bcrypt.checkpw(password.encode(), user_entity.get_password())

        if not password_correct:
            raise Exception("Incorrect username or password.")
        
        # Check if user has an opponent team assigned
        opponent_team_id = user_entity.get_opponent_team_id()
        if not opponent_team_id:
            # Assign a new opponent team
            opponent_info = self.team_data_access.create_opponent_user_and_team()
            self.user_data_access.assign_opponent_team(username, opponent_info["opponent_team_id"])
            opponent_team_id = opponent_info["opponent_team_id"]

        return {
            "username": user_entity.get_username(), 
            "id": user_entity.get_id(),
            "opponent_team_id": opponent_team_id
        }
    