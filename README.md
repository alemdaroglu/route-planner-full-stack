# Route Planner (Full Stack)

## Overview
Route Planner is a full-stack web application that allows users to find available routes between locations. It features a Spring Boot backend with a PostgreSQL database and a React frontend for a seamless user experience.

## Features
- **User Authentication**: Secure login and registration using JWT.
- **Route Planning**: Find matching routes using an optimized algorithm.
- **Database Integration**: Uses PostgreSQL with Testcontainers for testing.
- **Frontend UI**: Built with React to interact with the backend API.

## Quick Start
### Prerequisites
- Docker Engine

### Run
- Clone the repo to a local directory
- Run "docker-compose up -d" in the project root (make sure Docker Engine is up and running)
- That's it: You can check the UI from http://localhost:3000. 
- You can directly send requests to http://localhost:8080/api if you want to.
- Check Swagger UI from http://localhost:8080/swagger-ui to get API specs
- PGAdmin is set up at http://localhost:5050/. First time you go there, you'll need to set up the db connection. Select "Add New Server" -> Under "General", enter "db" for "Name", switch to "Connection" tab, "Host name" is "db", "Username" is "admin", "Password" is "secret". Then hit "Save".

### Tips
- After registering your first user, you should update it from PGAdmin UI to set its role as "ADMIN", to fully access the API. Other users can stay as "AGENCY".
- You can use the requests in json files in the repo root to bulk insert locations and transportations, if you want. (POST api/locations/bulk and POST api/transportations/bulk)


## Tech Stack
### Backend:
- Java + Spring Boot
- PostgreSQL (with Testcontainers for testing)
- Spring Security (JWT authentication)
- Hibernate (JPA for database interactions)
- Maven

### Frontend:
- React
- React Router
- Axios (for API requests)
- Tailwind CSS

### Backend Tests:
- Tests are skipped during builds due to avoid nested containerization
- It should be configured as another step in CI/CD pipelines
- You can execute "./mvnw test" in the "/backend" directory to manually run the unit tests
