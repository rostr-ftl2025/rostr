# Rostr.

**Problem Domain and Goal:**  
Fantasy baseball is a multi-billion-dollar virtual sports market where players act as general managers of MLB teams. While the market is growing rapidly—valued at $2.3 billion and projected to reach $3.8 billion by 2030—getting started can be overwhelming for beginners, with countless rules, statistics, and strategies making the game intimidating. 

Rostr addresses this by providing an all-in-one personal assistant focused exclusively on pitchers: it grades teams across key pitching stats, recommends optimized lineups, analyzes opponents’ rosters to highlight weaknesses, and evaluates trades. By transforming data into tangible insights, Rostr makes fantasy baseball accessible to first-time players, enabling smarter decisions, enhancing enjoyment, and expanding engagement with the market, ultimately making the game easy, fun, and strategically rewarding.

---

## Features
Rostr is a fantasy baseball assistant designed to make managing your pitching roster easier and more strategic. Its key features include:

- **Pitcher Team Grading:** Quickly see how your pitchers perform across key statistics.  
- **Optimized Lineup Recommendations:** Receive weekly lineup suggestions based on data-driven strategies.  
- **Opponent Roster Analysis:** Identify opponent weaknesses to gain a competitive advantage.  
- **Trade Insights:** Evaluate potential trades, showing which deals benefit you and what your opponent would need to balance the trade.  
- **Actionable Insights:** Transform complex statistics into clear, easy-to-use recommendations for smarter decision-making.  

By focusing exclusively on pitchers for the MVP, Rostr streamlines lineup management, trade decisions, and weekly strategy, helping managers make informed moves and take control of their fantasy baseball season.

---
## User Guide:

Target Persona: Fantasy baseball player with basic tech knowledge.

How to Use:

1. Sign up or log in.
2. Create your fantasy roster your fantasy team.
3. View pitching stats either through starting pitcher page or opponent lineup page
4. Make trades and adjust your lineup based on insights.

---
## Code Architecture
**Overview:**  
The codebase is organized by component and layer: frontend, backend, and database. Naming conventions follow PascalCase for components/classes and camelCase for functions/variables.  

---

## System Architecture
**Stack & Hosting:**  
- **Frontend:** React, hosted on [e.g., Vercel]  
- **Backend:** Node.js/Express, hosted on [e.g., Heroku or AWS EC2]  
- **Database:** PostgreSQL, hosted on [e.g., AWS RDS]  
- **Containerization:** Docker, managed via Docker Compose  

**Component Interaction:**  
The frontend communicates with the backend via REST APIs. The backend queries the database and returns responses to the frontend. Docker Compose ensures seamless networking between all services during development and deployment.  

---

## Installation & Running
**Development Mode:**  
1. Install [Docker](https://www.docker.com/).  
2. From the **project directory**, run:
```bash
docker compose up --build
