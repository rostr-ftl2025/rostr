from database import Database


class User:
    def __init__(self, db: Database):
        self.db = db

    def create(self, username: str, password: str):
        query = """
        INSERT INTO users (username, password)
        VALUES (%s, %s)
        RETURNING id, username;
        """
        return self.db.execute(query, (username, password), fetchone=True)

    def get_by_username(self, username: str):
        query = "SELECT * FROM users WHERE username = %s;"
        return self.db.execute(query, (username,), fetchone=True)


class Team:
    def __init__(self, db: Database):
        self.db = db

    def create(self, user_id: int, team_name: str):
        query = """
        INSERT INTO teams (user_id, team_name)
        VALUES (%s, %s)
        RETURNING id, team_name;
        """
        return self.db.execute(query, (user_id, team_name), fetchone=True)

    def get_by_user(self, user_id: int):
        query = "SELECT * FROM teams WHERE user_id = %s;"
        return self.db.execute(query, (user_id,), fetchall=True)
    
    def get_all_players(self, team_id: int):
        query = "SELECT * FROM players WHERE team_id = %s;"
        return self.db.execute(query, (team_id,), fetchall=True)



class Player:
    def __init__(self, db: Database):
        self.db = db

    def create(self, team_id: int, player_name: str, mlbid=None, idfg=None, position=None):
        query = """
        INSERT INTO players (team_id, player_name, mlbid, idfg, position)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id, player_name;
        """
        return self.db.execute(query, (team_id, player_name, mlbid, idfg, position), fetchone=True)
    
    def remove(self, team_id: int, player_name: str):
        query = """
        DELETE FROM players 
        WHERE team_id = %s AND player_name = %s
        RETURNING id, player_name;
        """
        return self.db.execute(query, (team_id, player_name), fetchone=True)
