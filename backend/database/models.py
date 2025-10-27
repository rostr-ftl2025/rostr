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

    def create(self, team_id: int, player_name: str, mlbid=None, idfg=None, position=None, grade = 0.0):
        query = """
        INSERT INTO players (team_id, player_name, mlbid, idfg, position, grade)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id, player_name;
        """
        return self.db.execute(query, (team_id, player_name, mlbid, idfg, position, grade), fetchone=True)

    def get_by_team(self, team_id: int):
        query = "SELECT * FROM players WHERE team_id = %s;"
        return self.db.execute(query, (team_id,), fetchall=True)

    def calculate_pitcher_grade(self, stats: dict) -> float:
        """
        Calculate a pitcher's grade using the fantasy formula:
        Grade = 150 × K% + 0.3 × IP − 10 × ERA
        Weights based on typical fantasy baseball head-to-head (H2H) scoring systems, which reward 
        strikeouts (K%) heavily, innings pitched (IP) moderately, and punish high ERA significantly
        """
        try:
            k_percent = stats.get("K%")
            ip = stats.get("IP")
            era = stats.get("ERA")

            if k_percent is None or ip is None or era is None:
                raise ValueError("Missing required pitching stats.")

            grade = 150 * k_percent + 0.3 * ip - 10 * era
            return round(grade, 2)

        except Exception as e:
            print(f"Error calculating pitcher grade: {e}")
            return 0.0