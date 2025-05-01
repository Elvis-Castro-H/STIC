# Event Bus API

The Event Bus API is a central service that facilitates event-driven communication between multiple microservices. It allows services to subscribe to specific event types and receive notifications whenever an event of that type is published. This architecture enables decoupled microservices, improving scalability and flexibility.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup and Running](#setup-and-running)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Testing the Event Bus API](#testing-the-event-bus-api)
- [Examples](#examples)

---

## Overview

The Event Bus API provides two main functionalities:

1. **Subscribe**: Microservices can subscribe to specific events by specifying an event type and a callback URL.
2. **Publish**: Any service can publish an event with a specific event type and payload. The Event Bus forwards the event data to all subscribers registered for that event type.

This service is designed to scale as more microservices join the ecosystem without requiring changes to the Event Bus itself.

---

## Features

- **Dynamic Subscription Management**: Microservices can subscribe to any event type dynamically, without requiring predefined schemas.
- **Flexible Event Payloads**: Event payloads are handled dynamically using `JToken`, allowing any JSON structure.
- **Scalable Architecture**: Designed to support multiple microservices without modifications as new services are added.

---

## Prerequisites

- [.NET 5 or later](https://dotnet.microsoft.com/download/dotnet)
- [MongoDB](https://www.mongodb.com/try/download/community)
  - You can either install MongoDB locally or run it using Docker (recommended).
- Optional: [Webhook.site](https://webhook.site) for testing webhooks.

---

## Setup and Running

### 1. Clone the Repository

```bash
git clone https://github.com/sofdev6-02-2024/Solidarios.git
cd event-bus-api
```

### 2. Set Up MongoDB with Docker

To run MongoDB in a Docker container, use the following command:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

This command:

- Downloads the latest MongoDB Docker image (if not already downloaded).
- Runs MongoDB in a container named `mongodb` on port `27017`.

### 3. Create a `.env` File

In the root directory of your project, create a `.env` file and add the MongoDB settings as environment variables.

#### Example `.env` File

```env
MONGO_CONNECTION_STRING=mongodb://localhost:27017
MONGO_DATABASE_NAME=EventBusDatabase
MONGO_COLLECTION_NAME=Subscriptions
```

### 4. Install Dependencies

```bash
dotnet restore
```

### 5. Run the Application

```bash
dotnet run
```

The application will start on `http://localhost:5233` by default.

## Environment Variables

The application uses a `.env` file to manage configuration, allowing you to keep sensitive or environment-specific information out of `appsettings.json`.

### Environment Variables Used

- **MONGO_CONNECTION_STRING**: The MongoDB connection string.
- **MONGO_DATABASE_NAME**: The name of the database used for storing subscriptions.
- **MONGO_COLLECTION_NAME**: The collection name within the database where subscriptions are stored.

### Loading Environment Variables

The application loads environment variables using the `DotNetEnv` library. If you need to modify MongoDB settings, update the values in the `.env` file.

---

## API Endpoints

### 1. **Subscribe to an Event**

- **Endpoint**: `POST /api/events/subscribe`
- **Query Parameter**: `eventType` - The type of event to subscribe to.
- **Body**: Callback URL where events of the specified type should be sent.

**Example Request**:

```json
POST /api/events/subscribe?eventType=OrderCreated
Body: "http://example.com/webhook"
```

**Response**:

- `200 OK` if the subscription was successful.

### 2. **Publish an Event**

- **Endpoint**: `POST /api/events/publish`
- **Body**: JSON object with `eventType` and `data` fields.

**Example Request**:

```json
{
  "eventType": "OrderCreated",
  "data": {
    "OrderId": "e3c0b2fa-efae-42f6-8e07-d303f6e3f021",
    "CreatedAt": "2024-11-11T10:00:00Z",
    "CustomerName": "John Doe",
    "TotalAmount": 99.99
  }
}
```

**Response**:

- `200 OK` if the event was successfully forwarded to all subscribers.

---

## Testing the Event Bus API

### Step 1: Set Up a Webhook to Receive Events

For testing, you can use a service like [Webhook.site](https://webhook.site) to create a temporary URL that will display any received requests.

1. Go to [Webhook.site](https://webhook.site).
2. Copy the generated URL (e.g., `https://webhook.site/your-unique-id`).

### Step 2: Subscribe to an Event

1. Use Swagger, Postman, or curl to send a `POST` request to the `/subscribe` endpoint.
2. Provide the event type you want to subscribe to and the Webhook.site URL as the callback.

**Example**:

```bash
curl -X POST "http://localhost:5000/api/events/subscribe?eventType=OrderCreated" \
-H "Content-Type: application/json" \
-d "\"https://webhook.site/your-unique-id\""
```

### Step 3: Publish an Event

1. Publish an event of type `OrderCreated` with sample data.
2. The Event Bus will forward this event to all subscribers of `OrderCreated`, including your Webhook.site URL.

**Example**:

```bash
curl -X POST "http://localhost:5000/api/events/publish" \
-H "Content-Type: application/json" \
-d '{
  "eventType": "OrderCreated",
  "data": {
    "OrderId": "e3c0b2fa-efae-42f6-8e07-d303f6e3f021",
    "CreatedAt": "2024-11-11T10:00:00Z",
    "CustomerName": "John Doe",
    "TotalAmount": 99.99
  }
}'
```

### Step 4: Verify the Webhook Received the Event

Go back to Webhook.site and check the logs. You should see the event data displayed, verifying that the Event Bus correctly forwarded the event.

---

## Examples

### Example Subscription

To subscribe a service to an `OrderCreated` event with a callback URL of `http://example.com/webhook`:

```json
POST /api/events/subscribe?eventType=OrderCreated
Body: "http://example.com/webhook"
```

### Example Event Publication

Publishing an `OrderCreated` event with sample order data:

```json
POST /api/events/publish
{
   "eventType": "OrderCreated",
   "data": {
      "OrderId": "e3c0b2fa-efae-42f6-8e07-d303f6e3f021",
      "CreatedAt": "2024-11-11T10:00:00Z",
      "CustomerName": "John Doe",
      "TotalAmount": 99.99
   }
}
```

---

## Notes

- **Event Types**: Each event type is a unique identifier that allows services to filter which events they’re interested in.
- **Flexible Data Payloads**: The `data` field is stored as dynamic JSON (`JToken`), allowing for any structure of JSON data in the payload.
- **MongoDB Persistence**: Subscriptions are stored in MongoDB, so they persist even if the Event Bus is restarted.

---

## Troubleshooting

- **400 Bad Request**: If you encounter validation errors, ensure that the JSON structure in your request matches the expected format in this README.
- **Callback URL Not Triggered**: Make sure the webhook service is reachable and that the subscription was successful.
