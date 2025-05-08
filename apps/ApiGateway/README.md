# API Gateway

The API Gateway serves as the entry point for client applications to communicate with multiple microservices. It routes requests to the appropriate services, handles authentication, and manages service discovery using Consul.

## Project Structure

- **Controllers**: Contains controllers to handle incoming requests and route them to the correct microservices.
- **CustomServiceDiscovery**: A service discovery helper that interacts with Consul or a custom service registry API to dynamically fetch service endpoints.
- **RequestRouter**: A class responsible for redirecting incoming requests to the correct microservice endpoint based on service discovery data.

## Prerequisites

- [.NET SDK 8.0](https://dotnet.microsoft.com/download) (or the version defined in the project)
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- Consul (can be run as a Docker container)

## Environment Variables

- `SERVICE_DISCOVERY_URL`: The URL of the service discovery API (e.g., `http://servicediscovery:5198/api/service-registry/services` if using Docker Compose).

## Running the Project

### Running Locally (without Docker)

1. Make sure all microservices are running on your local machine.
2. Set the environment variable `SERVICE_DISCOVERY_URL` to point to your service registry or manually configure each service URL.
3. Run the API Gateway:

   ```bash
   dotnet run
   ```

### Running with Docker Compose

1. Ensure Docker and Docker Compose are installed.
2. Build and run the containers:

   ```bash
   docker-compose -f docker-compose.gateway.yml up --build
   ```

   This command starts the API Gateway, Consul, and Service Discovery defined in `docker-compose.gateway.yml`.

3. Access the API Gateway at `http://localhost:5105`.

## API Endpoints

The API Gateway dynamically routes requests to different microservices. Below is an example of the available endpoints:

- **GET /api/{serviceName}/[path]**: Routes a GET request to the `{serviceName}` microservice at the specified path.
- **POST /api/{serviceName}/[path]**: Routes a POST request to the `{serviceName}` microservice.
- **Other HTTP Methods**: Supported for dynamic routing to microservices.

> **Note**: Replace `{serviceName}` with the name of the service as registered in Consul or your service discovery.

## Example Usage with Postman

1. Set up the request URL in Postman (e.g., `http://localhost:5105/cevent-service/api/Events/homepage?page=1&pageSize=10`).
2. If authorization is required, add a `Bearer Token` in the Authorization tab with the provided token.
3. Send the request and view the response.

## Development

To develop and test locally, you may set environment variables in a `.env` file in the `ApiGateway` project directory, for example:

```plaintext
SERVICE_DISCOVERY_URL=http://localhost:5198/api/service-registry/services
ASPNETCORE_ENVIRONMENT=Development
```

## Troubleshooting

- **Connection Refused Error**: If you get a "Connection Refused" error, ensure the target service is running and accessible. If running locally, make sure the correct host IP is set based on your OS (e.g., `host.docker.internal` on Windows/Mac).
- **Service Not Found**: Ensure services are registered in Consul or your service discovery and that the correct URL is set in `SERVICE_DISCOVERY_URL`.
