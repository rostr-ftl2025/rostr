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


class Player:
    def __init__(self, db: Database):
        self.db = db

    def create(self, team_id: int, player_name: str, mlbid=None, idfg=None, position=None):
        query = """
        INSERT INTO players (team_id, player_name, mlbid, idfg, position, grade)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id, player_name;
        """
        return self.db.execute(query, (team_id, player_name, mlbid, idfg, position), fetchone=True)

    def get_by_team(self, team_id: int):
        query = "SELECT * FROM players WHERE team_id = %s;"
        return self.db.execute(query, (team_id,), fetchall=True)

    def calculate_pitcher_grade(stats:dict) -> float:
        """
        Calculate a pitcher's grade (0-100) using weighted MLB stats.
        stats: dict containing the keys:
        ERA, WAR, O_Swing, Contact, Zone, Pace, wSL_C, GS
        """
        weights = {
            'WAR': 0.25,
            'ERA': 0.25,
            'O_Swing': 0.10,
            'Contact': 0.10,
            'Zone': 0.10,
            'Pace': 0.05,
            'wSL_C': 0.05,
            'Durability': 0.10
        }

        # Normalize values to 0–1
        ERA_norm = max(0, min(1, (5 - stats['ERA']) / (5 - 1.5)))
        WAR_norm = min(1, stats['WAR'] / 9)
        O_Swing_norm = min(1, stats['O_Swing'] / 0.4)
        Contact_norm = max(0, min(1, (0.8 - stats['Contact']) / (0.8 - 0.65)))
        Zone_norm = min(1, stats['Zone'] / 0.55)
        Pace_norm = max(0, min(1, (26 - stats['Pace']) / (26 - 20)))
        wSL_norm = max(0, min(1, (stats['wSL_C'] + 3) / 6))
        Durability_norm = min(1, stats['GS'] / 34)

        # Weighted average
        grade = (
            weights['WAR'] * WAR_norm +
            weights['ERA'] * ERA_norm +
            weights['O_Swing'] * O_Swing_norm +
            weights['Contact'] * Contact_norm +
            weights['Zone'] * Zone_norm +
            weights['Pace'] * Pace_norm +
            weights['wSL_C'] * wSL_norm +
            weights['Durability'] * Durability_norm
        ) * 100

        return round(grade, 2)