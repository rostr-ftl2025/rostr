import psycopg
from psycopg.rows import dict_row


class Database:
    """Handles connection to PostgreSQL using psycopg 3.2"""

    def __init__(self, dsn: str):
        self.dsn = dsn
        self.conn = None

    def connect(self):
        if not self.conn or self.conn.closed:
            self.conn = psycopg.connect(self.dsn, row_factory=dict_row)
        return self.conn

    def close(self):
        if self.conn and not self.conn.closed:
            self.conn.close()

    def execute(self, query: str, params=None, fetchone=False, fetchall=False):
        """Utility to run SQL safely"""
        with self.connect().cursor() as cur:
            cur.execute(query, params or ())
            if fetchone:
                return cur.fetchone()
            elif fetchall:
                return cur.fetchall()
            self.conn.commit()
