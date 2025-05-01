# Service Discovery

This is a Service Discovery API built with .NET that registers, deregisters, and retrieves services dynamically. The services are managed using Consul as the underlying service discovery provider, allowing for efficient load balancing and dynamic service routing within a microservices architecture.

## Features

- **Register Services**: Add microservices to Consul for service discovery.
- **Deregister Services**: Remove microservices from Consul when they are no longer available.
- **List Registered Services**: Retrieve a list of all registered services and their details.
- **Health Check Support**: Each service can define a health check endpoint to ensure its availability.

## Prerequisites

- [.NET SDK 7.0 or later](https://dotnet.microsoft.com/download)
- [Consul](https://www.consul.io/downloads)
- Docker (if you plan to run Consul in a container)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ServiceDiscovery
```

### 2. Configure Consul

Make sure Consul is running locally on port `8500`. You can run it with Docker:

```bash
docker run -d --name=consul -p 8500:8500 consul
```

### 3. Set up Environment Variables

Configure your `appsettings.json` or environment variables to connect to Consul. The default `appsettings.json` should have the following configuration:

```json
{
  "Consul": {
    "Address": "http://localhost:8500"
  }
}
```

### 4. Build and Run the Service

Run the application:

```bash
dotnet run
```

The Service Discovery API will start on `http://localhost:5198`.

## API Endpoints

### 1. Register a Service

Registers a new service with Consul.

- **Endpoint**: `POST /api/service-registry/register`
- **Payload**:
  ```json
  {
    "ServiceName": "your-service-name",
    "Address": "http://service-host",
    "Port": 5000,
    "HealthCheckEndpoint": "/health"
  }
  ```

### 2. Deregister a Service

Deregisters an existing service from Consul.

- **Endpoint**: `DELETE /api/service-registry/deregister/{serviceId}`
- **Path Parameter**: `serviceId` - the ID of the service to deregister

### 3. List Registered Services

Lists all registered services with their details.

- **Endpoint**: `GET /api/service-registry/services`
- **Response**:
  ```json
  {
    "service-name": ["http://service-address:port"]
  }
  ```

## Example Usage

### Registering a Service

```bash
curl -X POST http://localhost:5198/api/service-registry/register -H "Content-Type: application/json" -d '{
  "ServiceName": "cevent-service",
  "Address": "http://localhost",
  "Port": 5000,
  "HealthCheckEndpoint": "/health"
}'
```

### Deregistering a Service

```bash
curl -X DELETE http://localhost:5198/api/service-registry/deregister/cevent-service
```

### Getting Registered Services

```bash
curl -X GET http://localhost:5198/api/service-registry/services
```

## Docker Usage

To run the **Service Discovery** project in Docker, you can use the following command to build and start the container:

```bash
docker build -t servicediscovery .
docker run -p 5198:5198 servicediscovery
```

## Technologies Used

- **.NET 7.0** - Core framework for building the API.
- **Consul** - Service discovery provider.
- **Docker** - For running Consul and the Service Discovery API in containers.

## Troubleshooting

- **Consul Connection Issues**: Ensure Consul is running on `localhost:8500`. Adjust the Consul address in `appsettings.json` if using a different host or port.
- **Health Check Failures**: Ensure that the registered services have a valid health check endpoint.

---
