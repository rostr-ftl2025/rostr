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
        Calculates a 0-100 fantasy pitcher grade based on
        the difference between actual and expected stats.

        Equal weight for BA, SLG, wOBA, and ERA.
        """

        # Extract stats safely
        BA, xBA = stats.get("BA", 0), stats.get("xBA", 0)
        SLG, xSLG = stats.get("SLG", 0), stats.get("xSLG", 0)
        wOBA, xwOBA = stats.get("wOBA", 0), stats.get("xwOBA", 0)
        ERA, xERA = stats.get("ERA", 0), stats.get("xERA", 0)

        # Calculate differences (expected - actual)
        BA_diff = xBA - BA
        SLG_diff = xSLG - SLG
        wOBA_diff = xwOBA - wOBA
        ERA_diff = xERA - ERA

        # Equal weights
        weight = 0.25

        # Multipliers for normalization
        m_ba = 1000
        m_slg = 1000
        m_woba = 1000
        m_era = 10

        # Combine weighted differences
        delta = weight * (
            m_ba * BA_diff +
            m_slg * SLG_diff +
            m_woba * wOBA_diff +
            m_era * ERA_diff
        )

        # Base score (50 neutral)
        grade = 50 + delta
        return round(max(0, min(100, grade)), 2)