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
- Docker Engine and Docker Compose installed on your local machine (Docker Desktop includes both of them)

### Run
- Clone the repo to a local directory
- Run "docker-compose up -d" in the project root (make sure Docker Engine is up and running)
- Once the containers are up, you can open your browser and access the UI at http://localhost:3000.
- You can directly send requests to the backend API at http://localhost:8080/api if you want to.
- Check Swagger UI from http://localhost:8080/swagger-ui to get API specs
- PGAdmin is set up at http://localhost:5050/. 

### PGAdmin Connection Setup
- After accessing the PGAdmin at http://localhost:5050/, enter "app@test.com" as Username and "secret" as Password. Then in the main page, select "Add New Server" -> Under "General" tab, enter "db" for "Name", switch to "Connection" tab, "Host name" is "db", "Username" is "admin", "Password" is "secret". Then hit "Save".

### Tips
- After registering your first user, you should update it from PGAdmin UI to set its role as "ADMIN", to fully access the API. Other users can stay as "AGENCY".
- You can use the requests in json files in the repo root to bulk insert locations and transportations, if you want. (POST api/locations/bulk and POST api/transportations/bulk)


## Tech Stack
### Backend:
- Java + Spring Boot
- PostgreSQL (with Testcontainers for unit testing)
- Spring Security (JWT authentication)
- Hibernate (JPA for database interactions)
- Liquibase (DB Migration Management)
- Maven

### Frontend:
- React
- React Router
- Axios (for API requests)
- Tailwind CSS

## Tests:
### Backend:
- Tests are not executed during the Docker build process to avoid nested containerization.
- You can manually run the tests by executing ./mvnw test in the /backend directory.
- Unit tests should be configured as prerequisite step before the actual build in CI/CD pipelines.


## Concessions:
- For the purpose of a quick start and as a proof of concept, plain-text passwords and keys are used in the .env and application.properties files. This is not secure and should be addressed immediately in any production-level application derived from this project.