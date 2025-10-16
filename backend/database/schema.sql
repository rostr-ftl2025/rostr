CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password BYTEA NOT NULL
);


CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    team_name VARCHAR(150) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    team_id INT NOT NULL,
    player_name VARCHAR(150) NOT NULL,
    mlbid VARCHAR(50),
    idfg VARCHAR(50),
    position VARCHAR(50),
    grade FLOAT,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);
