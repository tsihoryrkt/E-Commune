# E-Commune

## Description

E-Commune is a web application designed for project management within a municipality. It provides tools for managing tasks, projects, and users, facilitating efficient collaboration and oversight of municipal operations.

The application is containerized using Docker and orchestrated with Docker Compose, consisting of a React frontend, a Node.js/Express backend, and a MongoDB database.

## Technologies Used

- **Frontend:** React.js, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Containerization:** Docker, Docker Compose
- **Others:** Axios (for HTTP requests), JSON Web Tokens (JWT) for authentication

## Prerequisites

To run this application, you will need the following installed on your system:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup and Running the Project

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Environment Variables:**
    The application is configured to run with Docker Compose, which handles necessary environment variables (like `MONGO_URI` for the backend to connect to the MongoDB container).
    If you intend to run the backend service locally outside of Docker (e.g., for development), you would need to ensure a MongoDB instance is accessible and potentially set the `MONGO_URI` environment variable manually (e.g., `export MONGO_URI=mongodb://localhost:27017/E-Commune`). However, for Docker-based deployment, this is managed.

3.  **Build and Run the Application:**
    Use Docker Compose to build the images and start the services in detached mode:
    ```bash
    docker-compose up -d --build
    ```
    This command will build the Docker images for the frontend and backend services (if they don't exist or if changes are detected) and then start all defined services.

## Services

The application consists of the following services managed by Docker Compose:

-   **Frontend:**
    -   Accessible at: `http://localhost:80`
    -   Serves the React single-page application.
-   **Backend:**
    -   Accessible at: `http://localhost:5000` (for API calls)
    -   Provides the RESTful API for the application.
-   **MongoDB (`mongo` service):**
    -   Database service for the application.
    -   Accessible on `mongodb://localhost:27017/E-Commune` from the host machine if you wish to connect directly (e.g., with MongoDB Compass), due to the port mapping in `docker-compose.yml`. The backend service connects to it using the service name `mongo` within the Docker network.

## Project Structure

The project is organized into two main directories:

-   `frontend/`: Contains the React.js application code, including components, services, and assets.
-   `backend/`: Contains the Node.js/Express.js application code, including API routes, controllers, models, and database connection logic.

## Stopping the Application

To stop all running services, use the following command in the project root directory:
```bash
docker-compose down
```
This will stop and remove the containers. Add the `-v` flag if you also want to remove the named volumes (e.g., `mongo-data`): `docker-compose down -v`.

## Accessing Logs

You can view the logs for a specific service using:
```bash
docker-compose logs <service_name>
```
For example, to view backend logs:
```bash
docker-compose logs backend
```
To follow the logs in real-time:
```bash
docker-compose logs -f <service_name>
```

## Persistent Data

The application uses Docker volumes to persist data:

-   **MongoDB Data:** User data, project details, tasks, etc., are stored in MongoDB. This data is persisted in a Docker named volume called `mongo-data`. This means that even if you stop and remove the MongoDB container, the data will remain intact as long as the volume is not explicitly deleted.
-   **Backend Uploads:** Any files uploaded to the backend (e.g., user profile pictures, project attachments) are stored in the `./backend/uploads` directory on the host machine, which is mounted into the backend container at `/usr/src/app/uploads`. This ensures that uploaded files are also persisted.

---
*This README provides a comprehensive guide to setting up, running, and managing the E-Commune application using Docker.*
